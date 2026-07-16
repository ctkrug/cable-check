# Architecture

A single static page, no backend, no build step. Vanilla ES modules load
directly in the browser; the same modules import cleanly into Node's test
runner. Served from a subpath, so every asset reference is relative.

## Modules (`site/`)

| File | Responsibility |
|---|---|
| `decision-tree.js` | Pure logic. `getVerdict(need, marking)` maps the need plus what's visible on the plug to one plain-language verdict. Exports the `NEEDS` and `MARKINGS` enums. No spec names ever appear in verdict copy — only physical markings. |
| `questions.js` | The three questions as data: each option pairs a display `label` with the machine `value` the tree understands. `STEP_IDS` fixes the order (`device → need → marking`). |
| `quiz.js` | `Quiz`, a DOM-free state machine: `answer()` advances, `reset()` restarts, `result()` resolves the verdict once complete. This is what makes restart reload-free. |
| `sound.js` | WebAudio-synthesized tick + verdict chime (zero audio files). Lazy `AudioContext`, guarded for environments without WebAudio; mute state persists in `localStorage`. |
| `diagram.js` | The hero: an inline-SVG USB-C plug. `createDiagram(el)` mounts it and returns `annotate()` / `clear()`; callouts stroke-draw to named plug anchors, honouring `prefers-reduced-motion`. |
| `app.js` | Wiring only. Renders each question as themed buttons, annotates the diagram as answers land, resolves to a verdict (chime + amber callout + live-region announcement), and handles restart and the mute toggle. |
| `index.html` | Shell: fonts, wordmark, mute toggle, skip link, live region, two-panel stage. |
| `styles.css` | The blueprint direction from `docs/DESIGN.md` — tokens, grid canvas, card, button states, responsive layout. |

## Data flow

```
index.html  →  app.boot()
                 ├─ createDiagram(#diagram)         → SVG plug mounted
                 ├─ new Quiz()                        → flow state
                 └─ renderQuestion()  ⇄ choose(option)
                        │  playTick(); diagram.annotate(...)
                        │  quiz.answer(value)
                        └─ quiz.done → renderVerdict()
                               getVerdict(need, marking)  (via quiz.result())
                               playChime(); amber callout; announce()
                        restart → quiz.reset(); diagram.clear()
```

`app.js`, `diagram.js`, and `sound.js` touch the DOM; `decision-tree.js`,
`questions.js`, and `quiz.js` are pure and carry the bulk of the test suite.

## Run & test

- **Preview:** `npm run dev` (serves `site/` statically), or open `site/index.html` directly.
- **Test:** `npm test` (Node's built-in runner; `app.integration.test.js` drives the real app in jsdom).
- **Lint:** `npm run lint`. **Both:** `npm run check`.

## Deploy

Static bundle is `site/`. All references are relative (no leading `/`), so it
drops in at `apps.charliekrug.com/cable-check/` unchanged.
