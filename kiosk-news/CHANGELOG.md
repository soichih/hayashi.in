# Changelog

One dated line per edit the agent makes to this skill: what changed and why.

- 2026-09-22: Initial version, seeded from the old Ollama roll-up sources.
- 2026-09-22: Recorded first-run source results in sources.md (AP, BBC, The
  Verge, Ars unreachable via WebFetch; WFHB 403; NPR article pages time out;
  Visit Bloomington pages JS-rendered; Buskirk-Chumley posters lazy-loaded).
  Added by hand: the agent's own skill edits were denied on that run.
- 2026-09-22: Writing rules: omit `where` when the venue is unknown, and cut
  closing filler sentences.
- 2026-09-22: sources.md: added The Bloomingtonian and the city's official
  news-release page as local-news sources (found better city/county
  government coverage there than IDS); noted that Visit Bloomington RSS
  image URLs need their Cloudinary thumbnail transform stripped for full
  resolution; noted TechCrunch article pages (found via WebSearch) WebFetch
  fine even though the category listing doesn't; reconfirmed Buskirk-Chumley
  event pages never expose a poster image via WebFetch or WebSearch.
