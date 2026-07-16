// Property-style invariants that must hold across the whole verdict space,
// independent of any single example.

import { test } from "node:test";
import assert from "node:assert/strict";
import { NEEDS, MARKINGS, getVerdict } from "../site/decision-tree.js";

const NEEDS_LIST = Object.values(NEEDS);
const MARKINGS_LIST = Object.values(MARKINGS);

test("only standard charging omits a marking to look for", () => {
  for (const need of NEEDS_LIST) {
    for (const marking of MARKINGS_LIST) {
      const { status } = getVerdict(need, marking);
      const hasMarking = getVerdict(need, marking).marking !== null;
      if (need === NEEDS.CHARGE_STANDARD) {
        assert.equal(hasMarking, false, `${need} should not name a marking`);
        assert.equal(status, "any");
      } else {
        assert.equal(hasMarking, true, `${need} must name a marking`);
        assert.notEqual(status, "any");
      }
    }
  }
});

test("the marking answer alone selects the status for a given need", () => {
  const expected = {
    [MARKINGS.PRESENT]: "check",
    [MARKINGS.NONE]: "missing",
    [MARKINGS.UNSURE]: "conservative",
  };
  for (const need of NEEDS_LIST) {
    if (need === NEEDS.CHARGE_STANDARD) continue;
    for (const marking of MARKINGS_LIST) {
      assert.equal(getVerdict(need, marking).status, expected[marking]);
    }
  }
});

test("every verdict names a physical marking when it names one at all", () => {
  const physical = /lightning|5A|DP|monitor|SS10|SS20|Thunderbolt|icon|marking/i;
  for (const need of NEEDS_LIST) {
    for (const marking of MARKINGS_LIST) {
      const verdict = getVerdict(need, marking);
      if (verdict.marking !== null) {
        assert.match(verdict.marking, physical, `${need}/${marking} marking`);
      }
    }
  }
});
