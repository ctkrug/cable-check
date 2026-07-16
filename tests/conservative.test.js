// Story 1.3: a "not sure" marking answer steers to the conservative verdict
// and never reuses the confident "marking is present" copy.

import { test } from "node:test";
import assert from "node:assert/strict";
import { NEEDS, MARKINGS, getVerdict } from "../site/decision-tree.js";

test("the not-sure verdict differs from the marking-present verdict for every need", () => {
  for (const need of Object.values(NEEDS)) {
    const present = getVerdict(need, MARKINGS.PRESENT);
    const unsure = getVerdict(need, MARKINGS.UNSURE);
    assert.notEqual(
      unsure.headline,
      present.headline,
      `${need}: not-sure headline should differ from marking-present`
    );
  }
});

test("not sure steers fast-charging and fast-transfer to a conservative verdict", () => {
  for (const need of [NEEDS.CHARGE_FAST, NEEDS.TRANSFER_FAST]) {
    const unsure = getVerdict(need, MARKINGS.UNSURE);
    assert.equal(unsure.status, "conservative");
    assert.match(unsure.detail, /rated for|labeled|known/i);
  }
});

test("not sure never asserts the cable on hand already works", () => {
  for (const need of [NEEDS.CHARGE_FAST, NEEDS.VIDEO_4K, NEEDS.TRANSFER_FAST]) {
    const unsure = getVerdict(need, MARKINGS.UNSURE);
    assert.doesNotMatch(unsure.headline, /you're set|you have the right/i);
  }
});
