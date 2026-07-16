// Story 1.2: every (need × marking-answer) combination resolves to an
// explicit, well-formed verdict — none falls through to an undefined or
// default outcome. Each combination is exercised by name below.

import { test } from "node:test";
import assert from "node:assert/strict";
import { NEEDS, MARKINGS, getVerdict } from "../site/decision-tree.js";

const NEED_NAMES = {
  [NEEDS.CHARGE_STANDARD]: "standard charging",
  [NEEDS.CHARGE_FAST]: "fast charging",
  [NEEDS.VIDEO_4K]: "driving a display",
  [NEEDS.TRANSFER_FAST]: "fast file transfer",
};

const MARKING_NAMES = {
  [MARKINGS.PRESENT]: "a marking is visible",
  [MARKINGS.NONE]: "nothing is visible",
  [MARKINGS.UNSURE]: "not sure",
};

const VALID_STATUSES = new Set(["any", "check", "missing", "conservative"]);

for (const need of Object.values(NEEDS)) {
  for (const marking of Object.values(MARKINGS)) {
    test(`${NEED_NAMES[need]} × ${MARKING_NAMES[marking]} yields a verdict`, () => {
      const verdict = getVerdict(need, marking);
      assert.ok(verdict, "a verdict object is returned");
      assert.ok(verdict.headline.length > 0, "headline is non-empty");
      assert.ok(verdict.detail.length > 0, "detail is non-empty");
      assert.ok(
        VALID_STATUSES.has(verdict.status),
        `status ${verdict.status} is one of the known states`
      );
    });
  }
}

test("verdict copy never leaks a raw spec name", () => {
  const banned = /USB4|USB-PD|PD 3\.1|Gen \d|Alt Mode|Thunderbolt \d/;
  for (const need of Object.values(NEEDS)) {
    for (const marking of Object.values(MARKINGS)) {
      const { headline, detail } = getVerdict(need, marking);
      assert.doesNotMatch(headline, banned, `${need}/${marking} headline`);
      assert.doesNotMatch(detail, banned, `${need}/${marking} detail`);
    }
  }
});
