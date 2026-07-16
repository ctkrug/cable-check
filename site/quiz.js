// The quiz flow as a small, DOM-free state machine: record an answer, advance,
// and once all three questions are answered, resolve the verdict. Keeping this
// separate from the rendering lets the flow (advance, restart, resolve) be unit
// tested without a browser.

import { STEP_IDS } from "./questions.js";
import { getVerdict } from "./decision-tree.js";

export class Quiz {
  constructor() {
    this.reset();
  }

  /** Return to question one and forget every prior answer. */
  reset() {
    this.step = 0;
    this.answers = {};
    return this;
  }

  /** The id of the question awaiting an answer, or null once complete. */
  get currentStep() {
    return this.done ? null : STEP_IDS[this.step];
  }

  /** True once all three questions have been answered. */
  get done() {
    return this.step >= STEP_IDS.length;
  }

  /**
   * Record the answer to the current question and advance.
   * @param {string} value - the option value for the current step
   */
  answer(value) {
    if (this.done) {
      throw new Error("quiz is already complete; reset before answering again");
    }
    this.answers[STEP_IDS[this.step]] = value;
    this.step += 1;
    return this;
  }

  /** The resolved verdict; throws if the flow is not yet complete. */
  result() {
    if (!this.done) {
      throw new Error("quiz is not complete; answer every question first");
    }
    return getVerdict(this.answers.need, this.answers.marking);
  }
}
