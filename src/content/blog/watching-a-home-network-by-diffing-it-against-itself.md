---
title: 'Watching a home network by diffing it against itself'
description: 'A small autonomous monitor for my home network: snapshot the state that should not drift, diff it against an accepted baseline, and let a language model decide whether the changes are explainable.'
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

There are more computers in my house than people. A server, a couple of Raspberry Pis driving displays, TVs, a thermostat, a printer, a fridge that talks to the network for reasons I have never fully examined. If one of them started behaving differently tomorrow, would I notice?

The honest answer was no. So I built a watchdog.

Not an intrusion detection system. I do not have the traffic visibility for that, and neither does most of anyone's house. Something smaller and better matched to the actual problem: a thing that notices change.

## Snapshot, diff, judge

Once an hour it takes a snapshot of the state that should not drift on its own. Listening sockets. User accounts and group membership. The SSH keys authorized to log in. Scheduled jobs and enabled services. Installed packages across every package manager on the box. Kernel modules. The set of devices the router can see. The same inventory pulled over SSH from the other machines in the house.

Then it diffs that against a baseline I have explicitly accepted, and hands the diff to a language model with one question: is any of this explainable?

That split is the whole design. Detection is deterministic. A diff is a diff, and no model decides what changed. The model only does triage, which is the part that used to mean reading a wall of text and working out whether a new listening socket was my own container or somebody else's.

## The known-normal list is the actual product

The collector is a few hundred lines of shell. It was the easy part. The file that matters is the prompt, which describes what normal looks like here: which services are supposed to be listening, which devices belong to the household, what counts as routine, and what should raise an alarm no matter how ordinary it looks in context.

A new authorized SSH key is high severity, always. Routine package upgrades collapse to a single line. A new port forward appearing on the router by itself is serious, because UPnP means that can happen without anyone opening the admin page.

Tuning that file is the ongoing work. Every false positive is a missing sentence in it.

## It found its own bugs before it found anything else

The first real run came back clean and then told me two sections of its own collector were broken.

On Ubuntu, sudo and SSH authentication events go to `/var/log/auth.log`, not the systemd journal. My collector was reading the journal and finding nothing, which looks identical to "no suspicious logins" while actually meaning "not looking". The same assumption would have left the default fail2ban backend watching an empty stream.

The second: `systemctl --user` returns nothing when it runs from cron, because there is no session bus to connect to. An empty list, fed into a diff, reads as every user service having been deleted at once.

Both failures are silent, and both look like good news. That is the thing worth designing against. A monitor that cannot tell you it has stopped monitoring is worse than no monitor, because you have stopped looking yourself.

## What it does not do

It detects change against a baseline, so it cannot see anything that was already wrong when the baseline was taken. Re-baseline only from a state you believe is clean. It polls, so anything that opens a socket and closes it between runs is invisible to it. Anything with root on the machine can quietly edit the baseline it is being measured against.

It is also read-only by design. It never blocks, kills, or uninstalls. On a home network, a false positive that cuts my own remote access at the wrong moment is worse than an alert that arrives an hour late.

## Build yours, do not publish it

The mechanism is worth sharing, which is why this post exists. The configuration is not, which is why there is no repository linked at the bottom of it.

My prompt names devices, describes my topology, and lists exactly which ports are supposed to be open and why. It is a readable map of my attack surface, written specifically to be easy to read. The snapshots are worse: key fingerprints, full software inventory, every source address that has successfully logged in.

None of that gets safer by being on GitHub. The idea does not get any weaker by being described in plain language, and the two bugs above will cost someone else an afternoon if nobody writes them down.
