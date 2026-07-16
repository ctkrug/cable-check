// Node has no WebAudio, so the synthesis path in sound.js is exercised here
// against a hand-rolled AudioContext stub that records the graph each cue
// builds. This covers the oscillator/gain scheduling that the silent-safe
// tests in sound.test.js deliberately skip.

import { test } from "node:test";
import assert from "node:assert/strict";

class FakeParam {
  constructor() {
    this.events = [];
  }
  setValueAtTime(value, time) {
    this.events.push(["set", value, time]);
    return this;
  }
  exponentialRampToValueAtTime(value, time) {
    this.events.push(["ramp", value, time]);
    return this;
  }
}

class FakeOscillator {
  constructor() {
    this.frequency = new FakeParam();
    this.type = null;
    this.startedAt = null;
    this.stoppedAt = null;
  }
  connect(node) {
    return node;
  }
  start(t) {
    this.startedAt = t;
  }
  stop(t) {
    this.stoppedAt = t;
  }
}

class FakeGain {
  constructor() {
    this.gain = new FakeParam();
  }
  connect(node) {
    return node;
  }
}

const contexts = [];
class FakeAudioContext {
  constructor() {
    this.currentTime = 10;
    this.destination = {};
    this.oscillators = [];
    contexts.push(this);
  }
  createOscillator() {
    const osc = new FakeOscillator();
    this.oscillators.push(osc);
    return osc;
  }
  createGain() {
    return new FakeGain();
  }
}

globalThis.AudioContext = FakeAudioContext;
const { playTick, playChime, setMuted } = await import("../site/sound.js");

function newOscillatorsFrom(fn) {
  const before = contexts.reduce((n, c) => n + c.oscillators.length, 0);
  fn();
  const after = contexts.reduce((n, c) => n + c.oscillators.length, 0);
  const ctx = contexts[contexts.length - 1];
  return { count: after - before, ctx };
}

test("a tick builds one square-wave oscillator around 880Hz", () => {
  setMuted(false);
  const { count, ctx } = newOscillatorsFrom(() => playTick());
  assert.equal(count, 1, "exactly one oscillator");
  const osc = ctx.oscillators.at(-1);
  assert.equal(osc.type, "square");
  assert.deepEqual(osc.frequency.events[0], ["set", 880, ctx.currentTime]);
  assert.ok(osc.startedAt !== null && osc.stoppedAt !== null, "it is scheduled");
});
