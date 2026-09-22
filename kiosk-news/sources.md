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
- IU Auditorium: https://events.iu.edu/live/rss/events/group/IU%20Auditorium/rss.xml
- Jacobs School of Music: https://events.iu.edu/live/rss/events/group/Jacobs%20School%20of%20Music/rss.xml
  Many student recitals - prefer larger public concerts and operas.
- Buskirk-Chumley Theater: https://buskirkchumley.org/events/
  Event pages give good detail (doors/show times, ticket codes), but posters
  are lazy-loaded so WebFetch finds no image - try WebSearch for the event's
  image, or run the card without one (2026-09-22). The RSS feed returns 403.
- The Bishop Bar: https://thebishopbar.com/events/feed/
  Feed was malformed for the old script; try the events page instead.
- Bloomington Aikikai: https://www.bloomingtonaikido.com/club-events?format=rss

## Local news

- WFHB community radio: https://www.wfhb.org/feed/
  Returned 403 to WebFetch (2026-09-22); find WFHB stories via WebSearch.
- Indiana Daily Student: https://www.idsnews.com/
  Heavy IU sports coverage - skip all of it.

## US and world news

- NPR text-only site: https://text.npr.org/ - the headline list works well.
  Article pages timed out ("socket hang up") on 2026-09-22, so get details
  and images via WebSearch for the story.
- AP News: https://apnews.com/ and BBC News: https://www.bbc.com/news -
  WebFetch couldn't reach either (2026-09-22). Retry occasionally; meanwhile
  use WebSearch to find their coverage of a story.

## AI news

- TechCrunch AI: https://techcrunch.com/category/artificial-intelligence/
- The Verge AI: https://www.theverge.com/ai-artificial-intelligence and
  Ars Technica AI: https://arstechnica.com/ai/ - WebFetch couldn't reach
  either (2026-09-22); use WebSearch for their stories.

## On this day

- Wikipedia: https://en.wikipedia.org/api/rest_v1/feed/onthisday/selected/MM/DD
  (JSON; replace MM/DD with today's date)
