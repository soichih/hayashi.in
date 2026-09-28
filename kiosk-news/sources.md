# Sources

Starting list, carried over from the old roll-up script plus a few obvious
additions. Update it
as you learn: add better sources, and note or remove ones that fail or add
nothing. Keep each note short: what the source is good for, and any quirks.

## Weather alerts

- api.weather.gov active alerts for Bloomington:
  https://api.weather.gov/alerts/active?point=39.1653,-86.5264
  JSON. Empty `features` means no alerts. Use the alert's headline, area and
  instructions; keep it short and factual.

## Local events

- Visit Bloomington event RSS: https://www.visitbloomington.com/event/rss/
  Broad city listings with images. Event pages are JS-rendered and WebFetch
  sees only the header/footer, so use the RSS item text and RSS image
  instead of opening the page (2026-09-22). Has had intermittent SSL errors.
  RSS image URLs are Cloudinary thumbnails (`.../upload/c_fill,h_100,...w_150/v1/...`);
  drop the `c_fill,...w_150/` transformation segment to get a full-size image
  before downloading (2026-09-22).
- IU Auditorium: https://events.iu.edu/live/rss/events/group/IU%20Auditorium/rss.xml
  events.iu.edu event pages have no og:image; the matching page on
  iuauditorium.com/events/detail/<slug> usually does (2026-09-22).
- Jacobs School of Music: https://events.iu.edu/live/rss/events/group/Jacobs%20School%20of%20Music/rss.xml
  Many student recitals - prefer larger public concerts and operas.
- Buskirk-Chumley Theater: https://buskirkchumley.org/events/
  Event pages give good detail (doors/show times, ticket codes), but posters
  are lazy-loaded so WebFetch finds no image in the HTML or og:image tag,
  and WebSearch for the poster doesn't find it either - just run the card
  without an image (2026-09-22, confirmed again). The RSS feed returns 403.
- The Bishop Bar: https://thebishopbar.com/events/feed/
  Feed was malformed for the old script; try the events page instead. Event
  pages do have a flyer image, but it's a plain `<img>`, not `og:image` - ask
  WebFetch specifically for the flyer's `src`. One individual event page
  returned a stale/wrong date that didn't match the events listing
  (2026-09-22) - trust the events-page listing over a single event page for
  the date.
- Bloomington Aikikai: https://www.bloomingtonaikido.com/club-events?format=rss
  Feed only returns a single stale event from 2024 (2026-09-23) - not useful, consider dropping if still stale next run.
- The Bloomingtonian arts roundup posts (e.g. "Bloomington arts roundup: ...")
  are a good single source for several small gallery/talk/festival events at
  once (Paint Bloomington, artist talks) that don't show up in the Visit
  Bloomington RSS feed (2026-09-23).

- Image script quirk: run it as one Bash call per image (a chained `cd ...; cmd; cmd` call was denied on 2026-09-24); parallel separate calls work (2026-09-24).
- Bloomington Aikikai feed was not rechecked on 2026-09-24; still treat as stale.
- The Bloomingtonian's WP featured-image field can carry a mismatched old photo
  (e.g. a 2019 Lotus Festival photo on a 2026 Roots, Boots & Blues Fest post,
  filename still referencing the old event) - check the filename/subject
  before using it, and skip the image if it doesn't match (2026-09-27).
- Buskirk-Chumley event pages sometimes do expose an image now, but it's just
  the venue's wide logo graphic, not a real poster - skip it as a logo-only
  image (2026-09-27).
- The B Square Bulletin (bsquarebulletin.com) is a good source for county
  government and elections detail (absentee ballots, council races) that The
  Bloomingtonian doesn't cover as deep; WebFetch of the homepage and
  individual articles both work (2026-09-27).
- WebSearch/WebFetch summaries can surface an old article as if it were
  current (e.g. an October 2025 B Square Bulletin story on an IU/IU
  Foundation land sale) - always confirm the actual publish date before
  using a "found via search" local story (2026-09-27).
- Visit Bloomington RSS via WebFetch only returns events within the range it
  infers from the request; a long-running exhibit (e.g. Future Tense 2026,
  through Oct 31) drops out of a "next 10 days" fetch but is found by asking
  WebFetch for that event by name directly - same feed, more specific ask
  (2026-09-27 evening).
- iuauditorium.com/events/detail/<slug> URLs aren't always the obvious slug
  (e.g. Waitress is `waitress-2026`, not `waitress`, which 404s) - confirm the
  real slug via WebSearch before trusting an old run's URL, and re-check
  details since they can differ from a prior run's notes (2026-09-28).
- Hilly Hundred (hillyhundred.org): a squarespace-cdn.com event photo works
  fine with the image script despite an "invalid TIFF header in Exif data"
  warning printed to stderr - the image still downloads (2026-09-28).

## Local news

- WFHB community radio: https://www.wfhb.org/feed/
  Returned 403 to WebFetch (2026-09-22); find WFHB stories via WebSearch.
- Indiana Daily Student: https://www.idsnews.com/
  Heavy IU sports coverage - skip all of it.
- The Bloomingtonian: https://bloomingtonian.com/
  WebFetch of the homepage gives a clean recent-headlines list; good for
  city/county government, police-blotter and utility stories. Individual
  article WebFetches work too (2026-09-22).
- City of Bloomington news releases: https://bloomington.in.gov/news -
  official text, no fluff, but rarely has a usable article image
  (2026-09-22).
