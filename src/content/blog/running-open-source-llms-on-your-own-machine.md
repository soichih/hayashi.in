---
title: 'Running open-source LLMs on your own machine'
description: 'What I learned setting up local LLMs on consumer GPUs with Ollama — VRAM math, thinking-mode traps, and the cascade architecture I use for daily AI assistant work.'
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

I wrote a post a while back about running a quantized model locally using `transformers` and `bitsandbytes` — `uv venv`, `pip install torch`, a 4-bit Gemma, and a cake prompt. It worked. It was also the wrong way to think about the problem.

The real question was never "can I load a model in Python?" The question was: **can I run a local model well enough, fast enough, and reliably enough that it becomes part of my daily workflow instead of a demo I run once and forget.** Here's what I learned getting there.

## From `transformers` to Ollama

The `transformers` + `bitsandbytes` approach is fine for experimentation. It is not fine when you want an always-on inference server that an assistant can call hundreds of times a day. Loading weights into a Python process on every invocation, managing GPU memory by hand, writing your own chat loop — nobody should be doing this in 2026 when [Ollama](https://ollama.com) exists.

Ollama is a single binary that runs as a systemd service, exposes a clean HTTP API on `127.0.0.1:11434`, and handles model pulling, quantization, GPU memory management, and request queuing. You install it, `ollama pull qwen3.5:9b`, and you have an endpoint serving a 9-billion-parameter model from your GPU. That's the floor. Everything above it — tool calling, streaming, multi-modal, structured output — Ollama handles or at least doesn't get in the way of.

I migrated off LMStudio for the same reason: its OpenAI-compatible shim silently failed on explicit model overrides in ways that were hard to debug. Ollama's API is simpler, more predictable, and when something breaks the logs tell you what happened.

## The VRAM cliff

My machine has two GPUs: an RTX 2080 Ti with 11 GB of VRAM and a GTX 1070 with 8 GB. The 2080 Ti is enough for a 9B model in 4-bit quantization (roughly 5–6 GB for weights) with room left over for the KV cache — or so I thought. In practice, some models were timing out and running far slower than expected. The cause turned out to be one configuration variable: `num_ctx`.

A model's memory footprint has two parts:

1. **Weights** — fixed, proportional to parameter count and quantization level. A 9B model in 4-bit is ~5–6 GB. This doesn't change with context length.
2. **KV cache** — grows linearly with context window. At small context lengths this is negligible. At 256K tokens it's 8+ GB. At 1M tokens it's 30+ GB.

My configuration tool had set each model's `num_ctx` to its **advertised maximum context window** — 256K for Qwen 3.5, 1M for Granite 4. On an 11 GB card, that meant the KV cache allocation alone exceeded VRAM before a single token was generated. Ollama doesn't crash when this happens — it spills the overflow into system RAM and runs that portion on CPU. Your model loads. It responds. It just does so at a fraction of the speed, and requests time out.

The fix was to cap `num_ctx` per model to the largest value that keeps the entire working set in VRAM. You verify this with `ollama ps` — it reports the GPU/CPU split directly. If you see anything other than 100%/0%, your `num_ctx` is too high for your card. Drop it until the entire model fits. The difference between 80% GPU and 100% GPU is not 20% slower — it's the difference between "token streaming works" and "every request times out," because the CPU fallback path isn't just slower, it also blocks the GPU pipeline.

The advertised 256K or 1M context windows are marketing specs, not usable configurations on consumer hardware — and tools that auto-configure `num_ctx` to the advertised max are setting you up for the same cliff.

## Thinking traces and context inflation

Once VRAM was sorted, a different problem emerged. Qwen 3.5 is a "thinking" model — Ollama exposes this as a `think` capability. Before producing its visible output, the model generates an internal chain-of-thought reasoning trace. On straightforward prompts this might be 500 tokens. On ambiguous or multi-step prompts it can spiral to 6,000–13,000 tokens of internal reasoning before the actual answer emerges.

This isn't a local-model problem — any reasoning model, cloud or local, generates a thinking trace before its answer. Ollama's API cleanly separates the two: the `thinking` field holds the reasoning trace, `content` holds the answer. The question is what happens to those thinking tokens after the turn ends. If your framework stores the full response (thinking + content) in conversation history and re-sends it on the next turn, the reasoning trace inflates your context window on every subsequent turn — even though the model already produced its answer and doesn't need to see its own old reasoning again.

My assistant ([OpenClaw](https://openclaw.ai)) handles this correctly — it strips historical reasoning traces from session context before replaying the conversation to the model. So thinking tokens only cost on the turn they're generated; they don't compound across turns. If your framework doesn't do this, you're paying for the reasoning trace in context on every single turn, which adds up fast in long conversations.

## Disabling reasoning for extraction tasks

There's a separate, simpler case: tasks where you don't want reasoning at all. I run [LightRAG](https://github.com/HKUDS/LightRAG) for local document indexing — entity extraction, summarization, structured JSON output. These are tasks where the model's internal chain-of-thought adds latency without improving the result. A 6,000-token reasoning trace before a one-line JSON answer isn't intelligence; it's waste.

LightRAG's Ollama adapter had no `think` parameter — it forwarded `num_ctx`, `temperature`, and a few other fields, but no way to turn thinking off. A `SYSTEM "/no_think"` Modelfile override exists in Ollama but didn't reliably suppress the behavior either. The fix was setting `OLLAMA_LLM_THINK=false` in LightRAG's environment — once that was in place, ingestion went from "always times out" to "completes in 21 seconds, clean JSON, no reasoning trace."

**The lesson has two parts:** For conversational use, make sure your framework strips historical thinking traces from context replay — reasoning should cost on the turn it happens, not on every turn after. For extraction/structured-output pipelines, disable reasoning entirely if the task doesn't benefit from it — and check whether your framework actually exposes the knob to do that.

## What the daily setup looks like

The configuration that finally works, after a few days of iteration:

- **Two GPUs, two Ollama instances.** The main Ollama service runs on the RTX 2080 Ti (port 11434) handling LLM inference. A second Ollama instance runs on the GTX 1070 (port 11436) dedicated to embedding models for LightRAG. Splitting them across GPUs means the embedding workload doesn't compete with LLM generation for VRAM.
- **Primary model:** `glm-5.2:cloud` — a large model served through Ollama's cloud API. This is what my assistant uses for primary conversation and synthesis. It's not local inference, but it's cheaper than a per-token API and capable enough for the main session's reasoning needs.
- **Sub-agent model:** `qwen3.5:9b` — used for delegated investigation tasks (log analysis, research, repetitive workflows). The assistant spawns these as isolated sub-sessions, each running a fresh context window on the local GPU. Zero cost, zero data leaving the machine.
- **LightRAG:** `qwen3.5:9b` with thinking explicitly disabled (`OLLAMA_LLM_THINK=false`) for entity extraction, and `qwen3-embedding:4b` on the second GPU for embeddings.
- **Escalation:** `anthropic/claude-haiku-4-5` or `claude-opus-4-8` via explicit override, only when a task genuinely exceeds what the local model can handle — complex multi-step reasoning, nuanced writing, architectural decisions. This is the only tier that costs money, and it's used sparingly enough that monthly API spend is a rounding error.

The architecture is a cascade: cheap local model first, escalate to paid API only on demonstrated need. I wrote about the routing logic and the cost math in a [separate post](/blog/routing-cheap-local-models-to-cut-llm-costs-to-near-zero/) — the short version is that a typical day of heavy assistant usage (dozens of sub-agent spawns, research tasks, code investigations) costs $0 on the local tier and only escalates when the task actually warrants it.

## What changed

The original version of this post was about the novelty of running a model locally. The novelty wore off. What replaced it is a local inference layer that's boring, reliable, and cheap enough to leave running indefinitely. The local models load on boot, serve requests on demand, and cost nothing per token. The bottleneck shifted from "can I do this at all?" to "which model fits my VRAM, which one handles structured output without spiraling, and which tasks actually need to escalate to a paid API."

If you're starting now, skip the `transformers` + `bitsandbytes` phase I went through. Install Ollama, pull a model that fits your VRAM, cap your context window, and spend your time on the interesting problem — which is figuring out what to *do* with a local model once the infrastructure stops being the thing that breaks.