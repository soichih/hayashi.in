---
title: 'Running open-source LLMs on your own machine'
description: 'What I learned running local LLMs on consumer GPUs for a year — Ollama, VRAM math, thinking-mode traps, and why the setup that finally worked looks nothing like the one I started with.'
date: 2025-07-05
updated: 2026-07-18
tags:
  - AI
  - LLM
  - Ollama
categories:
  - Engineering
showHeroImage: false
comments: true
---

A year ago I wrote a post about running a quantized model locally using `transformers` and `bitsandbytes` — `uv venv`, `pip install torch`, a 4-bit Gemma, and a cake prompt. It worked. It was also, in hindsight, the wrong way to think about the problem.

The real question was never "can I load a model in Python?" The question was: **can I run a local model well enough, fast enough, and reliably enough that it becomes part of my daily workflow instead of a demo I run once and forget.** The answer turned out to be yes — but getting there required unlearning most of what the first setup taught me.

Here's what the working setup looks like and what I learned along the way.

## From `transformers` to Ollama

The `transformers` + `bitsandbytes` approach is fine for experimentation. It is not fine when you want an always-on inference server that an assistant can call hundreds of times a day. Loading weights into a Python process on every invocation, managing GPU memory by hand, writing your own chat loop — these are things that nobody should be doing in 2026 when [Ollama](https://ollama.com) exists.

Ollama is a single binary that runs as a systemd service, exposes a clean HTTP API on `127.0.0.1:11434`, handles model pulling, quantization, GPU memory management, and request queuing. You install it, `ollama pull qwen3.5:9b`, and you have an OpenAI-compatible endpoint serving a 9-billion-parameter model from your GPU. That's the floor. Everything above it — tool calling, streaming, multi-modal, structured output — Ollama handles or at least doesn't get in the way of.

I migrated off LMStudio for the same reason: it was a GUI wrapper around the same underlying inference, but its OpenAI-compatible shim silently failed on explicit model overrides in ways that were hard to debug. Ollama's API is simpler, its behavior is more predictable, and when something breaks the logs actually tell you what happened.

## The VRAM cliff

Here's the part that took me embarrassingly long to figure out.

My machine has two GPUs: an RTX 2080 Ti with 11 GB of VRAM and a GTX 1070 with 8 GB. The 2080 Ti is enough for a 9B model in 4-bit quantization (roughly 5–6 GB for weights) with room left over for the KV cache. Or so I thought. In practice, every local model I ran was timing out. Responses that should have taken 3 seconds took 30. Streaming felt like dial-up. I blamed the inference engine, then the model, then the quantization. I swapped components looking for the culprit. The actual cause turned out to be one configuration variable: `num_ctx`.

Here's the math that nobody puts in the documentation. A model's memory footprint has two parts:

1. **Weights** — fixed, proportional to parameter count and quantization level. A 9B model in 4-bit is ~5–6 GB. This doesn't change with context length.
2. **KV cache** — grows linearly with context window. At small context lengths this is negligible. At 256K tokens it's 8+ GB. At 1M tokens it's 30+ GB.

My configuration tool had set each model's `num_ctx` to its **advertised maximum context window** — 256K for Qwen 3.5, 1M for Granite 4. On an 11 GB card, that meant the KV cache allocation alone exceeded VRAM before a single token was generated. Ollama doesn't crash when this happens — it spills the overflow into system RAM and runs that portion on CPU. Your model loads. It responds. It just does so at a fraction of the speed, and every request times out.

The fix was to cap `num_ctx` per model to the largest value that keeps the entire working set in VRAM. You verify this with `ollama ps` — it reports the GPU/CPU split directly. If you see anything other than 100%/0%, your `num_ctx` is too high for your card. Drop it until the entire model fits. The difference between 80% GPU and 100% GPU is not 20% slower — it's the difference between "token streaming works" and "every request times out," because the CPU fallback path isn't just slower, it also blocks the GPU pipeline.

The advertised 256K or 1M context windows are marketing specs, not usable configurations on consumer hardware — and the tools that auto-configure `num_ctx` to the advertised max are setting you up for the same cliff.

## The thinking-model trap

Once VRAM was sorted, a different problem emerged. I was running Qwen 3.5 as the default model for delegated sub-agent tasks — research, log analysis, code investigation. Some of these tasks involve structured output: JSON extraction, tool calls, specific formats. A subset of them would consistently time out, even on simple prompts.

Qwen 3.5 is a "thinking" model — Ollama exposes this as a `think` capability. Before producing its visible output, the model generates an internal chain-of-thought reasoning trace. On straightforward prompts this might be 500 tokens. On ambiguous or multi-step prompts it can spiral to 6,000–13,000 tokens of internal reasoning before the actual answer emerges. The answer itself is often good. But the latency is catastrophic for anything with a fixed timeout.

Worse, the tools calling these models often have no way to disable the thinking trace. I was running [LightRAG](https://github.com/HKUDS/LightRAG) for local document indexing, and its Ollama adapter forwards `num_ctx`, `temperature`, and a few other parameters — but has no `think` field. There's no knob to turn it off. A `SYSTEM "/no_think"` Modelfile override exists in Ollama, but it didn't reliably suppress the behavior either.

This isn't a local-model problem — any reasoning model, cloud or local, generates a thinking trace before its answer. Ollama's API cleanly separates the two: the `thinking` field holds the reasoning trace, `content` holds the answer. Frameworks that support Ollama's `think` parameter can disable the trace entirely. The problem is the tooling layer, not the model. If your framework doesn't expose a way to turn thinking off, you're stuck with the full reasoning trace whether you need it or not.

My assistant ([OpenClaw](https://openclaw.ai)) handles this correctly — it forwards `think: false` to Ollama when thinking is off, and strips historical reasoning traces from session context before replaying the conversation. So thinking tokens inflate the current turn's generation cost but don't compound across turns. LightRAG's Ollama adapter, by contrast, had no `think` parameter — the fix was an environment variable (`OLLAMA_LLM_THINK=false`) that the adapter eventually picked up.

**The lesson: when you're running reasoning models behind a tool-calling pipeline with fixed timeouts — RAG extraction, structured JSON output, agentic workflows — check whether your framework supports disabling thinking.** If it does, turn it off for tasks that don't need it. If it doesn't, either contribute the patch or pick a model that doesn't think by default.

## What the daily setup looks like

The configuration that finally works, after a few days of iteration:

- **Two GPUs, two Ollama instances.** The main Ollama service runs on the RTX 2080 Ti (port 11434) handling LLM inference. A second Ollama instance runs on the GTX 1070 (port 11436) dedicated to embedding models for LightRAG. Splitting them across GPUs means the embedding workload doesn't compete with LLM generation for VRAM.
- **Primary model:** `glm-5.2:cloud` — a large model served through Ollama's cloud API. This is what my assistant uses for primary conversation and synthesis. It's not local inference, but it's significantly cheaper than a per-token API and capable enough for the main session's reasoning needs.
- **Sub-agent model:** `qwen3.5:9b` — used for delegated investigation tasks (log analysis, research, repetitive workflows). The assistant spawns these as isolated sub-sessions, each running a fresh context window on the local GPU. Zero cost, zero data leaving the machine.
- **LightRAG:** `qwen3.5:9b` with thinking explicitly disabled (`OLLAMA_LLM_THINK=false`) for entity extraction, and `qwen3-embedding:4b` on the second GPU for embeddings.
- **Escalation:** `anthropic/claude-haiku-4-5` or `claude-opus-4-8` via explicit override, only when a task genuinely exceeds what the local model can handle — complex multi-step reasoning, nuanced writing, architectural decisions. This is the only tier that costs money, and it's used sparingly enough that monthly API spend is a rounding error.

The architecture is a cascade: cheap local model first, escalate to paid API only on demonstrated need. I wrote about the routing logic and the cost math in a [separate post](/blog/routing-cheap-local-models-to-cut-llm-costs-to-near-zero/) — the short version is that a typical day of heavy assistant usage (dozens of sub-agent spawns, research tasks, code investigations) costs $0 on the local tier and only escalates when the task actually warrants it.

## What changed

The original version of this post was about the novelty of running a model locally. The novelty wore off. What replaced it is something more useful: a local inference layer that's boring, reliable, and cheap enough to leave running indefinitely. The model loads on boot, serves requests on demand, and costs nothing per token. The bottleneck shifted from "can I do this at all?" to "which model fits my VRAM, which one handles structured output without spiraling, and which tasks actually need to escalate to a paid API."

If you're starting now, skip the `transformers` + `bitsandbytes` phase I went through. Install Ollama, pull a model that fits your VRAM, cap your context window, and spend your time on the interesting problem — which is figuring out what to *do* with a local model once the infrastructure stops being the thing that breaks.