- For county-government detail (funding, commission votes, meeting outcomes)
  WebSearch for the specific topic (e.g. "bloomingtonian.com <topic>") finds
  the right Bloomingtonian article faster than fetching the homepage list
  (2026-09-22).

## US and world news

- NBC News (found via WebSearch): og:image URLs from media-cldnry.s-nbcnews.com
  often have `f_avif` in the Cloudinary path, which the image download script
  can't read; edit the URL to `f_jpg` before downloading (2026-09-22).
- NPR text-only site: https://text.npr.org/ - the headline list works well.
  Article pages timed out ("socket hang up") on 2026-09-22, so get details
  and images via WebSearch for the story.
- AP News: https://apnews.com/ and BBC News: https://www.bbc.com/news -
  WebFetch couldn't reach either (2026-09-22). Retry occasionally; meanwhile
  use WebSearch to find their coverage of a story.
- CNN article WebFetches can return HTTP 451 (geo/legal block) even when the
  story is findable via WebSearch and other outlets cover it fine
  (2026-09-23).
- WebSearch results often surface local-affiliate mirrors of NBC/AP wire
  stories (e.g. an NBC-owned local station or an NPR-member station running
  the same AP/NPR piece) when the flagship site's article isn't in the
  results - these WebFetch fine and are a good fallback (2026-09-23).
- npr.org article pages gave "socket hang up" again on a Sunday evening run;
  member-station mirrors (opb.org, gpb.org, wsiu.org, etc., all findable by
  WebSearch for the NPR story slug) fetched fine and also exposed a usable
  og:image where the flagship npr.org page might not (2026-09-27 evening).
- watchers.news storm articles are a good source for hurricane/nor'easter
  detail and updates, but their images are lazy-loaded (data URI placeholder
  in the HTML, like Buskirk-Chumley posters) - no image, just use the story
  (2026-09-27 evening).
- IU Auditorium event pages (events.iu.edu) still have no image, but
  iuauditorium.com/events/detail/<slug> reliably has a real og:image plus
  price and pre-show-talk detail the RSS lacks - fetch that page for every
  IU Auditorium story (2026-09-27 evening, reconfirmed).

## AI news

- TechCrunch AI: https://techcrunch.com/category/artificial-intelligence/
  The category listing itself failed to WebFetch, but WebSearch (e.g.
  "site:techcrunch.com AI <date>") finds individual article URLs, and
  WebFetching those article pages works well and returns the og:image
  (2026-09-22).
- The Verge AI: https://www.theverge.com/ai-artificial-intelligence and
  Ars Technica AI: https://arstechnica.com/ai/ - WebFetch couldn't reach
  either (2026-09-22); use WebSearch for their stories.

## On this day

- Wikipedia: https://en.wikipedia.org/api/rest_v1/feed/onthisday/selected/MM/DD
  (JSON; replace MM/DD with today's date)
- Wikipedia onthisday API and NPR article pages/TechCrunch article pages can time out or 503 on WebFetch; retry once (2026-09-24). Visit Bloomington RSS via WebFetch gives no venue for most items - check the event page title or use known venues.
- Al Jazeera og:image (aje.news) returns 403 to the image script (2026-09-25); AI Weekly (https://aiweekly.co/ai-news-today) is a handy daily AI digest via WebSearch. IU Auditorium event pages can show stale dates; RSS times are UTC (11:30 PM = 7:30pm EDT).
- Evening runs (2026-09-25): NPR article pages and the Visit Bloomington weekend page (/events/events-this-weekend/) gave nothing via WebFetch (timeouts / no listings); use the RSS plus WebSearch. The image script needs a direct image URL, not an event page.
- 2026-09-26: NPR article pages timed out again via WebFetch; NPR text headline list plus WebSearch snippets (npr.org result summaries) gave enough detail. github.com/diclogic/ai-daily-digest issues are a good daily AI digest with source links. Visit Bloomington RSS via WebFetch lists ongoing exhibits under later dates; search the Bloomingtonian for time/venue of big events.
- 2026-09-26 evening: drop same-day events already ended or ending within the hour. aidapted.ro (via WebSearch) is another daily AI digest.
- 2026-09-28: github.com/diclogic/ai-daily-digest issues are dated (e.g.
  issue for 2026-09-28 exists the morning of that date) and reliably fetch
  via WebFetch - good single-stop AI roundup, but most items repeat the last
  2-3 days' stories, so cross-check dates and pick only what's genuinely new.
  A WebSearch-surfaced story can be over a week old even when it reads as
  breaking (a Sept 18 CNN story about an AI intelligence error near a
  Chinese vessel resurfaced in the Sept 28 digest as if current) - checked
  the actual publish date and dropped it as stale. npr.org article pages
  keep failing via WebFetch ("socket hang up"); non-flagship pages
  (usnews.com, aljazeera.com, dtnpf.com, fortune.com, thehackernews.com)
  fetched fine. aljazeera.com/wp-content/... image URLs (not the aje.news
  short links) downloaded fine with the image script, unlike the earlier
  aje.news 403 note.
- 2026-09-28 evening: github.com/diclogic/ai-daily-digest/issues listing page
  doesn't expose an issue's body text to WebFetch (only titles) - fetch the
  specific issue URL, or just use WebSearch for "AI news today <date>"
  instead. cnbc.com article pages still 403 WebFetch. NPR member-station
  mirrors (kpbs.org, turnto10.com) keep working well and often carry a
  usable AP/NPR og:image the flagship npr.org page might not.
