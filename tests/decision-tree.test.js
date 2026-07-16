import { test } from "node:test";
import assert from "node:assert/strict";
import { NEEDS, MARKINGS, getVerdict } from "../site/decision-tree.js";

test("standard charging needs no special cable", () => {
  const verdict = getVerdict(NEEDS.CHARGE_STANDARD, MARKINGS.PRESENT);
  assert.match(verdict.headline, /any usb-c cable/i);
  assert.equal(verdict.marking, null);
});

test("fast charging points to the lightning-bolt / 5A marking", () => {
  const verdict = getVerdict(NEEDS.CHARGE_FAST, MARKINGS.NONE);
  assert.match(verdict.detail, /5A/);
});

test("4K video points to the DisplayPort marking", () => {
  const verdict = getVerdict(NEEDS.VIDEO_4K, MARKINGS.NONE);
  assert.match(verdict.detail, /DP/);
});

test("fast transfer points to the SS10/SS20/Thunderbolt marking", () => {
  const verdict = getVerdict(NEEDS.TRANSFER_FAST, MARKINGS.NONE);
  assert.match(verdict.detail, /SS/);
});

test("an unknown need throws instead of returning a bad verdict", () => {
  assert.throws(() => getVerdict("not_a_real_need", MARKINGS.PRESENT));
});

test("an unknown marking answer throws instead of falling through", () => {
  assert.throws(() => getVerdict(NEEDS.CHARGE_FAST, "not_a_real_marking"));
  assert.throws(() => getVerdict(NEEDS.CHARGE_STANDARD, "not_a_real_marking"));
});

test("marking defaults to the conservative unsure branch when omitted", () => {
  assert.deepEqual(
    getVerdict(NEEDS.CHARGE_FAST),
    getVerdict(NEEDS.CHARGE_FAST, MARKINGS.UNSURE)
  );
});
