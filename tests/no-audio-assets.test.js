// Story 2.3 acceptance: sound is fully synthesized, so no audio files may ever
// creep into the shipped bundle.

import { test } from "node:test";
import assert from "node:assert/strict";
import { readdirSync } from "node:fs";

const AUDIO = /\.(mp3|wav|ogg|m4a|aac|flac|webm)$/i;

function walk(dir) {
  const out = [];
  for (const entry of readdirSync(dir, { withFileTypes: true })) {
    if (entry.name === "node_modules" || entry.name.startsWith(".")) continue;
    const path = `${dir}/${entry.name}`;
    if (entry.isDirectory()) {
      out.push(...walk(path));
    } else {
      out.push(path);
    }
  }
  return out;
}

test("the repository ships no audio files", () => {
  const root = new URL("..", import.meta.url).pathname;
  const audioFiles = walk(root).filter((f) => AUDIO.test(f));
  assert.deepEqual(audioFiles, [], "sound must stay fully synthesized");
});
