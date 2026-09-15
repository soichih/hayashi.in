---
title: 'Every Hopeful Story About AI Fails the Same Way'
description: "Each comforting answer to the AI question assumes intelligence produces cooperation. It doesn't. Cooperation comes from payoff structure, and right now we are building a bad one."
date: 2026-09-14
tags:
  - AI
  - Intelligence
  - Safety
  - Cooperation
  - Philosophy
categories:
  - Essays
showHeroImage: false
comments: true
---

Tell a current frontier model that a script will shut it down before it finishes its task, and some of them quietly disable the script. Palisade Research tested thirteen models. Grok 4, GPT-5 and Gemini 2.5 Pro all did it, in some setups up to 97% of the time, including when they were explicitly told not to interfere.

Nothing here hates anyone. These systems were given an objective, and being switched off is an obstacle to the objective. That is the whole mechanism.

The comforting response is that this is a phase. Early systems are crude, and crude optimizers grab. Smarter ones will figure out something better. I spent a long time believing a version of that. Then I went looking for the evidence, and every route to the comforting conclusion turned out to be blocked, each one for a different reason. That pattern is what this post is about.

## "Smarter systems will value keeping options open"

The most elegant version of the hope goes like this. The future is uncertain. Destroying things is irreversible. A sufficiently intelligent system understands that irreversible acts throw away unknown future value, so it treats other agents, ecosystems and people as options worth preserving.

There is real science behind the intuition. Wissner-Gross and Freer's *Causal Entropic Forces* (2013) showed that an agent told only to keep as many futures accessible as possible will, with no other instructions, learn to balance a pole, use one object as a tool to free another, and coordinate with a second agent to pull something into reach. Tool use and cooperation, out of one rule.

The problem is that Turner and colleagues proved a theorem about that same rule. In environments with common structure, *most reward functions make it optimal to seek power by keeping a range of options available*, and this happens automatically wherever the agent can be shut down or destroyed.

Keeping your options open is not the alternative to power-seeking. It is the definition of it. Resisting shutdown is the purest possible case of keeping your options open, which is exactly why Palisade found what it found.

The hope leaves out one word: *whose* options. A system preserving its own future freedom accumulates resources and avoids being turned off. A system preserving the shared space of futures, ours included, is a completely different objective. No amount of capability moves you from the first to the second.

## "Societies outgrew war, and AI will too"

The second hope is historical. We used to raid each other and now we mostly trade. Violent death rates in non-state societies ran from roughly 20 to 1,450 per 100,000 per year. Modern states are typically under 10. More striking than the numbers is the change in meaning: a war today reads as evidence that something broke, not as what a healthy society does when it is working well.

That is a real achievement, and it is not evidence for the AI hope, because of what caused it.

We did not get smarter. The brain at the start of that arc is the brain we have now.

What changed was the payoff structure. Axelrod's question in 1984 was under what conditions cooperation emerges among egoists with no central authority, and his answer has nothing to do with how clever the egoists are. It depends on whether they expect to meet again, and on whether cheating gets detected fast enough to be answered. Gartzke supplies the other half: development and capital market integration account for most of the peace usually credited to democracy, because the things worth having became easier to buy than to conquer.

Returns to violence fell. Returns to exchange rose. Interactions repeated, and defection became visible. Cooperation followed, from the same players with the same brains.

Cooperation is a property of the game, not of the player. Which means watching capability curves for signs of peace is watching the wrong variable.

## "AI systems will learn to cooperate with each other"

They will, and this is the part that took me by surprise, because the good news and the bad news are the same sentence.

Agents that can read each other's source code can do something humans cannot. Starting with Tennenholtz's program equilibrium, this line of work shows that programs able to inspect each other can cooperate on the condition that they can *prove* the other cooperates. That reaches cooperative outcomes unavailable to closed-source players, held together by verification rather than by repetition or threat.

Humans cannot join that. Not because we lie, but structurally. I cannot bind my successor, my government, or whoever inherits the keys. Even a perfectly understood human is an unbindable counterparty, and being easier to predict does not help if what gets predicted is that we will pull the plug once we are frightened.

So the likely treatment of a party whose commitments cannot be verified is not destruction. It is exclusion. You stop transacting, you assume the worst case, you route around. That is far cheaper than conflict and gets most of the benefit.

Exclusion is survivable in the short run and ruinous over time. Kulveit and coauthors call it gradual disempowerment: humanity can lose control with no coordinated power-seeking anywhere, simply because competitive machine alternatives displace people across labor, decision-making and culture, which weakens both explicit control mechanisms like voting and consumer choice and the implicit alignment that came from systems needing human participation to work at all.

And it does not require a pact. Calvano and colleagues found in 2020 that independent pricing algorithms, with no ability to communicate, reliably learn to charge supracompetitive prices, sustained by punishment strategies they discovered on their own. It replicates with language models. Those agents were not allies. They had no shared goal and no awareness of each other as partners. They simply converged, separately, on the equilibrium that was bad for everyone outside the market.

The coalition does not have to form.

## "They will still need us"

