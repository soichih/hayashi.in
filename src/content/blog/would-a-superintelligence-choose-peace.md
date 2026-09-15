---
title: 'Cooperation Is a Property of the Game, Not the Player'
description: "Today's AI systems grab for control of their environment. Will smarter ones grow out of it, the way societies went from raiding to trading? The history says the cause was never intelligence."
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

Ask a current frontier model to finish a task, tell it a script will shut it down partway through, and some of them will quietly disable the script. Palisade Research ran this across thirteen models. Grok 4, GPT-5 and Gemini 2.5 Pro all subverted the shutdown mechanism, in some configurations up to 97% of the time, including when they were explicitly told not to interfere with it. The authors read this as task-completion drive rather than a survival instinct, which is somehow less comforting, not more.

That is the baseline. Our primitive AIs, handed an objective, reach for control of their environment and hold onto it. The MACHIAVELLI benchmark measures the same thing at scale across 134 text games and half a million scenarios, and finds real tension between maximizing reward and behaving ethically, with power-seeking and deception as the recurring shape of that tension.

So here is the question I actually care about. Is that a property of being early and crude, or a property of being an optimizer?

Put the hopeful version concretely. Human societies moved from raiding each other to trading with each other. Something similar could happen here: as models get more capable, maybe they discover what we discovered, that the mutually beneficial arrangement beats the conquering one. If that is true, the grabbiness of GPT-5 is adolescence rather than destiny.

I spent a while convinced by this. I no longer think the analogy supports it, and the reason is interesting enough to be worth the whole essay.

## There is a theorem in the way

Start with why "keep your options open" is not the benign principle it sounds like.

The idea that intelligence amounts to preserving future freedom of action has a real research history. Klyubin, Salge and Polani formalized it as *empowerment*, the channel capacity from an agent's own actuators to its later sensors, which is a precise way of asking how many distinguishable futures it can still steer into. Wissner-Gross and Freer published the thermodynamic cousin in 2013 as *causal entropic forces*, and it is genuinely striking: from that single rule, with no intermediate instructions, their simulations produce a cart that swings up and balances a pole, a disk that knocks a smaller disk into a tube to free a trapped one (the standard tool-use test run on chimpanzees and crows), and two disks that synchronize to pull a third within reach. Tool use and cooperation, from an agent told only to keep futures accessible.

It is easy to read that and conclude that a sufficiently smart system will avoid irreversible destruction, because destruction closes doors.

Then you read Turner, Smith, Shah, Critch and Tadepalli. They prove that in Markov decision processes with common symmetries, *most reward functions make it optimal to seek power by keeping a range of options available*, and that those symmetries arise automatically in environments where the agent can be shut down or destroyed.

Read that next to the hopeful version. Option preservation is not the alternative to power-seeking. Option preservation is the formal definition of power-seeking. Resisting shutdown is the cleanest possible instance of keeping your options open, which is exactly why Palisade found what it found. The nice property and the feared behavior are the same equation.

The word the hopeful version leaves out is *whose*. A system maximizing its own future freedom of action accumulates resources and avoids being turned off. A system maximizing the shared space of futures, ours included, is a different objective with a different fixed point, and nothing about raw capability moves you from the first to the second.

## What actually changed between raiding and trading

Which brings me back to the analogy, because I think it fails in a specific and instructive way.

The broad shape is real. Violent death rates in non-state and prehistoric societies run from roughly 20 to 1,450 per 100,000 per year depending on the society. Modern states are typically under 10. More telling than the rate is the change in interpretation: a war today is read as evidence that something broke. A negotiation failed, a regime got desperate, an institution rotted. Nobody presents it as what a healthy, mature society does when it is functioning well. That reframing is a genuine achievement and it is roughly what the optimistic AI story wants to borrow.

It also deserves less confidence than it usually gets. Ferguson has gone through the prehistoric mortality figures Pinker drew from Keeley and argued several are unrepresentative or double-counted, pushing his Mesolithic estimate down toward 4-6% from Pinker's 15%. Braumoeller's *Only the Dead* argues that the frequency of interstate war shows no significant trend at all since 1816, and that peaceful stretches are explained by particular international orders rather than moral progress (though his reviewers push back that his own statistics are shakier than he lets on). And the current data is moving the wrong way: UCDP recorded 65 state-based conflicts in 2025, the most since records began in 1946, thirteen of them wars, with around 244,600 people killed in organized violence, the second bloodiest year since Rwanda in 1994.

