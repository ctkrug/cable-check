// Core quiz logic: three answers in, one plain-language verdict out.
// Kept dependency-free and framework-free so it can be unit tested with
// Node's built-in test runner and imported as-is by the browser.

export const NEEDS = Object.freeze({
  CHARGE_STANDARD: "charge_standard",
  CHARGE_FAST: "charge_fast",
  VIDEO_4K: "video_4k",
  TRANSFER_FAST: "transfer_fast",
});

const VERDICTS = Object.freeze({
  [NEEDS.CHARGE_STANDARD]: {
    headline: "Any USB-C cable will do",
    detail:
      "Standard charging (up to 60W) works over almost every USB-C cable, " +
      "even the plain one that came in the box.",
  },
  [NEEDS.CHARGE_FAST]: {
    headline: "Look for a lightning-bolt icon or “5A” marking",
    detail:
      "Cables rated for 100W+ charging print a lightning bolt or “5A” " +
      "near the plug. No marking usually means it caps out around 60W.",
  },
  [NEEDS.VIDEO_4K]: {
    headline: "Look for a “DP” or display icon near the plug",
    detail:
      "Cables that carry a video signal (DisplayPort Alt Mode) are marked " +
      "with a small monitor icon or “DP” — plain charging cables usually " +
      "carry no video signal at all.",
  },
  [NEEDS.TRANSFER_FAST]: {
    headline: "Look for “SS” with a 10 or 20, or a Thunderbolt icon",
    detail:
      "Fast data cables are marked “SS10”, “SS20”, or a lightning-bolt-in-a-" +
      "square (Thunderbolt) symbol. An unmarked cable is usually limited to " +
      "USB 2.0 speeds regardless of what the connector looks like.",
  },
});

/**
 * @param {string} need - one of NEEDS
 * @returns {{headline: string, detail: string}}
 */
export function getVerdict(need) {
  const verdict = VERDICTS[need];
  if (!verdict) {
    throw new Error(`Unknown need: ${need}`);
  }
  return verdict;
}
