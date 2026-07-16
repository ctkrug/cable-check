# Design

## 1. Aesthetic direction

**Blueprint / technical.** Cable Check is a schematic instrument, not a chat
app: deep blueprint-navy canvas, cyan hairline diagrams, and annotation-style
callouts that look like they were traced off an engineering drawing of a
USB-C plug. The content is literally "read the tiny marking on the plug" —
a blueprint frame makes that the whole point of the page instead of an
afterthought. This direction has not been used on recent sibling ships;
avoid falling back to generic dark-gray-cards-plus-one-accent.

One sentence: *Cable Check is a blueprint clipped to a clipboard — navy
drafting-paper canvas, cyan schematic lines, and a plug diagram that gets
annotated live as you answer.*

## 2. Tokens

| Token | Value | Use |
|---|---|---|
| `--bg` | `#0b1524` | page background (blueprint navy) |
| `--surface-1` | `#122036` | question card / panel |
| `--surface-2` | `#182c49` | raised elements (buttons, chips) |
| `--text` | `#e7f1ff` | primary text |
| `--text-muted` | `#8ea3c4` | secondary/help text |
| `--accent` | `#4fd8e8` | cyan — schematic lines, primary CTA, focus ring |
| `--accent-support` | `#ffb454` | amber — annotation callouts, highlighted marking |
| `--success` | `#5be18a` | correct/verdict-found state |
| `--danger` | `#ff6b6b` | "not sure" conservative-warning state |

- **Type pairing:** Display — [Space Mono](https://fonts.google.com/specimen/Space+Mono)
  (drafting-stencil character for the wordmark and question headlines). UI —
  [Inter](https://fonts.google.com/specimen/Inter) for body copy and controls.
  System fallback stack: `ui-monospace, "SF Mono", monospace` /
  `system-ui, -apple-system, sans-serif`.
- **Spacing unit:** 8px base scale (8/16/24/32/48/64).
- **Corner radius:** 4px — schematic/drafted, not soft or bubbly.
- **Depth:** thin 1px cyan hairline borders (`--accent` at 35% opacity) plus a
  faint cyan outer glow on the active card, evoking a lit schematic trace
  rather than a soft drop shadow.
- **Motion:** UI transitions 150ms ease-out; the plug-diagram annotation draws
  in over 200ms (stroke-dashoffset animation) each time a question resolves.

## 3. Layout intent

The hero is a **live plug diagram**: a schematic line-drawing of a USB-C plug
that stays on screen through the whole flow and gets annotated (an arrow +
label pointing at "here's the marking to check") only on the final verdict
screen. Below/beside it sits the current question as a card with 2-4 large
tappable options.

- **Desktop (1440×900):** two-column layout — plug diagram fills the left
  ~55% of the viewport (vertically centered, glowing cyan lines on navy),
  question card sits in the right ~45%, vertically centered. Combined they
  fill the full viewport height; no empty margin band top or bottom.
- **Phone (390×844):** single column, stacked — diagram on top (~40vh,
  shrinks but never disappears), question card below filling the remaining
  height, options full-width and stacked.
- The primary interactive element (the question card and its options) always
  occupies the majority of interactive attention even though the diagram is
  visually dominant — options are large-target, high-contrast, first in tab
  order.

## 4. Signature detail

The plug diagram is drawn in SVG and **redraws its annotation live**: each
time the user answers a question, a new cyan/amber callout line sweeps in
(stroke-dashoffset animate) pointing at the part of the plug relevant to that
answer, so by the final verdict the diagram looks hand-annotated rather than
static. That live-annotating diagram is the one flourish — everything else on
the page stays restrained pen-and-ink blueprint styling.

## 5. Juice plan (lightweight — not a game, but interactions still respond)

- **Selecting an option:** 120ms depress + border glow brighten
  (`--accent` opacity 35% → 80%), plus a short (~80ms) synthesized tick
  (WebAudio square-wave blip, ~880Hz, very low gain) confirming the tap.
- **Advancing to the next question:** the diagram's annotation line
  stroke-draws in over 200ms ease-out as the question card cross-fades
  (150ms).
- **Reaching a verdict:** a slightly longer (~300ms) two-tone synthesized
  chime (two sine tones) and the final annotation arrow draws onto the plug
  diagram with a brief amber highlight pulse on the labeled marking.
- **Mute toggle** (speaker icon, top-right, `aria-label="Mute sound"`) persists
  its state in `localStorage`; `AudioContext` is created lazily on first tap
  (autoplay-policy safe) and every sound call is guarded for environments
  where `window.AudioContext` is undefined (tests, older browsers).
- Respects `prefers-reduced-motion`: stroke-draw and pulse animations are
  replaced with instant state swaps; sound is unaffected (motion and audio
  are independent preferences).