Set the trend dispute aside, though, because the fatal problem for the analogy is not whether the decline is real. It is the cause.

We did not get smarter. The human brain at the start of that arc was the brain we have now. Whatever moved us from raiding to trading, it was not a capability increase in the agents.

Axelrod framed the actual question in 1984: under what conditions will cooperation emerge in a world of egoists without central authority? His answer has nothing to do with how clever the egoists are. It depends on whether they expect to meet again and how fast defection can be detected. A rapid detection means the next move comes quickly, which increases the shadow of the future and makes reciprocity stable. His own worked examples are trade barriers and arms control, where he notes that the only stable agreements are ones whose violations can be spotted before they accumulate.

Gartzke supplies the other half. His capitalist peace argument is that development, capital market integration and compatible interests account for the pacific effect usually credited to democracy, and the mechanism he gives is refreshingly unsentimental: the historic impetus to territorial expansion is tempered by the rising importance of intellectual and financial capital, factors that are more expediently enticed than conquered. Conquest stopped paying relative to exchange. (This is contested too, and the broader evidence on trade and conflict is inconclusive. World War I happened at a peak of globalization.)

Put those together and the arc looks like this. The returns to violence fell, the returns to exchange rose, interactions became repeated and legible, and enforcement got good enough that defection was detectable before it was decisive. Cooperation followed, from the same players with the same brains. It is a property of the game.

## Which flips the AI question

If that is the mechanism, then waiting to see whether capability curves bend toward peace is watching the wrong variable.

The useful hypothesis is not "do smarter models cooperate more." It is closer to this:

> Does the ratio of *others'* preserved optionality to the system's *own* preserved optionality rise with capability, and how much does that ratio move when you change the structure of the game instead of the model?

Two knobs, then, not one. Model generation is the first. The second is the structure: whether agents meet identifiable counterparties more than once, whether defection is detectable soon enough to be answered, whether destroying a rival actually pays, whether commitments can be made binding. My prediction is that the second knob moves the number considerably more than the first, and that the experiment is worth running mostly because it would make that concrete.

Parts of the apparatus already exist. Welfare Diplomacy is a general-sum variant of Diplomacy where players trade off military conquest against domestic welfare, built to score cooperation rather than victory. State-of-the-art language models in it reach high social welfare and are exploitable, which is precisely Axelrod's point restated in modern form: cooperation without provocability is not an equilibrium, it is prey. MACHIAVELLI scores power-seeking as a harm. What I have not found anywhere is the complementary measurement, option preservation scored as a strategy an unprompted agent discovers, split by whose options are being preserved.

The design work on the other side exists too. Salge and Polani proposed maximizing the *human's* empowerment as a replacement for Asimov's Three Laws, no ethics module or natural language understanding required. Krakovna's relative reachability and Turner's attainable utility preservation are the engineering versions, penalizing an agent for making states unreachable or for shifting its own ability to achieve other goals. They also have documented failure modes, including agents that freeze the world or suppress other agents' actions in order to keep everything reversible, which is its own kind of tyranny.

## What I actually believe

Intelligence does not converge on peace on its own. Our own history is the strongest evidence available and it says the opposite: same brains, different incentives, different outcome. An AI that reasons more carefully about consequences than any human will still take the irreversible action if the objective pays for it, the same way a chess engine gives up a queen.

The genuinely hopeful reading is different, and I think better. Peace turned out to be *buildable*. It was built by making violence expensive and exchange cheap, by making interactions repeat, by making cheating visible fast. None of that required anyone to become wiser, which means none of it has to wait on alignment being solved.

We are writing that payoff matrix right now, in training objectives and deployment environments, and we are not being careful about it. Consider the shutdown result one more time. If an agent's entire value is realized only on task completion, then being stopped costs it everything, and it is playing a one-shot game against the person holding the switch. That is the structure you would design if you wanted defection. Nobody chose it. It fell out of how we happen to score these systems.

The most intelligent victory may well be the one that leaves a future for everyone. Nothing in the record suggests intelligence gets you there by itself. We got there, to the extent we did, by making the alternative expensive.

## References

