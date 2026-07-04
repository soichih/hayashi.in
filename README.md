# hayashi.in

Personal website for Soichi Hayashi — https://hayashi.in

Built with the [Navfolio](https://github.com/dodolalorc/astro-navfolio) Astro theme
(MIT, © dodolalorc), deployed to GitHub Pages via GitHub Actions.

## Develop

Requires [Bun](https://bun.sh) and Node ≥ 22.12.

```sh
bun install
bun run dev      # local dev server
bun run build    # static build -> dist/ (Astro build + Pagefind search index)
bun run preview  # preview the production build
```

## Editing content

- `src/config/site.toml` — profile, navigation, homepage, palette, links
- `src/content/blog/` — blog posts (`bun run post:new`)
- `src/content/projects/` — project writeups
- `src/content/vibe/` — short notes (`bun run vibe:new`)
- `src/content/about.mdx` — the About page
- `public/` — static assets (avatar, CNAME, etc.)

See `CLAUDE.md` for the full architecture and conventions.
