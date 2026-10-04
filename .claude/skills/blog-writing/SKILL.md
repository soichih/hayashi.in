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

## Posts about the owner's own systems

Describe the idea and the lessons, not the inventory. No device lists, schedules, ports, versions, or what a monitor can't see. The repo is public.

## Sources

If a post cites anything, fetch each source and confirm it says what the post claims before committing. Never link to a pirated copy.

## Files and workflow

- Scaffold with `bun run post:new`, or copy the frontmatter of an existing post: `title`, `description` (one sentence), `date`, `tags`, `categories`, `showHeroImage: false`, `comments: true`.
- Work on a branch in a separate worktree (`git worktree add ../hayashi.in-<topic> -b <topic> origin/main`). Automation pushes `main` from the main checkout, so anything unapproved must not sit there.
- Run `SITE_URL=https://hayashi.in SITE_BASE=/ bun run build` and confirm the post's page is generated.
- Merge to `main` and push only when the owner says to publish. Pushing deploys.
