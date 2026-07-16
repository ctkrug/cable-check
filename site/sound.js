// Synthesized UI sound: a short tick when an option is chosen and a two-tone
// chime at the verdict. Everything is generated with WebAudio oscillators, so
// the repo carries zero audio files. Every entry point is guarded for
// environments without AudioContext (tests, older browsers) and the mute state
// persists in localStorage.

const STORE_KEY = "cablecheck:muted";

let ctx = null;
let muted = loadMuted();

function loadMuted() {
  try {
    return globalThis.localStorage?.getItem(STORE_KEY) === "1";
  } catch {
    // Private-mode / disabled storage: fall back to un-muted.
    return false;
  }
}

/** Whether sound is currently muted. */
export function isMuted() {
  return muted;
}

/** Set the mute state and persist it; returns the new value. */
export function setMuted(value) {
  muted = Boolean(value);
  try {
    globalThis.localStorage?.setItem(STORE_KEY, muted ? "1" : "0");
  } catch {
    // Persistence is best-effort; the in-memory value still holds this session.
    return muted;
  }
  return muted;
}

/** Flip the mute state and persist it; returns the new value. */
export function toggleMuted() {
  return setMuted(!muted);
}

// Lazily create the AudioContext on first real use, satisfying autoplay policy
// (it must follow a user gesture) and staying null where the API is absent.
function context() {
  const AudioCtx = globalThis.AudioContext || globalThis.webkitAudioContext;
  if (!AudioCtx) {
    return null;
  }
  if (!ctx) {
    ctx = new AudioCtx();
  }
  return ctx;
}

function tone({ freq, type, start, duration, peak }) {
  const ac = context();
  if (!ac) {
    return;
  }
  const t0 = ac.currentTime + start;
  const osc = ac.createOscillator();
  const gain = ac.createGain();
  osc.type = type;
  osc.frequency.setValueAtTime(freq, t0);
  // Quick attack, exponential release — a soft blip, never a click.
  gain.gain.setValueAtTime(0.0001, t0);
  gain.gain.exponentialRampToValueAtTime(peak, t0 + 0.01);
  gain.gain.exponentialRampToValueAtTime(0.0001, t0 + duration);
  osc.connect(gain).connect(ac.destination);
  osc.start(t0);
  osc.stop(t0 + duration + 0.02);
}

/** A short square-wave tick confirming an option tap. */
export function playTick() {
  if (muted) {
    return;
  }
  tone({ freq: 880, type: "square", start: 0, duration: 0.08, peak: 0.05 });
}

/** A two-tone sine chime marking the verdict. */
export function playChime() {
  if (muted) {
    return;
  }
  tone({ freq: 587.33, type: "sine", start: 0, duration: 0.18, peak: 0.06 });
  tone({ freq: 880, type: "sine", start: 0.12, duration: 0.24, peak: 0.06 });
}
