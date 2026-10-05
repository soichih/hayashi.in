---
title: 'Can an AI teach itself?'
description: 'A sketch for a self-directed learning loop: let an agent propose its own tasks, judge its own results, and only ask for help when it genuinely gets stuck.'
date: 2025-11-23
tags:
  - AI
  - Agents
categories:
  - Engineering
showHeroImage: false
comments: true
---

Most of the AI agents I work with are reactive: a person asks, the agent answers. But every so often I find myself wondering what happens if you flip the loop — if the agent sets its own curriculum [1](https://arxiv.org/abs/2505.03335 "Zhao et al., 2025. Absolute Zero: a single model learns to propose tasks that maximize its own learning progress and improves its reasoning by solving them, with no external data.") [2](https://arxiv.org/abs/2305.16291 "Wang et al., 2023. Voyager, an LLM agent in Minecraft with an automatic curriculum, a growing library of executable skills, and iterative prompting that uses environment feedback and self-verification.").

The shape I keep coming back to is simple:

1. Propose a plausible task the agent might be asked to do [3](https://arxiv.org/abs/2212.10560 "Wang et al., 2022. Self-Instruct: a language model generates its own instructions to improve how well it follows instructions.").
2. Decide, in advance, what a good result would look like.
3. Attempt the task using only what it already knows.
4. Compare the result to the expectation. If it's off, try a different approach [4](https://arxiv.org/abs/2303.11366 "Shinn et al., 2023. Reflexion: agents verbally reflect on feedback from a task and keep their reflections in an episodic memory to make better decisions on the next attempt.").
5. If it succeeds cleanly, move to a new task and log the win.
6. If it succeeds but only after real struggle — many retries, or gaps in its own knowledge — update its knowledge base and report the improvement [5](https://arxiv.org/abs/2203.14465 "Zelikman et al., 2022. STaR: generate reasoning for many questions, retry with the correct answer as a hint when wrong, and fine-tune on the reasoning that works, in a loop.") [2](https://arxiv.org/abs/2305.16291 "Wang et al., 2023. Voyager, an LLM agent in Minecraft with an automatic curriculum, a growing library of executable skills, and iterative prompting that uses environment feedback and self-verification.").
7. If it can't solve the task at all, report the failure honestly instead of quietly giving up.

The interesting part isn't the happy path; it's step 6. An agent that can only tell you "I succeeded" or "I failed" is a tool. An agent that can tell you *why something was harder than it should have been* — and then go patch that gap in its own understanding — is closer to something that actually improves over time instead of just executing.

There's a natural extension: give the agent access to a real sandbox — a test environment, a way to inspect how its own infrastructure behaves — and let it use that access not just to complete tasks, but to build a model of the system it's operating in. At that point the question stops being "can it follow instructions" and becomes "can it notice what it doesn't know, and go find out [6](https://arxiv.org/abs/2207.05221 "Kadavath et al., Anthropic, 2022. Larger models are well-calibrated when asked whether their own answers are true, and can be trained to predict whether they know the answer to a question.")." That's the part worth building toward.

## References

1. Zhao et al., [Absolute Zero: Reinforced Self-play Reasoning with Zero Data](https://arxiv.org/abs/2505.03335) (2025).
2. Wang et al., [Voyager: An Open-Ended Embodied Agent with Large Language Models](https://arxiv.org/abs/2305.16291) (2023).
3. Wang et al., [Self-Instruct: Aligning Language Models with Self-Generated Instructions](https://arxiv.org/abs/2212.10560) (2022).
4. Shinn et al., [Reflexion: Language Agents with Verbal Reinforcement Learning](https://arxiv.org/abs/2303.11366) (2023).
5. Zelikman et al., [STaR: Bootstrapping Reasoning With Reasoning](https://arxiv.org/abs/2203.14465) (2022).
6. Kadavath et al., [Language Models (Mostly) Know What They Know](https://arxiv.org/abs/2207.05221) (2022).
