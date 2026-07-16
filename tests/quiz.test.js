import { test } from "node:test";
import assert from "node:assert/strict";
import { Quiz } from "../site/quiz.js";
import { NEEDS, MARKINGS } from "../site/decision-tree.js";
import { DEVICES } from "../site/questions.js";

function completed(device, need, marking) {
  return new Quiz().answer(device).answer(need).answer(marking);
}

test("a fresh quiz starts on the device question", () => {
  const quiz = new Quiz();
  assert.equal(quiz.currentStep, "device");
  assert.equal(quiz.done, false);
});

test("answering advances through device, need, then marking", () => {
  const quiz = new Quiz();
  quiz.answer(DEVICES.LAPTOP);
  assert.equal(quiz.currentStep, "need");
  quiz.answer(NEEDS.CHARGE_FAST);
  assert.equal(quiz.currentStep, "marking");
  quiz.answer(MARKINGS.PRESENT);
  assert.equal(quiz.currentStep, null);
  assert.equal(quiz.done, true);
});

test("a completed quiz resolves the verdict for its answers", () => {
  const quiz = completed(DEVICES.LAPTOP, NEEDS.CHARGE_FAST, MARKINGS.NONE);
  const verdict = quiz.result();
  assert.equal(verdict.status, "missing");
  assert.match(verdict.detail, /5A/);
});

test("resolving before completion throws instead of guessing", () => {
  const quiz = new Quiz().answer(DEVICES.PHONE);
  assert.throws(() => quiz.result(), /not complete/);
});

test("answering past completion throws instead of overflowing", () => {
  const quiz = completed(DEVICES.PHONE, NEEDS.CHARGE_STANDARD, MARKINGS.UNSURE);
  assert.throws(() => quiz.answer(MARKINGS.PRESENT), /already complete/);
});

test("reset returns to question one and clears prior answers", () => {
  const quiz = completed(DEVICES.PHONE, NEEDS.CHARGE_FAST, MARKINGS.PRESENT);
  quiz.reset();
  assert.equal(quiz.currentStep, "device");
  assert.equal(quiz.done, false);
  assert.deepEqual(quiz.answers, {});
  assert.throws(() => quiz.result(), /not complete/);
});

test("the device answer frames but never changes the verdict (story 3.3)", () => {
  const need = NEEDS.VIDEO_4K;
  const marking = MARKINGS.PRESENT;
  const reference = completed(DEVICES.PHONE, need, marking).result();
  for (const device of Object.values(DEVICES)) {
    const verdict = completed(device, need, marking).result();
    assert.deepEqual(
      verdict,
      reference,
      `device ${device} must not change the verdict`
    );
  }
});
