---
title: "I built a three-tap quiz to answer 'which USB-C cable do I need?'"
published: false
tags: javascript, webdev, showdev, css
---

I have a drawer full of USB-C cables and no idea what any of them do. One
charges my laptop at full speed, one only trickle-charges a phone, one drives a
4K monitor, and they all look exactly the same. Every time I need the right one,
I end up plugging in three cables until something works.

Cable Check is my fix for that. It asks three questions (what are you plugging
in, what do you need, what is printed on the cable) and gives back one thing: the
exact marking to look for on the plug. No spec chart, no wattage tables, no
Thunderbolt-versus-USB4 rabbit hole. You can try it here:
[apps.charliekrug.com/cable-check](https://apps.charliekrug.com/cable-check/), and
the source is on [GitHub](https://github.com/ctkrug/cable-check).

Two decisions were more interesting to build than I expected.

## The diagram annotates itself as you answer

The hero of the page is a schematic drawing of a USB-C plug. I did not want it to
sit there as static decoration, so it draws a fresh callout each time you answer.
Pick "fast charging" and a line sweeps out to the metal shell; land on the
verdict and an amber label points at the overmold where the marking is printed.

It is plain inline SVG, no library. Each callout is a `<line>`, a `<circle>`, and
a `<text>` appended to an overlay group. The sweep-in is one trick: set
`stroke-dasharray` and `stroke-dashoffset` to the line's own length so it starts
invisible, force a layout read, then transition the offset to zero.

```js
const length = Math.hypot(slot.x - target.x, slot.y - target.y);
line.style.strokeDasharray = String(length);
line.style.strokeDashoffset = String(length);
void line.getBoundingClientRect(); // force layout so the transition runs
line.style.transition = "stroke-dashoffset 200ms ease-out";
line.style.strokeDashoffset = "0";
```

When `prefers-reduced-motion` is set, it skips the animation and just shows the
line. Zero binary assets, and the whole diagram is a styled DOM node.

## Sound with no audio files

Tapping an option plays a short tick, and the verdict plays a two-tone chime.
Both are synthesized with WebAudio oscillators, so the repo ships no `.mp3` or
`.wav` at all. A tick is an 880Hz square wave with a quick attack and an
exponential release. The chime is two sine tones a beat apart.

The fiddly part is everywhere the API might not exist. The AudioContext is
created lazily on the first real gesture (autoplay policy), every entry point
returns quietly if there is no context, and the mute state persists in
localStorage behind a try/catch so private-mode browsers do not throw. That
guarding is what let me unit-test the sound module with a stub context and hit
full coverage without a browser.

## What I would do differently

The verdict copy lives in a small frozen data structure keyed by need and
marking, and the UI reads it. That kept the logic testable (every
need-by-marking combination is a unit test, plus an adversarial sweep for null,
Symbol, and emoji inputs). If I grew the tree past three questions, though, I
would want a real state machine rather than a step index. For three questions it
would have been over-engineering.

The stack is vanilla JS, HTML, and CSS with no build step. Tests run on the
Node built-in test runner with jsdom for the DOM paths, and the suite sits at
100% line coverage. It has been a good reminder that you can ship something
genuinely useful without reaching for a framework.

If you have a cable drawer like mine, give it a try and tell me what verdict
felt wrong. The decision tree is the part I most want to sharpen.
