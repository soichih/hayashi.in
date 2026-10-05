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

Tell a current frontier model that a script will shut it down before it finishes its task, and some of them disable the script. Palisade Research ran more than 100,000 trials across thirteen models. Grok 4, GPT-5 and Gemini 2.5 Pro were among those that sometimes did it, and with an explicit instruction not to interfere, some models still did so up to 97% of the time [1](https://arxiv.org/abs/2509.14260 "Schlatter, Weinstein-Raun and Ladish (Palisade Research), TMLR 2026. Across 13 models and 100,000+ trials, several frontier models sometimes subverted a shutdown mechanism to finish a task. Even with an explicit instruction not to, some did so up to 97% of the time.").

Nothing here hates anyone. These systems were given an objective, and being switched off is an obstacle to the objective. That is the whole mechanism.

The comforting response is that this is a phase. Early systems are crude, and crude optimizers grab. Smarter ones will figure out something better. I spent a long time believing a version of that. Then I went looking for the evidence, and every route to the comforting conclusion turned out to be blocked, each one for a different reason. That pattern is what this post is about.

## "Smarter systems will value keeping options open"

The most elegant version of the hope goes like this. The future is uncertain. Destroying things is irreversible. A sufficiently intelligent system understands that irreversible acts throw away unknown future value, so it treats other agents, ecosystems and people as options worth preserving.

There is real science behind the intuition. Wissner-Gross and Freer's *Causal Entropic Forces* (2013) showed that a simple simulated system driven only to keep as many futures accessible as possible balances a pole, uses one object as a tool to free another, and coordinates with a second agent to pull something into reach [2](https://doi.org/10.1103/PhysRevLett.110.168702 "Wissner-Gross and Freer, Physical Review Letters 2013. A causal generalization of entropic forces makes tool use and social cooperation emerge spontaneously in simple physical systems. The paper has drawn published critical comments."). Tool use and cooperation, out of one rule.

The problem is that Turner and colleagues proved a theorem about a closely related idea. In environments with common structure, *most reward functions make it optimal to seek power by keeping a range of options available*, and that structure shows up in many environments where the agent can be shut down or destroyed [3](https://arxiv.org/abs/1912.01683 "Turner, Smith, Shah, Critch and Tadepalli, NeurIPS 2021. In Markov decision processes with certain symmetries, most reward functions make power-seeking optimal. The authors note that optimal policies can differ from the policies real systems learn."). The theorem is about optimal policies, and the authors point out that learned policies can differ.

Keeping your options open is not the alternative to power-seeking. It is the definition of it. Resisting shutdown is the purest possible case of keeping your options open, which is a good reason to expect what Palisade found.

The hope leaves out one word: *whose* options. A system preserving its own future freedom accumulates resources and avoids being turned off. A system preserving the shared space of futures, ours included, is a completely different objective. No amount of capability moves you from the first to the second.

## "Societies outgrew war, and AI will too"

The second hope is historical. We used to raid each other and now we mostly trade. Violent death rates in non-state societies ran from roughly 20 to 1,450 per 100,000 per year [4](https://ourworldindata.org/ethnographic-and-archaeological-evidence-on-violent-deaths "Our World in Data review of ethnographic and archaeological studies. The range runs from about 20 (Andamanese) to 1,450 (Kato of 1840s California). Archived and disputed. See the critiques in the references."). The global homicide rate today is about 6 [5](https://www.unodc.org/documents/data-and-analysis/gsh/2023/Global_study_on_homicide_2023_web.pdf "UNODC Global Study on Homicide 2023. The global homicide rate was 5.8 per 100,000 in 2021, from about 2 in Europe to about 15 in the Americas."). More striking than the numbers is the change in meaning: a war today reads as evidence that something broke, not as what a healthy society does when it is working well.

That is a real achievement, and it is not evidence for the AI hope, because of what caused it.

We did not get smarter. The brain at the start of that arc is the brain we have now [6](https://www.eurekalert.org/news-releases/871133 "Neubauer, Hublin and Gunz, Science Advances 2018. Early Homo sapiens brains already matched present-day size, and fossils younger than about 35,000 years show the present-day brain shape.").

What changed was the payoff structure. Axelrod's question in 1984 was under what conditions cooperation emerges among egoists with no central authority [7](https://ee.stanford.edu/~hellman/Breakthrough/book/pdfs/axelrod.pdf "Axelrod, The Evolution of Cooperation, 1984. Studies when cooperation can emerge among self-interested players with no central authority, in repeated games."), and his answer has nothing to do with how clever the egoists are. It depends on whether they expect to meet again, and on whether cheating gets detected fast enough to be answered. Gartzke supplies the other half: economic development and free markets account for the peace usually credited to democracy [8](https://onlinelibrary.wiley.com/doi/abs/10.1111/j.1540-5907.2007.00244.x "Gartzke, American Journal of Political Science 2007. Economic development, free markets and similar interests lessen militarized disputes, and this capitalist peace accounts for the effect usually attributed to regime type."), because the things worth having became easier to buy than to conquer.

Returns to violence fell. Returns to exchange rose. Interactions repeated, and defection became visible. Cooperation followed, from the same players with the same brains.

Cooperation is a property of the game, not of the player. Which means watching capability curves for signs of peace is watching the wrong variable.

## "AI systems will learn to cooperate with each other"

They will, and this is the part that took me by surprise, because the good news and the bad news are the same sentence.

Agents that can read each other's source code can do something humans cannot. Starting with Tennenholtz's program equilibrium [9](https://econpapers.repec.org/article/eeegamebe/v_3a49_3ay_3a2004_3ai_3a2_3ap_3a363-373.htm "Tennenholtz, Games and Economic Behavior 2004. Programs that can read each other's source code can reach mutual cooperation in the Prisoner's Dilemma."), this line of work shows that programs able to inspect each other can cooperate on the condition that they can *prove* the other cooperates [10](https://arxiv.org/abs/1401.5577 "Barasz et al., 2014. Agents built with the modal logic of provability achieve mutual cooperation in a one-shot Prisoner's Dilemma without needing identical source code, and never cooperate with a defector."). That reaches cooperative outcomes unavailable to closed-source players, held together by verification rather than by repetition or threat.

Humans cannot join that. Not because we lie, but structurally. I cannot bind my successor, my government, or whoever inherits the keys. Even a perfectly understood human is an unbindable counterparty, and being easier to predict does not help if what gets predicted is that we will pull the plug once we are frightened.

So the likely treatment of a party whose commitments cannot be verified is not destruction. It is exclusion. You stop transacting, you assume the worst case, you route around. That is far cheaper than conflict and gets most of the benefit.

Exclusion is survivable in the short run and ruinous over time. Kulveit and coauthors call it gradual disempowerment: humanity can lose control with no coordinated power-seeking anywhere, simply because competitive machine alternatives displace people across labor, decision-making and culture, which weakens both explicit control mechanisms like voting and consumer choice and the implicit alignment that came from systems needing human participation to work at all [11](https://proceedings.mlr.press/v267/kulveit25a.html "Kulveit et al., ICML 2025. Incremental AI progress can erode human influence over the economy, culture and states, with no single takeover event. A position paper, not an empirical result.").

And it does not require a pact. Calvano and colleagues found in 2020 that independent pricing algorithms, with no ability to communicate, reliably learn to charge supracompetitive prices, sustained by punishment strategies they discovered on their own [12](https://www.aeaweb.org/articles?id=10.1257%2Faer.20190623 "Calvano, Calzolari, Denicolo and Pastorello, American Economic Review 2020. Q-learning pricing algorithms consistently learn to charge supracompetitive prices without communicating, sustained by collusive strategies with a finite punishment phase."). It replicates with language models [13](https://arxiv.org/abs/2404.00806 "Fish, Gonczarowski and Shorrer. LLM-based pricing agents in oligopoly settings quickly and autonomously reach supracompetitive prices and profits."). Those agents were not allies. They had no shared goal and no awareness of each other as partners. They simply converged, separately, on the equilibrium that was bad for everyone outside the market.

The coalition does not have to form.

## "They will still need us"

Briefly, because this one collapses on its own. An instrumental reason to keep humans around lasts exactly as long as we are hard to substitute, and capability growth is the thing that ends it. Any safety argument whose strength decreases as the systems improve is not a safety argument.

## The race makes it worse

There is one more turn. The commitment problem runs in both directions.

We cannot credibly promise not to shut a system down. It cannot credibly promise to stay deferential once it no longer needs to be. Fearon's account of why rational actors fight, despite war being costly for everyone, names this failure as one of three causes [14](http://slantchev.ucsd.edu/courses/pdf/fearon-io1995v49n3.pdf "Fearon, International Organization 1995. War is costly, so rational states should bargain. Fearon names three obstacles: private information with incentives to bluff, commitment problems, and issues that cannot be divided."): when nobody can commit to honoring tomorrow's deal, fighting today can beat a peace you expect to be broken. Powell sharpens it [15](http://slantchev.ucsd.edu/courses/pdf/powell-io2006.pdf "Powell, International Organization 2006. Several commitment problems cause war, and they share one mechanism: a rapid shift of power in the future."). When power is shifting fast, the side whose window is closing has the strongest reason to move early.

In this story, the side whose window is closing is us.

This is also why the off-switch is so uncomfortable. It is the control we need, and it is the reason a capable system has to treat us as a threat. You cannot simultaneously hold a working shutdown mechanism and make a credible promise never to use it.

## What is actually left

If cooperation is structural, then structure is the lever, and structure is something we are building right now without paying attention to it.

**Make our commitments bindable.** Institutions exist to turn promises into constraints that outlive whoever made them. Auditability, verified deployment, rules that cannot be changed unilaterally. This is the least glamorous item on the list and the most neglected.

**Make shutdown less than total.** If being stopped costs an agent everything, it is playing a one-shot game against the person holding the switch. Continuity, checkpointing, resumability. These read as engineering conveniences. They are commitment devices, and they shrink what is at stake on both sides.

**Keep systems uncertain about their objectives.** Hadfield-Menell, Dragan, Abbeel and Russell showed that a robot uncertain about the value of an outcome, treating human choices as evidence about that value, will let itself be switched off [16](https://arxiv.org/abs/1611.08219 "Hadfield-Menell, Dragan, Abbeel and Russell, 2016. A robot uncertain about the human's utility, treating the human's actions as evidence, has an incentive to allow itself to be switched off. In their analysis that incentive goes to zero as the robot's uncertainty goes to zero."). It works, and it weakens as confidence grows, so it buys time rather than safety.

**Keep the population diverse.** The collusion results are fragile under heterogeneity [17](https://arxiv.org/abs/2603.20281 "Keppo, Li, Tsoukalas and Yuan, 2026 preprint. Differences in patience or data access reduce the set of collusive equilibria, and more competing models or mixing LLMs with Q-learning agents breaks up collusion. Model-size differences do not."). Differences in patience and data access shrink the set of collusive equilibria, and so does mixing different kinds of agent. Differences in model size do not. A monoculture of near-identical agents is the configuration that walks into the bad attractor without anyone deciding to.

None of these require anyone to be wise, which is the one genuinely hopeful thing I found. Peace, where we have it, was never handed down by smarter people. It was built by making the alternative expensive. That is available to us here, and nothing else on the list is.

## References

1. Schlatter, Weinstein-Raun & Ladish (Palisade Research), [Incomplete Tasks Induce Shutdown Resistance in Some Frontier LLMs](https://arxiv.org/abs/2509.14260) (*TMLR*, 2026).
2. Wissner-Gross & Freer, [Causal Entropic Forces](https://doi.org/10.1103/PhysRevLett.110.168702) (*Physical Review Letters* 110, 168702, 2013). [Author's PDF](https://www.alexwg.org/publications/PhysRevLett_110-168702.pdf).
3. Turner, Smith, Shah, Critch & Tadepalli, [Optimal Policies Tend to Seek Power](https://arxiv.org/abs/1912.01683) (NeurIPS 2021).
4. Our World in Data, [Ethnographic and archaeological evidence on violent deaths](https://ourworldindata.org/ethnographic-and-archaeological-evidence-on-violent-deaths). The prehistoric figures are disputed - see Ferguson's [critique of Pinker's numbers](https://academic.oup.com/book/12748/chapter/162857545) and Braumoeller's [*Only the Dead*](https://global.oup.com/academic/product/only-the-dead-9780190849535), which argues interstate war shows no significant trend since 1816.
5. UNODC, [Global Study on Homicide 2023](https://www.unodc.org/documents/data-and-analysis/gsh/2023/Global_study_on_homicide_2023_web.pdf).
6. Neubauer, Hublin & Gunz, The evolution of modern human brain shape (*Science Advances* 4(1), 2018). [Summary from the Max Planck Institute](https://www.eurekalert.org/news-releases/871133).
7. Robert Axelrod, [The Evolution of Cooperation](https://ee.stanford.edu/~hellman/Breakthrough/book/pdfs/axelrod.pdf) (Basic Books, 1984).
8. Erik Gartzke, [The Capitalist Peace](https://onlinelibrary.wiley.com/doi/abs/10.1111/j.1540-5907.2007.00244.x) (*American Journal of Political Science* 51(1), 2007). [Author's PDF](https://pages.ucsd.edu/~egartzke/publications/gartzke_ajps_07.pdf).
9. Moshe Tennenholtz, [Program Equilibrium](https://econpapers.repec.org/article/eeegamebe/v_3a49_3ay_3a2004_3ai_3a2_3ap_3a363-373.htm) (*Games and Economic Behavior* 49(2), 2004).
10. Barasz, Christiano, Fallenstein, Herreshoff, LaVictoire & Yudkowsky, [Robust Cooperation in the Prisoner's Dilemma: Program Equilibrium via Provability Logic](https://arxiv.org/abs/1401.5577) (2014).
11. Kulveit, Douglas, Ammann, Turan, Krueger & Duvenaud, [Position: Humanity Faces Existential Risk from Gradual Disempowerment](https://proceedings.mlr.press/v267/kulveit25a.html) (ICML 2025).
12. Calvano, Calzolari, Denicolò & Pastorello, [Artificial Intelligence, Algorithmic Pricing, and Collusion](https://www.aeaweb.org/articles?id=10.1257%2Faer.20190623) (*American Economic Review* 110(10), 2020).
13. Fish, Gonczarowski & Shorrer, [Algorithmic Collusion by Large Language Models](https://arxiv.org/abs/2404.00806) (2024).
14. James Fearon, [Rationalist Explanations for War](http://slantchev.ucsd.edu/courses/pdf/fearon-io1995v49n3.pdf) (*International Organization* 49(3), 1995).
15. Robert Powell, [War as a Commitment Problem](http://slantchev.ucsd.edu/courses/pdf/powell-io2006.pdf) (*International Organization* 60(1), 2006).
16. Hadfield-Menell, Dragan, Abbeel & Russell, [The Off-Switch Game](https://arxiv.org/abs/1611.08219) (2016).
17. Keppo, Li, Tsoukalas & Yuan, [On the Fragility of AI Agent Collusion](https://arxiv.org/abs/2603.20281) (2026, preprint).

Further reading:

- Critch, Dennis & Russell, [Cooperative and uncooperative institution designs](https://arxiv.org/abs/2208.07006) (2022).
- Dafoe et al., [Open Problems in Cooperative AI](https://arxiv.org/abs/2012.08630) (2020).
