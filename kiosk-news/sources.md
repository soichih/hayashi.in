# Sources

Starting list, carried over from the old roll-up script
(`pi-scripts/update_kiosk_data.py`) plus a few obvious additions. Update it
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
