// Copy and options for the three-question flow described in docs/VISION.md.
// Each option pairs the display label with the machine value the decision
// tree understands, so the UI and the logic never drift apart.

import { NEEDS, MARKINGS } from "./decision-tree.js";

// The device answer is framing only — it never changes the verdict — so its
// values are plain identifiers with no bearing on the tree.
export const DEVICES = Object.freeze({
  PHONE: "phone",
  LAPTOP: "laptop",
  MONITOR: "monitor",
  OTHER: "other",
});

// Question order, by id. The flow advances through these in sequence.
export const STEP_IDS = Object.freeze(["device", "need", "marking"]);

export const QUESTIONS = Object.freeze([
  Object.freeze({
    id: "device",
    prompt: "What are you plugging in?",
    options: Object.freeze([
      Object.freeze({ label: "Phone", value: DEVICES.PHONE }),
      Object.freeze({ label: "Laptop", value: DEVICES.LAPTOP }),
      Object.freeze({ label: "Monitor", value: DEVICES.MONITOR }),
      Object.freeze({ label: "Drive or other", value: DEVICES.OTHER }),
    ]),
  }),
  Object.freeze({
    id: "need",
    prompt: "What do you need right now?",
    options: Object.freeze([
      Object.freeze({ label: "Fast charging", value: NEEDS.CHARGE_FAST }),
      Object.freeze({ label: "Driving a display", value: NEEDS.VIDEO_4K }),
      Object.freeze({ label: "Fast file transfer", value: NEEDS.TRANSFER_FAST }),
      Object.freeze({ label: "Just basic charging", value: NEEDS.CHARGE_STANDARD }),
    ]),
  }),
  Object.freeze({
    id: "marking",
    prompt: "What's printed on the cable near the plug?",
    options: Object.freeze([
      Object.freeze({ label: "A marking or icon", value: MARKINGS.PRESENT }),
      Object.freeze({ label: "Nothing visible", value: MARKINGS.NONE }),
      Object.freeze({ label: "Not sure / can't tell", value: MARKINGS.UNSURE }),
    ]),
  }),
]);
