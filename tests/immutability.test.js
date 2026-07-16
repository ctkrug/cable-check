// The exported enums and question data are the single source of truth shared by
// the UI and the logic; freezing them means a stray mutation can't silently
// desync the two. These assert the freeze actually holds.

import { test } from "node:test";
import assert from "node:assert/strict";
import { NEEDS, MARKINGS } from "../site/decision-tree.js";
import { QUESTIONS, STEP_IDS, DEVICES } from "../site/questions.js";

test("the NEEDS and MARKINGS enums are frozen against mutation", () => {
  for (const enumObj of [NEEDS, MARKINGS, DEVICES]) {
    assert.ok(Object.isFrozen(enumObj));
    assert.throws(() => {
      enumObj.INJECTED = "x";
    }, TypeError);
  }
});

test("STEP_IDS cannot be reordered or extended", () => {
  assert.ok(Object.isFrozen(STEP_IDS));
  assert.throws(() => STEP_IDS.push("surprise"), TypeError);
  assert.deepEqual([...STEP_IDS], ["device", "need", "marking"]);
});

test("QUESTIONS and their options are frozen all the way down", () => {
  assert.ok(Object.isFrozen(QUESTIONS));
  for (const question of QUESTIONS) {
    assert.ok(Object.isFrozen(question), `${question.id} is frozen`);
    assert.ok(Object.isFrozen(question.options), `${question.id} options frozen`);
    for (const option of question.options) {
      assert.ok(Object.isFrozen(option), `an option of ${question.id} is frozen`);
      assert.throws(() => {
        option.value = "tampered";
      }, TypeError);
    }
  }
});
