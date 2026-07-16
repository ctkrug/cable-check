// The sound module must stay silent-safe where WebAudio and localStorage are
// absent (Node's test runner) and still track the mute state in memory.

import { test } from "node:test";
import assert from "node:assert/strict";
import {
  isMuted,
  setMuted,
  toggleMuted,
  playTick,
  playChime,
} from "../site/sound.js";

test("playing sounds never throws without an AudioContext", () => {
  setMuted(false);
  assert.doesNotThrow(() => playTick());
  assert.doesNotThrow(() => playChime());
});

test("mute state toggles and is readable", () => {
  setMuted(false);
  assert.equal(isMuted(), false);
  assert.equal(toggleMuted(), true);
  assert.equal(isMuted(), true);
  assert.equal(toggleMuted(), false);
  assert.equal(isMuted(), false);
});

test("setMuted coerces to a boolean", () => {
  assert.equal(setMuted(1), true);
  assert.equal(setMuted(0), false);
  assert.equal(setMuted(""), false);
});
