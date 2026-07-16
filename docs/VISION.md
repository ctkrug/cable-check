# Vision

## The problem

USB-C is one physical connector hiding a dozen incompatible standards: USB 2.0,
3.2 Gen 1/2, USB4, Thunderbolt 3/4/5, DisplayPort Alt Mode, and USB-PD power tiers
from 15W to 240W. Two cables can look identical and behave completely differently —
one charges a laptop at full speed and drives a 4K monitor, the other only trickle
charges a phone. The handful of markings that actually disambiguate this (a
lightning-bolt icon, "5A", "SS10", a tiny Thunderbolt logo) are printed in 4pt type
near the plug, if they're printed at all.

Every existing resource — Wikipedia's USB table, cable-brand spec sheets, "USB-C
explained" articles — responds to this mess by handing the reader the *entire*
mess: every standard, every generation, every wattage tier, all at once. That's
correct information delivered in the least useful shape. Nobody standing in front
of a drawer of cables wants to read a table; they want an answer.

## Who it's for

Anyone with a drawer, box, or tangle of USB-C cables and a specific task in front
of them right now: "will this charge my laptop fast," "can this cable drive my
monitor," "is this fast enough to copy my photos." Not hobbyists who already know
the spec names — people who just want to stop guessing.

## The core idea

Don't show the spec table. Ask three short questions, throw away every branch of
the tree that doesn't apply to this specific situation, and print the one
sentence that's left. The product's value is entirely in what it *withholds* —
the user never has to know what "USB4 Gen 3x2" means; they just learn to look for
a symbol on a cable.

The three questions, in order:

1. **What are you plugging in?** (phone / laptop / monitor / drive or other, no
   real bearing on the branch but frames the next question in familiar terms)
2. **What do you actually need right now?** (fast charging / driving a display /
   fast file transfer / just basic charging is fine)
3. **What, if anything, can you already see printed on the cable?** (a marking,
   an icon, nothing visible, not sure) — this narrows the generic verdict from
   step 2 into a specific "yes this one works" / "no, look for X instead."

Step 3 is what turns a generic answer ("look for a lightning bolt or 5A") into an
actually useful one ("you already have that cable — you're set" or "this one
isn't it, here's what is").

## Key design decisions

- **No spec names in the output.** Verdicts describe physical markings and
  icons — "lightning bolt," "5A," "DP," "SS10" — never "USB-PD 3.1 EPR" or
  "USB4 Gen 3x2." The reader should never need to know what the acronym means.
- **A tree, not a database.** No searching, no filtering UI, no list of cables
  to browse. Three fixed questions, a small number of fixed outcomes. Speed and
  certainty over completeness.
- **Conservative under uncertainty.** Every question has a "not sure" / "can't
  tell" option, and picking it always steers toward the safer, more
  conservative verdict (e.g., "buy/borrow a labeled cable" rather than a
  guess that might be wrong for a 240W charger).
- **Static and offline-capable.** No backend, no accounts, no analytics
  dependency for the core flow — it's a page that answers a question and gets
  out of the way. Deployable as a single static directory to
  `apps.charliekrug.com/cable-check`.
- **Restart is one tap.** Checking a second cable (a very likely real use case —
  "which of these three is the right one") must not require a page reload.

## What "v1 done" looks like

- The full three-question flow is implemented and reachable in under 10 seconds
  of interaction for every question path, including every "not sure" branch.
- Every terminal verdict names a concrete physical marking or icon, never a raw
  spec name, and is conservative when the input was uncertain.
- The page is restartable without a reload and works with keyboard, mouse, and
  touch.
- The visual design follows `docs/DESIGN.md` in full: themed controls, real
  type scale, a designed win/verdict state, no unstyled native elements.
- Ships as a static site with relative asset paths, deployable as-is to a
  subdomain path.
- CI is green on lint and the full decision-tree test suite, and the tree logic
  has test coverage for every question-path combination that produces a
  distinct verdict.
