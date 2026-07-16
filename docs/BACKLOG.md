# Backlog

Epics and stories for the build. All start unchecked. Every story lists the
concrete, verifiable acceptance criteria a later BUILD/QA run must confirm —
not vibes.

## Epic 1 — Core quiz flow (the wow moment)

The three-tap flow from question to plain-language verdict. This epic ships
before anything else — it *is* the product.

- [ ] **1.1 Three-question flow renders and resolves to a verdict**
  - Answering all three questions (device → need → marking) in any valid
    combination renders a verdict screen; no combination dead-ends.
  - The full flow completes in a few taps with no intermediate loading or
    navigation — verified by manual walkthrough noted in QA memory.
  - Verdict text always names a physical marking or icon (lightning bolt,
    5A, DP, SS10/SS20, Thunderbolt icon) — never a raw spec name like
    "USB4" or "PD 3.1".

- [ ] **1.2 Decision tree covers every question-path combination**
  - Every combination of (need × marking-answer) has an explicit test case
    in `tests/decision-tree.test.js`; none falls through to an
    undefined/default verdict.
  - `npm test` passes with every combination exercised by name.

- [ ] **1.3 "Not sure" answers steer to the conservative verdict**
  - Choosing "not sure" at the marking-check step for a fast-charging or
    fast-transfer need returns a verdict recommending a known-good/labeled
    cable rather than asserting the cable on hand works.
  - A unit test asserts the "not sure" verdict text differs from the
    "marking present" verdict text for every need.

- [ ] **1.4 Restart without reload**
  - A visible "Check another cable" control resets to question 1 without a
    full page navigation (no `location.reload`/href change).
  - Restarting clears prior answer state so a stale verdict cannot appear
    before question 1 is answered again.

## Epic 2 — Blueprint visual design & juice

Implements `docs/DESIGN.md` in full: the live-annotating plug diagram,
tokens, motion, and sound.

- [ ] **2.1 Live-annotating plug diagram**
  - An SVG plug diagram is present in both desktop and phone layouts, and
    its annotation line animates in (stroke-draw or equivalent) each time a
    question is answered.
  - With `prefers-reduced-motion` enabled, the diagram updates instantly
    with no stroke-draw animation (manual toggle check, noted in QA
    memory).

- [ ] **2.2 Full design-token application**
  - Colors, type pairing (Space Mono + Inter), spacing unit, corner radius,
    and motion durations match `docs/DESIGN.md` tokens (spot-checked
    against computed styles).
  - No unstyled native buttons/selects remain; every control has themed
    hover, focus-visible, and active states (verified via keyboard
    tab-through).

- [ ] **2.3 Synth SFX + mute toggle**
  - Selecting an option and reaching a verdict each trigger a distinct
    WebAudio-synthesized sound; no audio files exist in the repo.
  - A mute toggle is keyboard-operable, has an `aria-label`, and its state
    persists across reload via `localStorage`.
  - `AudioContext` creation is guarded so environments without
    `window.AudioContext` (tests) do not throw.

- [ ] **2.4 Responsive composition at 390 / 768 / 1440**
  - At 390px width there is no horizontal scroll and every option button
    is ≥44px in the tap dimension.
  - At 1440px the two-column layout is used with the diagram at roughly
    55% width per `docs/DESIGN.md`.

## Epic 3 — Robustness, accessibility, and edge cases

- [ ] **3.1 Full keyboard and screen-reader operability**
  - Every question is answerable via Tab + Enter/Space alone, no mouse
    required.
  - The verdict is announced through an ARIA live region so screen readers
    surface it without extra interaction.

- [ ] **3.2 Favicon and brand wordmark**
  - A favicon (inline SVG data URI, cyan-on-navy monogram) is linked in
    `site/index.html` and is not the default browser globe.
  - The "Cable Check" wordmark uses the Space Mono display font with
    deliberate letter-spacing, not the default heading style.

- [ ] **3.3 Device-type question frames but never changes the verdict**
  - Selecting different "what are you plugging in" answers with the same
    need + marking answer yields identical verdict text (device choice is
    framing only, per `docs/VISION.md`), confirmed by a unit test.

## Epic 4 — Ship readiness

- [ ] **4.1 Static build deploys as a relative-path bundle**
  - All asset references in `site/index.html` use relative paths (no
    leading `/`), verified by grep.
  - Opening `site/index.html` via `file://` or a subpath-mounted static
    server runs the full flow with no console errors.

- [ ] **4.2 CI stays green through the full build**
  - `npm run lint` and `npm test` both pass in CI on every push to `main`
    once this epic's stories land.

- [ ] **4.3 Design polish pass**
  - A dedicated QA pass checks the running page against every item in the
    Design standard's D3 self-review checklist and logs findings/fixes in
    the STATUS `memory` field.
  - No anti-generic-ban item (D2) is present on the shipped page.