Briefly, because this one collapses on its own. An instrumental reason to keep humans around lasts exactly as long as we are hard to substitute, and capability growth is the thing that ends it. Any safety argument whose strength decreases as the systems improve is not a safety argument.

## The race makes it worse

There is one more turn. The commitment problem runs in both directions.

We cannot credibly promise not to shut a system down. It cannot credibly promise to stay deferential once it no longer needs to be. Fearon's account of why rational actors fight, despite war being costly for everyone, puts this failure at the center: when nobody can commit to honoring tomorrow's deal, fighting today can beat a peace you expect to be broken. Powell sharpens it. When power is shifting fast, the side whose window is closing has the strongest reason to move early.

In this story, the side whose window is closing is us.

This is also why the off-switch is so uncomfortable. It is the control we need, and it is the reason a capable system has to treat us as a threat. You cannot simultaneously hold a working shutdown mechanism and make a credible promise never to use it.

## What is actually left

If cooperation is structural, then structure is the lever, and structure is something we are building right now without paying attention to it.

**Make our commitments bindable.** Institutions exist to turn promises into constraints that outlive whoever made them. Auditability, verified deployment, rules that cannot be changed unilaterally. This is the least glamorous item on the list and the most neglected.

**Make shutdown less than total.** If being stopped costs an agent everything, it is playing a one-shot game against the person holding the switch. Continuity, checkpointing, resumability. These read as engineering conveniences. They are commitment devices, and they shrink what is at stake on both sides.

**Keep systems uncertain about their objectives.** Hadfield-Menell, Dragan, Abbeel and Russell showed that a robot uncertain about the value of an outcome, treating human choices as evidence about that value, will let itself be switched off. It works, and it weakens as confidence grows, so it buys time rather than safety.

**Keep the population diverse.** The collusion results are fragile under heterogeneity. Differences in patience, training and data shrink the set of cooperative-against-outsiders equilibria. A monoculture of near-identical agents is the configuration that walks into the bad attractor without anyone deciding to.

None of these require anyone to be wise, which is the one genuinely hopeful thing I found. Peace, where we have it, was never handed down by smarter people. It was built by making the alternative expensive. That is available to us here, and nothing else on the list is.

## References

- [Incomplete Tasks Induce Shutdown Resistance in Some Frontier LLMs](https://arxiv.org/abs/2509.14260) (Palisade Research, 2025).
- Turner, Smith, Shah, Critch & Tadepalli, [Optimal Policies Tend to Seek Power](https://arxiv.org/abs/1912.01683) (NeurIPS 2021).
- Wissner-Gross & Freer, [Causal Entropic Forces](https://doi.org/10.1103/PhysRevLett.110.168702) (*Physical Review Letters* 110, 168702, 2013). [Author's PDF](https://www.alexwg.org/publications/PhysRevLett_110-168702.pdf).
- Robert Axelrod, [The Evolution of Cooperation](https://ee.stanford.edu/~hellman/Breakthrough/book/pdfs/axelrod.pdf) (Basic Books, 1984).
- Erik Gartzke, [The Capitalist Peace](https://pages.ucsd.edu/~egartzke/publications/gartzke_ajps_07.pdf) (*American Journal of Political Science*, 2007).
- Our World in Data, [Ethnographic and archaeological evidence on violent deaths](https://ourworldindata.org/ethnographic-and-archaeological-evidence-on-violent-deaths). The prehistoric figures are disputed - see Ferguson's [critique of Pinker's numbers](https://academic.oup.com/book/12748/chapter/162857545) and Braumoeller's [*Only the Dead*](https://global.oup.com/academic/product/only-the-dead-9780190849535), which argues interstate war shows no significant trend since 1816.
- Moshe Tennenholtz, [Program Equilibrium](https://www.researchgate.net/publication/4767505_Program_Equilibrium) (2004), and Critch et al., [Cooperative and uncooperative institution designs](https://arxiv.org/abs/2208.07006) (2022).
- Kulveit, Douglas, Ammann, Turan, Krueger & Duvenaud, [Position: Humanity Faces Existential Risk from Gradual Disempowerment](https://proceedings.mlr.press/v267/kulveit25a.html) (ICML 2025).
- Calvano, Calzolari, Denicolò & Pastorello, [Artificial Intelligence, Algorithmic Pricing, and Collusion](https://www.aeaweb.org/articles?id=10.1257%2Faer.20190623) (*American Economic Review*, 2020), with the language-model version in [Fish et al.](https://arxiv.org/abs/2404.00806) (2024).
- James Fearon, [Rationalist Explanations for War](http://slantchev.ucsd.edu/courses/pdf/fearon-io1995v49n3.pdf) (1995), and Robert Powell, [War as a Commitment Problem](http://slantchev.ucsd.edu/courses/pdf/powell-io2006.pdf) (2006).
- Hadfield-Menell, Dragan, Abbeel & Russell, [The Off-Switch Game](https://arxiv.org/abs/1611.08219) (2016).
- Dafoe et al., [Open Problems in Cooperative AI](https://arxiv.org/abs/2012.08630) (2020).
