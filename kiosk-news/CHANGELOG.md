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
- 2026-09-22 (evening run): sources.md: noted Bishop Bar event pages carry a
  flyer image as a plain `<img>` (not `og:image`) and that one event page
  gave a stale date - trust the events listing page instead; noted IU
  Auditorium event pages have no image but the matching iuauditorium.com
  page usually does; noted NBC News og:image URLs with `f_avif` fail the
  image download script and need `f_jpg` substituted in.
- 2026-09-23 (morning run): sources.md: noted Bloomington Aikikai RSS only
  returns one stale 2024 event; added The Bloomingtonian's periodic "arts
  roundup" posts as a good source for small gallery/talk events missing from
  Visit Bloomington RSS; noted CNN article WebFetches can 451 even when
  WebSearch finds the story elsewhere; noted local-affiliate/member-station
  mirrors of NBC/AP/NPR wire stories are a reliable WebFetch fallback when
  the flagship site's URL isn't surfaced by WebSearch. TechCrunch og:image
  URLs are sometimes `.avif` files the image script can't read (no working
  substitution found yet, unlike NBC's `f_avif` case) - dropped that story's
  image rather than retry.
- 2026-09-24: sources.md - noted to run the image script one Bash call per image (chained call was denied).
2026-09-24: sources.md - noted flaky WebFetch on Wikipedia/NPR/TechCrunch and missing venues in Visit Bloomington RSS.
2026-09-25: sources.md - noted aje.news image 403, AI Weekly digest, and IU Auditorium UTC times, from this run.
