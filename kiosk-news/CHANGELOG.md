# Changelog

One dated line per edit the agent makes to this skill: what changed and why.

- 2026-09-28 evening: sources.md: noted github.com/diclogic/ai-daily-digest's
  issues index doesn't expose issue bodies to WebFetch (fetch the specific
  issue or use WebSearch instead), cnbc.com article pages still 403, and NPR
  member-station mirrors (kpbs.org, turnto10.com) reliably carry a usable
  og:image.
- 2026-09-27: Added "Using recent history" (by the site owner's session, not the agent): runs now get recent.yml with the last 7 days of published stories.
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
2026-09-25 (evening run): sources.md - noted NPR article pages and the Visit Bloomington weekend page fail via WebFetch, and that the image script needs direct image URLs.
- 2026-09-26: sources.md - noted NPR timeouts, AI daily digest source, RSS quirks.
2026-09-26 (evening run): sources.md - noted evening runs should drop events already over; aidapted.ro is another daily AI digest.
- 2026-09-27: sources.md - added The B Square Bulletin as a good elections/county-government source; noted a Bloomingtonian featured image mismatched its story (old event's photo), a Buskirk-Chumley event image that was just the venue logo, and a case where search/fetch summaries surfaced a year-old article as current - always check the actual publish date.
- 2026-09-27 (evening run): sources.md - noted npr.org article pages timing
  out again but member-station mirrors (opb.org, gpb.org, etc.) working and
  exposing og:image; watchers.news storm images are lazy-loaded and
  unusable; iuauditorium.com/events/detail/<slug> reconfirmed as the
  reliable image/price source for IU Auditorium events; Visit Bloomington
  RSS needs a by-name ask to surface long-running exhibits outside a "next
  10 days" date range.
- 2026-09-28 (morning run): sources.md - noted an IU Auditorium event slug
  that doesn't match the event name (Waitress is `waitress-2026`); confirmed
  a squarespace-cdn.com image downloads fine despite an Exif-header warning;
  added ai-daily-digest usage notes (dated issues, but re-check freshness -
  caught a week-old CNN story resurfacing as if current); noted more
  non-flagship sites that WebFetch fine when npr.org times out; noted
  aljazeera.com/wp-content image URLs work with the image script even though
  aje.news short links don't.
- 2026-09-29: sources.md - noted plain WebSearch for "AI news today <date>"
  and "site:techcrunch.com AI <date>" found same-day AI exclusives faster
  than the digest sites; noted fortune.com WebFetch doesn't expose an
  og:image tag but its inline image URL still downloads fine; reconfirmed
  cnn.com article WebFetch still 451s.
- 2026-09-29 (evening run): sources.md - noted techcrunch.com article
  WebFetches sometimes omit meta tags entirely (no og:image found even when
  one exists) and a same-story search on another outlet (engadget.com,
  abcnews.com) often finds one instead; noted searching "<topic> photo AP/
  photo Reuters" is a reliable way to locate a wire-image URL; noted to
  double-check the publish date on stories that read as breaking but may be
  old (caught a January Iraq-withdrawal story almost getting reused as
  today's news); confirmed the Bloomingtonian's mismatched 2019 Lotus
  masthead photo shows up as "og:image" on multiple unrelated posts, so
  treat that specific filename as no-image rather than re-checking each
  time; hillyhundred.org homepage image reconfirmed usable.
- 2026-09-30: sources.md - noted euronews.com article pages are a reliable
  fallback for a usable og:image on wire (AP) stories when the original
  AP-member site 403s or has no exposed og:image; noted stripes.com direct
  image URLs and iuauditorium.com/assets/img/... URLs both download fine;
  noted today.iu.edu event image paths are relative and need the domain
  prepended; reconfirmed npr.org article WebFetch still fails even same-day
  and abcnews.com wireStory pages rarely expose a fetchable og:image despite
  citing a photo credit in text. Also confirmed the lotusfest.org lineup
  page's lead image is a stale 2019 festival photo, not a current one -
  skip it like the Bloomingtonian masthead case.
- 2026-10-01 (evening run): sources.md - added Just Security "Early Edition"
  as a one-page daily US/world digest; reconfirmed the Bloomingtonian
  masthead og:image issue; noted evening runs should drop events starting
  before ~7pm and skip sports items in the Visit Bloomington RSS.
