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
comments: false
---

Most of the AI agents I work with are reactive: a person asks, the agent answers. But every so often I find myself wondering what happens if you flip the loop — if the agent sets its own curriculum.

The shape I keep coming back to is simple:

1. Propose a plausible task the agent might be asked to do.
2. Decide, in advance, what a good result would look like.
3. Attempt the task using only what it already knows.
4. Compare the result to the expectation. If it's off, try a different approach.
5. If it succeeds cleanly, move to a new task and log the win.
6. If it succeeds but only after real struggle — many retries, or gaps in its own knowledge — update its knowledge base and report the improvement.
7. If it can't solve the task at all, report the failure honestly instead of quietly giving up.

The interesting part isn't the happy path; it's step 6. An agent that can only tell you "I succeeded" or "I failed" is a tool. An agent that can tell you *why something was harder than it should have been* — and then go patch that gap in its own understanding — is closer to something that actually improves over time instead of just executing.

There's a natural extension: give the agent access to a real sandbox — a test environment, a way to inspect how its own infrastructure behaves — and let it use that access not just to complete tasks, but to build a model of the system it's operating in. At that point the question stops being "can it follow instructions" and becomes "can it notice what it doesn't know, and go find out." That's the part worth building toward.
