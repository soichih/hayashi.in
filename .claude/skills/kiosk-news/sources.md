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
  Broad city listings with images, but descriptions are truncated - open each
  event page for details. Has had intermittent SSL errors.
- IU Auditorium: https://events.iu.edu/live/rss/events/group/IU%20Auditorium/rss.xml
- Jacobs School of Music: https://events.iu.edu/live/rss/events/group/Jacobs%20School%20of%20Music/rss.xml
  Many student recitals - prefer larger public concerts and operas.
- Buskirk-Chumley Theater: https://buskirkchumley.org/events/feed/
  The feed returned 403 to the old script; try the site's events page instead.
- The Bishop Bar: https://thebishopbar.com/events/feed/
  Feed was malformed for the old script; try the events page instead.
- Bloomington Aikikai: https://www.bloomingtonaikido.com/club-events?format=rss

## Local news

- WFHB community radio: https://www.wfhb.org/feed/
- Indiana Daily Student: https://www.idsnews.com/
  Heavy IU sports coverage - skip all of it.

## US and world news

- AP News: https://apnews.com/
- NPR text-only site: https://text.npr.org/ (lightweight, easy to fetch; the
  full article pages don't carry images - get the image from the regular
  npr.org article if needed)
- BBC News: https://www.bbc.com/news

## AI news

- The Verge AI: https://www.theverge.com/ai-artificial-intelligence
- TechCrunch AI: https://techcrunch.com/category/artificial-intelligence/
- Ars Technica AI: https://arstechnica.com/ai/

## On this day

- Wikipedia: https://en.wikipedia.org/api/rest_v1/feed/onthisday/selected/MM/DD
  (JSON; replace MM/DD with today's date)
