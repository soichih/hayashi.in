---
title: 'Routing cheap local models to cut LLM costs to near zero'
description: 'How I use a free local model as a delegated investigator for my Claude-based assistant, trading wall-clock time for dollar cost — and what the research literature says about why this works.'
date: 2026-07-13
tags:
  - AI
  - LLM
  - Ollama
categories:
  - Engineering
showHeroImage: false
comments: true
---

I run a personal assistant on top of Claude Sonnet. It's good — genuinely useful for day-to-day things — but it's also a metered API, and metered APIs have a way of quietly compounding. Debugging sessions are the worst offender: every turn re-sends the growing conversation, and a single multi-step troubleshooting session can rack up a real dollar bill before you've fixed anything.

The fix I landed on isn't clever in the deep-learning sense. It's closer to what the LLM-ops literature calls **cascading** or **model routing**: don't send every task to the expensive model. Send the cheap thing first, and only escalate when it actually needs the expensive model's judgment.

## The architecture

My setup has two tiers:

- **The orchestrator** — Claude Sonnet, which talks to me directly, makes decisions, and writes the final answer.
- **The worker** — `qwen3.5:9b`, a 9-billion-parameter open-weight model running locally on an RTX 2080 Ti via [Ollama](https://ollama.com). Zero marginal cost, because it's my own GPU.

When I ask for something that requires investigation — "check the system logs for problems," "figure out why this cron job is timing out," "read through these files and summarize" — the orchestrator doesn't do the legwork itself. It spawns an isolated sub-agent session, hands the local model the task, and waits. The sub-agent runs its own loop: read a file, run a command, look at the output, decide what to do next, repeat — sometimes dozens of times — entirely inside its own context window.

The orchestrator never sees any of that. It only sees the final report.

## Why this actually saves money

This matters because of how the token math works. Every tool call a sub-agent makes — every file read, every log grep, every command result — becomes part of *that sub-agent's* conversation history, not mine. If the local model needs 50 tool calls and 3 million tokens of back-and-forth to track down a bug, all of that stays inside the free local session. I only pay (in Sonnet tokens) for the one- or two-paragraph summary that comes back.

I tested this directly on my own setup this week. I asked the assistant to investigate the server's system logs, find something fixable, and fix it. The delegated local-model sub-agent took **28 minutes and roughly 3.1 million tokens** to conclude that nothing needed fixing (it had chased down some cosmetic warnings and correctly declined to force a fix on a read-only system file). On a metered frontier model, 3.1 million input tokens would have been a real number on the invoice. On my local GPU, it was free — the only thing it cost was time, and I don't care about time here.

That's the whole trade: it takes longer, because a smaller model reasons more clumsily and needs more attempts to get to the same place. But since local inference is a sunk hardware cost rather than a per-token bill, "longer" is irrelevant and "cheaper" is the only axis that matters.

## Where this comes from — routing and cascading in the literature

This isn't a new idea; it's an active research area. The pattern generally goes by two names:

- **Model routing**: classify the incoming task first, then send it directly to whichever model tier is appropriate for that class of task.
- **Cascading**: try the cheap model first unconditionally, and escalate to a more expensive model only when the cheap attempt's output looks insufficient (via a confidence signal, a verifier, or just failure to produce a usable answer).

A 2025 ICML paper, ["A Unified Approach to Routing and Cascading for LLMs"](https://proceedings.mlr.press/v267/dekoninck25a.html), frames both as instances of the same underlying optimization problem — picking the cheapest model in a pool that's still likely to answer correctly — and shows a combined router-cascade strategy beats either technique alone. Systems research has followed: ["Cascadia"](https://arxiv.org/pdf/2506.04203) (2025) and a follow-up "Cluster, Route, Escalate" framework both build serving infrastructure specifically to make cascades cheap to run at scale, since naively running every request through every tier first would defeat the purpose.

My setup is a deliberately blunt version of this — a hard two-tier split by task type (delegate-the-investigation vs. keep-the-judgment) rather than a learned router — but the underlying bet is the same one those papers formalize: most of the *work* in an agentic task (reading things, trying things, noticing what didn't work) doesn't require frontier-level reasoning. It just requires enough capability to follow a loop. The judgment calls — deciding what the investigation *means*, what to actually do about it, how to phrase the answer — are the part worth paying for.

There's a growing ecosystem of small open-source tools built around exactly this pattern for coding assistants specifically — routing "boring" or repetitive sub-tasks to a local Ollama model while keeping the orchestrating coding agent on the frontier model — which suggests I'm not alone in finding this trade worthwhile.

## The catch: local models get none of the caching discount

There's an asymmetry worth knowing about if you try this yourself. Frontier providers like Anthropic offer **prompt caching** — reusing a stable prefix of a conversation instead of reprocessing it from scratch, at roughly a [90% discount](https://claudecodeguides.com/claude-prompt-caching-pricing-and-cost-savings/) on the cached portion. That's a real, separate cost lever for keeping the orchestrator session itself cheap, and it's automatic — no architecture change required.

Local models running through Ollama get nothing like this by default. Every turn of a sub-agent's investigation resends its *entire* accumulated conversation from scratch, with no discount for the parts that haven't changed. That's exactly why my 28-minute log investigation ballooned to 3.1M tokens: roughly 68 tool-calling turns, each one re-sending a growing context, averaging around 45,000 tokens a turn, with zero caching credit anywhere in that chain. On a paid model that arithmetic would matter a great deal. On free local inference, it's a rounding error — but it's worth knowing the mechanism, because it means "token count" and "dollar cost" genuinely stop being the same measurement once you're on local hardware, and treating the local model's token usage as a proxy for anything other than *time* is a mistake.

## The actual rule I settled on

- **Investigation, log-reading, "go find out what's wrong" tasks → delegate to the local model, no matter how long it takes.**
- **Judgment, synthesis, "what should I actually do about this" → keep on the frontier model.**
- **Escalate a specific delegated task to the frontier model explicitly** only when the local model's output comes back wrong, shallow, or it genuinely can't finish — not just because it's slow.

None of this eliminates the frontier model's bill entirely — I still pay for every message I send it and every summary it reads back. But it moves the *expensive* part of the work — the part that scales with how many things go wrong before you find the actual problem — onto hardware that's already paid for. For debugging-shaped tasks, which are inherently unpredictable in how many steps they'll take, that's exactly the kind of cost that's worth making free.
