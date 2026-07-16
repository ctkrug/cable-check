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

## Planned features

- **Three-tap decision tree** covering the common real-world needs: fast charging
  (60 W / 100 W+), external displays (4K/60, 4K/120, multi-monitor), and fast data
  transfer (480 Mbps / 5 Gbps / 10 Gbps / 20 Gbps / 40 Gbps).
- **Plain-language verdicts** — the physical marking or icon to look for, not just a
  spec name.
- **"Not sure" escape hatches** at every step so a user who doesn't know their device's
  exact spec still gets a useful, conservative answer.
- **Restart / redo** to check a second cable without reloading the page.
- Zero dependencies, zero backend, works offline once loaded.

## Stack

Vanilla JavaScript, HTML, and CSS. No build step, no framework, no runtime
dependencies. A static site that runs by opening `index.html` or serving `site/`.

## Status

Early scaffold — see [`docs/VISION.md`](docs/VISION.md) for the full design rationale
and [`docs/BACKLOG.md`](docs/BACKLOG.md) for the build plan.

## License

MIT — see [`LICENSE`](LICENSE).
