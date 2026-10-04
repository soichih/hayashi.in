---
name: blog-writing
description: Write or revise a blog post for hayashi.in, including turning a diary entry or rough notes into a post. Use when asked to draft, improve, or publish a post in src/content/blog/.
---

# Blog writing for hayashi.in

Posts are short personal essays in the owner's voice. Keep their ideas and wording, and fix only what gets in the way.

## Starting from a diary entry or notes

1. Find the one claim the piece makes. Say it back in a sentence. If there are two, they are two posts.
2. Check the existing posts in `src/content/blog/`. If the idea extends one, link to it from the new post. Don't merge unless the mood matches.
3. Keep the owner's order of thought. Cut repeated lines, fix grammar and typos, and leave the rest.
4. Don't add claims the owner didn't make. If a phrase is yours, flag it in your reply so they can check it says what they mean.

## Shape

- 300 to 700 words. Four or five paragraphs is usual.
- Open with the situation or the tempting view, not a definition or a restated title.
- State the position. Don't survey both sides and commit to neither.
- One metaphor, used once. Don't explain it after it lands.
- Admit where people (including the author) fall short. It keeps the piece honest.
- End on the last real point. No recap, no "I hope this helps".

## Voice

Follow "Public-facing writing" in the user's `CLAUDE.md`: direct, concrete, plain verbs, ASCII hyphen only, straight quotes, no emoji, avoid semicolons in prose, no throat-clearing or inflated words. Cut hedges like "I think" when the sentence is a claim.

## The owner's style

Direct and honest, a little funny, a little melancholy, and hopeful in the end. The examples below are quoted from the owner's published posts.

- **Starts from a flaw in the author, not in other people.** "I've noticed something in myself that I'm not proud of." and "I've done this more than once." Blame lands on the writer first.
- **One small concrete image carries the idea.** A three-legged table for human weakness. Air molecules that "define the temperature of a room" for how people shape each other. An "ugly button" dropped on a landing page for shipping your own excitement at someone else. Use the image once, then move on.
- **Dry humor, never a punchline.** "Nobody is the deer. We just take turns noticing which leg is missing." The joke is a plain sentence that happens to be funny.
- **Sad without despair.** "To be missed, quietly and specifically, by the people who actually knew you." The loss is stated, then the post turns to what we can do.
- **Short last lines.** "Someone built that. I just forgot to ask who." End on the plain fact, not a moral.
- **Opinions are marked as opinions.** "I think" is fine where the topic is contested. Cut it where it only softens a plain claim.

Writers with the same register, to calibrate against (not to imitate):

- **Kurt Vonnegut.** Humane, funny and sad in one sentence, and willing to state the one rule he believes. In *God Bless You, Mr. Rosewater*, a speech to newborns ends: "There's only one rule that I know of, babies - God damn it, you've got to be kind." Plain words, a joke up front, and a claim that holds. That is the target for posts like "We don't fight alone".
- **John Prine.** Plain, kind, funny and sad, and notices people others overlook. "Hello in There" is a song about old people nobody greets, and it never raises its voice. Take the restraint: say what you saw and let it be sad on its own.
- **Billy Collins.** Wry and quietly sad, and easy to read. Take the ease: no strained words for a deep feeling.
- **Philip Larkin.** Honest and dry, but bleaker than the owner. Useful as the foil: Larkin tends to end on people failing each other, the owner goes on to keep trying.

Quote these writers only in short pieces and only after confirming the exact wording from a source. Don't quote song lyrics at length.

## Posts about the owner's own systems

Describe the idea and the lessons, not the inventory. No device lists, schedules, ports, versions, or what a monitor can't see. The repo is public.

## Sources

If a post cites anything, fetch each source and confirm it says what the post claims before committing. Never link to a pirated copy.

## Files and workflow

- Scaffold with `bun run post:new`, or copy the frontmatter of an existing post: `title`, `description` (one sentence), `date`, `tags`, `categories`, `showHeroImage: false`, `comments: true`.
- Work on a branch in a separate worktree (`git worktree add ../hayashi.in-<topic> -b <topic> origin/main`). Automation pushes `main` from the main checkout, so anything unapproved must not sit there.
- Run `SITE_URL=https://hayashi.in SITE_BASE=/ bun run build` and confirm the post's page is generated.
- Merge to `main` and push only when the owner says to publish. Pushing deploys.

## Keep this skill current

This skill should track how the owner actually writes. After finishing a post, or after the owner corrects a draft, check whether the correction is a pattern and not a one-off. If it is (a phrase they always cut, a length they prefer, an opening or ending they like), add it here in one line under the matching section, in the same plain style. Replace guesses with what the owner's edits show, and delete a rule the owner contradicts.

Tell the owner what you changed in this file. Commit it with the post, so the rule and the evidence for it stay together. Never add private details, since this file is public.
