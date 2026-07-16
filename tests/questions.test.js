import { test } from "node:test";
import assert from "node:assert/strict";
import { QUESTIONS, STEP_IDS } from "../site/questions.js";
import { NEEDS, MARKINGS } from "../site/decision-tree.js";

test("there are exactly three questions", () => {
  assert.equal(QUESTIONS.length, 3);
});

test("the questions appear in the STEP_IDS order", () => {
  assert.deepEqual(
    QUESTIONS.map((q) => q.id),
    [...STEP_IDS]
  );
});

test("every question has a prompt and at least two labelled options", () => {
  for (const question of QUESTIONS) {
    assert.ok(question.prompt.length > 0, `${question.id} needs a prompt`);
    assert.ok(
      question.options.length >= 2,
      `${question.id} needs at least two options`
    );
    for (const option of question.options) {
      assert.ok(option.label.length > 0, `${question.id} option needs a label`);
      assert.ok(
        option.value !== undefined && option.value !== "",
        `${question.id} option needs a value`
      );
    }
  }
});

test("the marking question includes a conservative not-sure option", () => {
  const marking = QUESTIONS.find((q) => q.id === "marking");
  const notSure = marking.options.find((o) => /not sure/i.test(o.label));
  assert.ok(notSure, "a not-sure option exists");
  assert.equal(notSure.value, MARKINGS.UNSURE);
});

test("no question repeats an option label or value", () => {
  for (const question of QUESTIONS) {
    const labels = question.options.map((o) => o.label);
    const values = question.options.map((o) => o.value);
    assert.equal(new Set(labels).size, labels.length, `${question.id} labels unique`);
    assert.equal(new Set(values).size, values.length, `${question.id} values unique`);
  }
});

test("need options map onto the decision tree's needs", () => {
  const need = QUESTIONS.find((q) => q.id === "need");
  const values = need.options.map((o) => o.value);
  for (const expected of Object.values(NEEDS)) {
    assert.ok(values.includes(expected), `need option for ${expected} exists`);
  }
});