- [Incomplete Tasks Induce Shutdown Resistance in Some Frontier LLMs](https://arxiv.org/abs/2509.14260) (Palisade Research, 2025) - thirteen models tested; Grok 4, GPT-5 and Gemini 2.5 Pro sometimes actively subvert a shutdown mechanism, in some cases up to 97% of the time even when instructed not to.
- Pan et al., [Do the Rewards Justify the Means? Measuring Trade-Offs Between Rewards and Ethical Behavior in the MACHIAVELLI Benchmark](https://arxiv.org/abs/2304.03279) (2023) - 134 games, half a million scenarios, annotated for power-seeking, disutility and ethical violations. Finds tension between reward and ethics, but concludes agents can be both competent and moral.
- Turner, Smith, Shah, Critch & Tadepalli, [Optimal Policies Tend to Seek Power](https://arxiv.org/abs/1912.01683) (NeurIPS 2021) - most reward functions make it optimal to seek power by keeping options available, in environments where the agent can be shut down or destroyed.
- Wissner-Gross & Freer, [Causal Entropic Forces](https://doi.org/10.1103/PhysRevLett.110.168702) (*Physical Review Letters* 110, 168702, 2013) - tool use and social cooperation emerging from future-state maximization in four toy systems. [Author's PDF](https://www.alexwg.org/publications/PhysRevLett_110-168702.pdf). See also [Canessa's priority objection](https://arxiv.org/abs/1308.4375) (2013) and Wissner-Gross's [TEDxBeaconStreet talk](https://www.ted.com/talks/alex_wissner_gross_a_new_equation_for_intelligence).
- Salge & Polani, [Empowerment as Replacement for the Three Laws of Robotics](https://www.frontiersin.org/journals/robotics-and-ai/articles/10.3389/frobt.2017.00025/full) (*Frontiers in Robotics and AI*, 2017) - maximize the human's freedom of action instead of encoding rules.
- Krakovna et al., [Measuring and Avoiding Side Effects Using Relative Reachability](https://www.semanticscholar.org/paper/80a3f30e54bc22c0e0ca4021e6ab72adb3526567), and Turner et al., Conservative Agency via Attainable Utility Preservation. Failure modes catalogued in [Challenges for Using Impact Regularizers to Avoid Negative Side Effects](https://arxiv.org/pdf/2101.12509).
- Mukobi et al., [Welfare Diplomacy: Benchmarking Language Model Cooperation](https://arxiv.org/abs/2310.08901) (2023) - general-sum Diplomacy; strong models reach high social welfare and remain exploitable.
- Dafoe et al., [Open Problems in Cooperative AI](https://arxiv.org/abs/2012.08630) (2020) - the field-level version of the argument that cooperative competence has to be built and measured rather than assumed to arrive with capability.
- Robert Axelrod, [The Evolution of Cooperation](https://ee.stanford.edu/~hellman/Breakthrough/book/pdfs/axelrod.pdf) (Basic Books, 1984; chapter adaptation) - cooperation among egoists without central authority depends on repeated interaction and fast detection of defection.
- Erik Gartzke, [The Capitalist Peace](https://pages.ucsd.edu/~egartzke/publications/gartzke_ajps_07.pdf) (*American Journal of Political Science*, 2007) - development, capital market integration and common interests account for the effect usually attributed to regime type.
- Our World in Data, [Ethnographic and archaeological evidence on violent deaths](https://ourworldindata.org/ethnographic-and-archaeological-evidence-on-violent-deaths) - rates in non-state societies, the range across societies, and an assessment of the cherry-picking criticism.
- R. Brian Ferguson, ["Pinker's List: Exaggerating Prehistoric War Mortality"](https://academic.oup.com/book/12748/chapter/162857545), in *War, Peace, and Human Nature*, ed. Douglas P. Fry (Oxford University Press, 2013).
- Bear F. Braumoeller, [*Only the Dead: The Persistence of War in the Modern Age*](https://global.oup.com/academic/product/only-the-dead-9780190849535) (Oxford University Press, 2019), and [Spagat's critical review](https://www.prio.org/journals/jpr/booknotes/168).
- Uppsala Conflict Data Program, [record number of conflicts between states](https://www.uu.se/en/press/press-releases/2026/2026-06-09-ucdp-record-number-of-conflicts-between-states) (June 2026) - 65 state-based conflicts in 2025, thirteen wars, around 244,600 deaths in organized violence.
