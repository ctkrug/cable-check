# Deploy

Cable Check is a static, self-contained site with no build step.

- **Build output directory:** `site/` — contains `index.html` and every
  asset it references, all via relative paths.
- **Build command:** none. `site/` is served as-is.
- **Local preview:** `npm run dev` (serves `site/` on a local port).
- **Hosting target:** designed to be published under a subpath, e.g.
  `apps.charliekrug.com/cable-check`. Because every asset reference in
  `site/index.html` is relative (no leading `/`), the directory works
  unmodified whether it's served from the domain root or a subdirectory.
