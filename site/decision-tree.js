// Core quiz logic: the need plus what you can see printed on the cable go in,
// one plain-language verdict comes out. Kept dependency-free and
// framework-free so it can be unit tested with Node's built-in test runner
// and imported as-is by the browser.

// What the user actually wants the cable to do right now.
export const NEEDS = Object.freeze({
  CHARGE_STANDARD: "charge_standard",
  CHARGE_FAST: "charge_fast",
  VIDEO_4K: "video_4k",
  TRANSFER_FAST: "transfer_fast",
});

// What, if anything, the user can already see printed near the plug.
export const MARKINGS = Object.freeze({
  PRESENT: "present",
  NONE: "none",
  UNSURE: "unsure",
});

// Per-need facts the verdict copy is generated from. `marking` is the physical
// thing to look for (never a spec name); `task` describes the job in plain
// words; `plug` names the part of the plug diagram the annotation points at.
const NEED_SPEC = Object.freeze({
  [NEEDS.CHARGE_FAST]: {
    marking: 'a lightning-bolt icon or a "5A" marking',
    task: "fast charging (100W and up)",
    fallback: "usually caps out around 60W",
    plug: "shell",
  },
  [NEEDS.VIDEO_4K]: {
    marking: 'a "DP" label or a small monitor icon',
    task: "driving a display",
    fallback: "usually carries no video signal at all",
    plug: "pins",
  },
  [NEEDS.TRANSFER_FAST]: {
    marking: '"SS10", "SS20", or a Thunderbolt (lightning-bolt-in-a-square) icon',
    task: "fast file transfer",
    fallback: "is usually limited to slow USB 2.0 speeds",
    plug: "pins",
  },
});

// Standard charging is the one need where markings are irrelevant — any cable
// works — so its three answers are reassuring variations rather than a
// look-for-X / conservative split.
const STANDARD_VERDICTS = Object.freeze({
  [MARKINGS.PRESENT]: {
    status: "any",
    marking: null,
    headline: "Any USB-C cable will do",
    detail:
      "For basic charging the marking doesn't matter — whatever you're " +
      "holding will do the job. You're set.",
  },
  [MARKINGS.NONE]: {
    status: "any",
    marking: null,
    headline: "No marking needed",
    detail:
      "Even a plain, completely unlabeled USB-C cable will basic-charge " +
      "your device. Grab any one of them.",
  },
  [MARKINGS.UNSURE]: {
    status: "any",
    marking: null,
    headline: "Don't worry about the markings",
    detail:
      "Basic charging works over essentially any USB-C cable, so there's " +
      "nothing you need to check here.",
  },
});

function markingVerdicts(spec) {
  return {
    [MARKINGS.PRESENT]: {
      status: "check",
      marking: spec.marking,
      headline: `Check that it shows ${spec.marking}`,
      detail:
        `You've got a marked cable — make sure the marking is specifically ` +
        `${spec.marking}. If it is, you're set for ${spec.task}. If it's ` +
        `something else, that cable ${spec.fallback}.`,
    },
    [MARKINGS.NONE]: {
      status: "missing",
      marking: spec.marking,
      headline: `You'll want a cable showing ${spec.marking}`,
      detail:
        `An unmarked cable ${spec.fallback}, so it probably can't handle ` +
        `${spec.task}. Look through your drawer for one printed with ` +
        `${spec.marking}.`,
    },
    [MARKINGS.UNSURE]: {
      status: "conservative",
      marking: spec.marking,
      headline: "Play it safe — grab a labeled cable",
      detail:
        `When you can't confirm ${spec.marking}, use a cable you know is ` +
        `rated for ${spec.task} rather than risk it — a mismatch ` +
        `${spec.fallback}.`,
    },
  };
}

/**
 * Resolve a verdict from the user's need and what they can see on the cable.
 *
 * @param {string} need - one of NEEDS
 * @param {string} [marking=MARKINGS.UNSURE] - one of MARKINGS
 * @returns {{status: string, marking: (string|null), headline: string, detail: string}}
 */
export function getVerdict(need, marking = MARKINGS.UNSURE) {
  if (need === NEEDS.CHARGE_STANDARD) {
    const verdict = STANDARD_VERDICTS[marking];
    if (!verdict) {
      throw new Error(`Unknown marking answer: ${marking}`);
    }
    return verdict;
  }

  const spec = NEED_SPEC[need];
  if (!spec) {
    throw new Error(`Unknown need: ${need}`);
  }
  const verdict = markingVerdicts(spec)[marking];
  if (!verdict) {
    throw new Error(`Unknown marking answer: ${marking}`);
  }
  return verdict;
}
