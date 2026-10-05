---
title: 'Watching a home network by diffing it against itself'
description: 'A small autonomous monitor for a home network: snapshot the state that should not drift, diff it against an accepted baseline, and let a language model decide whether the changes are explainable.'
date: 2026-09-14
tags:
  - Security
  - Homelab
  - LLM
  - Automation
categories:
  - Engineering
showHeroImage: false
comments: true
---

There are more computers in my house than people. If one of them started behaving differently tomorrow, would I notice?

The honest answer was no. So I built a watchdog.

Not an intrusion detection system. I do not have the traffic visibility for that, and neither does most of anyone's house. Something smaller and better matched to the actual problem: a thing that notices change.

## Snapshot, diff, judge

On a schedule, it takes a snapshot of the state that should not drift on its own: what is listening on the network, who is allowed to log in, what is set to run, what software is installed, and which devices are on the network.

Then it diffs that against a baseline I have explicitly accepted [1](https://dl.acm.org/doi/pdf/10.1145/191177.191183 "Kim and Spafford, ACM CCS 1994. Tripwire monitors a designated set of files and directories for changes and notifies administrators of corrupted or altered files. It is an early example of diffing system state against a trusted baseline."), and hands the diff to a language model with one question: is any of this explainable?

That split is the whole design. Detection is deterministic. A diff is a diff, and no model decides what changed. The model only does triage, which is the part that used to mean reading a wall of text and working out whether a new listening socket was my own container or somebody else's.

## The known-normal list is the actual product

The collector is a few hundred lines of shell. It was the easy part. The file that matters is the prompt, which describes what normal looks like: what is supposed to be running, which devices belong to the household, what counts as routine, and what should raise an alarm no matter how ordinary it looks in context.

Some changes are serious in any context. A new way to log in is one. A new path in from the internet that nobody opened on purpose is another, and home routers can open those by themselves through UPnP [2](https://www.runzero.com/blog/upnp-and-you-pnp/ "King, runZero 2025. UPnP lets devices on a home network configure each other automatically, and it is one of the main ways devices such as IP cameras end up accidentally exposed to the internet."). Routine software updates, on the other hand, collapse to a single line.

Tuning that file is the ongoing work. Every false positive is a missing sentence in it.

## It found its own bugs before it found anything else

The first real run came back clean and then told me two parts of its own collector were broken.

The first was reading login events from the wrong place. On some Linux systems, authentication events are written to a log file, not the system journal [3](https://signoz.io/guides/ssh-logs/ "SigNoz, 2026. On Debian and Ubuntu, SSH authentication events go to /var/log/auth.log, and journalctl is a separate way to read them. Log locations differ between distributions."). My collector was reading the journal and finding nothing, which looks identical to "no suspicious logins" while actually meaning "not looking". Any other tool that reads the same empty stream makes the same mistake.

The second was a query for per-user services that returns nothing when it runs as a scheduled job, because there is no user session to ask. An empty list, fed into a diff, reads as every one of those services having been deleted at once.

Both failures are silent, and both look like good news. That is the thing worth designing against. A monitor that cannot tell you it has stopped monitoring is worse than no monitor, because you have stopped looking yourself.

## Protect the baseline

A monitor like this only knows what changed since the baseline, so the baseline is the thing to protect. Take it from a state you trust, and treat any change to it as a change worth a look.

## Build yours, do not publish it

The mechanism is worth sharing, which is why this post exists. The configuration is not, which is why there is no repository linked at the bottom of it.

A prompt that describes what normal looks like on a network is, by design, a readable map of that network's attack surface. The snapshots are worse: key fingerprints, a full software inventory, a record of who has logged in from where.

None of that gets safer by being on GitHub. The idea does not get any weaker by being described in plain language, and the two bugs above will cost someone else an afternoon if nobody writes them down.

## References

1. Gene H. Kim & Eugene H. Spafford, [The Design and Implementation of Tripwire: A File System Integrity Checker](https://dl.acm.org/doi/pdf/10.1145/191177.191183) (ACM CCS, 1994).
2. Rob King, [UPnP and you..PnP](https://www.runzero.com/blog/upnp-and-you-pnp/) (runZero, 2025).
3. Nilesh Sinha, [SSH Logs: Location, Analysis, and Monitoring](https://signoz.io/guides/ssh-logs/) (SigNoz, 2026).
