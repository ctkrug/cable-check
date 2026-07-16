// Private-browsing modes and locked-down storage make localStorage throw on
// access. The mute state must degrade to an in-memory value instead of taking
// the whole module down. This file installs a hostile storage before importing
// sound.js so the guarded read at load time is exercised too.

import { test } from "node:test";
import assert from "node:assert/strict";

globalThis.localStorage = {
  getItem() {
    throw new Error("storage is blocked");
  },
  setItem() {
    throw new Error("storage is blocked");
  },
};

// Imported AFTER the throwing storage is in place, so the load-time read runs
// through its catch and defaults to un-muted rather than crashing the module.
const { isMuted, setMuted, toggleMuted } = await import("../site/sound.js");

test("a throwing storage read defaults the mute state to off at load", () => {
  assert.equal(isMuted(), false);
});

test("a throwing storage write never breaks the in-memory mute state", () => {
  assert.doesNotThrow(() => setMuted(true));
  assert.equal(isMuted(), true, "the session value still holds");
  assert.equal(toggleMuted(), false, "toggling still works without storage");
  assert.equal(isMuted(), false);
});
