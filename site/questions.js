// Copy and options for the three-question flow described in docs/VISION.md.
// Kept as plain data so BUILD can render it without duplicating question
// text between the UI and the tests.

export const QUESTIONS = Object.freeze([
  Object.freeze({
    id: "device",
    prompt: "What are you plugging in?",
    options: Object.freeze(["Phone", "Laptop", "Monitor", "Drive or other"]),
  }),
  Object.freeze({
    id: "need",
    prompt: "What do you need right now?",
    options: Object.freeze([
      "Fast charging",
      "Driving a display",
      "Fast file transfer",
      "Just basic charging",
    ]),
  }),
  Object.freeze({
    id: "marking",
    prompt: "What's printed on the cable near the plug?",
    options: Object.freeze([
      "A marking or icon",
      "Nothing visible",
      "Not sure / can't tell",
    ]),
  }),
]);
