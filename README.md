# Cable Check

[![CI](https://github.com/ctkrug/cable-check/actions/workflows/ci.yml/badge.svg)](https://github.com/ctkrug/cable-check/actions/workflows/ci.yml)
[![License: MIT](https://img.shields.io/badge/License-MIT-blue.svg)](LICENSE)

A 10-second quiz for the drawer full of unlabeled USB-C cables. Answer three quick
questions — what device, what you need (100W charging, 4K video, 10Gbps transfer) — and
get back exactly one thing: the spec or physical marking to look for on the cable you
already own. No spec chart, no article, no database to search.

## Why

USB-C looks like one connector but hides a dozen overlapping standards (USB 2.0 vs
3.2 vs 4, Thunderbolt, DisplayPort Alt Mode, USB-PD wattage tiers) that all use the
*same plug*. Most guides respond to this by dumping the whole spec table on the reader
and letting them figure out which row applies. Cable Check inverts that: it asks three
questions and throws away every row that doesn't apply, so the reader never sees the
mess in the first place.

## The wow moment

Tap through three questions (device → need → what's printed on the cable, if anything)
and land on a single answer like:

> Look for a **lightning-bolt icon** or **5A** printed near the plug — that's your
> 100 W-capable cable.

No scrolling, no comparison table, no jargon to decode first.

## Features

- **Three-tap decision tree** covering the common real-world needs: fast charging,
  driving a display, fast file transfer, and plain basic charging.
- **Plain-language verdicts** — the physical marking or icon to look for (a
  lightning bolt, `5A`, `DP`, `SS10`), never a raw spec name.
- **"Not sure" escape hatches** at every step, always steering to the safer,
  conservative answer when the input is uncertain.
- **Live-annotating plug diagram** that gets marked up as you answer, with
  synthesized tap/verdict sound and a persistent mute toggle.
- **Restart** to check a second cable without reloading the page.
- Zero runtime dependencies, zero backend, works offline once loaded.

## Stack

Vanilla JavaScript, HTML, and CSS. No build step, no framework, no runtime
dependencies. A static site that runs by opening `index.html` or serving `site/`.

## Development

```
npm install
npm run check   # lint + tests
npm run dev     # preview site/ locally
```

## Status

Core flow complete and tested end-to-end. See [`docs/VISION.md`](docs/VISION.md) for
the design rationale, [`docs/DESIGN.md`](docs/DESIGN.md) for the visual direction,
[`docs/ARCHITECTURE.md`](docs/ARCHITECTURE.md) for the module map, and
[`docs/BACKLOG.md`](docs/BACKLOG.md) for the build plan. Deployment notes live in
[`docs/DEPLOY.md`](docs/DEPLOY.md).

## License

MIT — see [`LICENSE`](LICENSE).
