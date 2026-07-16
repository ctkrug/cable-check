import { test } from "node:test";
import assert from "node:assert/strict";
import { QUESTIONS } from "../site/questions.js";

test("there are exactly three questions", () => {
  assert.equal(QUESTIONS.length, 3);
});

test("every question has a prompt and at least two options", () => {
  for (const question of QUESTIONS) {
    assert.ok(question.prompt.length > 0, `${question.id} needs a prompt`);
    assert.ok(
      question.options.length >= 2,
      `${question.id} needs at least two options`
    );
  }
});

test("the marking question includes a conservative not-sure option", () => {
  const marking = QUESTIONS.find((q) => q.id === "marking");
  assert.ok(marking.options.some((o) => /not sure/i.test(o)));
});
