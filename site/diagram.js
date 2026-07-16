// The hero: a schematic line-drawing of a USB-C plug that stays on screen
// through the whole flow and gets annotated live as the user answers. Drawn as
// inline SVG (zero binary assets) so the cyan lines and the amber verdict
// callout are just styled elements.

const NS = "http://www.w3.org/2000/svg";

// viewBox coordinate space. Cable enters from the left, plug points right.
const VIEW = { w: 400, h: 300 };

// Named points on the plug the callouts can aim at.
const ANCHORS = Object.freeze({
  cable: { x: 70, y: 150 },
  overmold: { x: 165, y: 132 }, // where markings are usually printed
  shell: { x: 285, y: 128 }, // power path — the metal shell
  pins: { x: 285, y: 172 }, // data/video path — the tongue pins
});

// Fixed label parking spots, used in order as annotations accumulate so the
// callouts fan out instead of overlapping.
const LABEL_SLOTS = [
  { x: 200, y: 40 },
  { x: 40, y: 250 },
  { x: 300, y: 250 },
];

// The static plug, as SVG markup. Kept as an exported string so a smoke test
// can assert the schematic is present without a DOM.
export const PLUG_MARKUP = `
  <g class="plug" fill="none" stroke="var(--accent)" stroke-width="2">
    <path class="plug-cable" d="M8 150 H120" stroke-width="14"
      stroke-linecap="round" opacity="0.55" />
    <rect class="plug-overmold" x="118" y="120" width="70" height="60" rx="6" />
    <rect class="plug-shell" x="196" y="123" width="150" height="54" rx="27" />
    <rect class="plug-tongue" x="214" y="140" width="116" height="20" rx="10"
      opacity="0.8" />
    <g class="plug-pins" stroke-width="1.5" opacity="0.7">
      <path d="M228 145 V155" /><path d="M244 145 V155" />
      <path d="M260 145 V155" /><path d="M276 145 V155" />
      <path d="M292 145 V155" /><path d="M308 145 V155" />
    </g>
  </g>
`;

function prefersReducedMotion() {
  try {
    return globalThis.matchMedia?.("(prefers-reduced-motion: reduce)").matches === true;
  } catch {
    return false;
  }
}

function el(name, attrs = {}) {
  const node = document.createElementNS(NS, name);
  for (const [key, value] of Object.entries(attrs)) {
    node.setAttribute(key, String(value));
  }
  return node;
}

/**
 * Mount the plug diagram into `container` and return a small controller.
 * @param {Element} container
 */
export function createDiagram(container) {
  const svg = el("svg", {
    viewBox: `0 0 ${VIEW.w} ${VIEW.h}`,
    class: "plug-diagram",
    role: "img",
    "aria-label": "Schematic drawing of a USB-C plug",
    preserveAspectRatio: "xMidYMid meet",
  });
  svg.innerHTML = PLUG_MARKUP;
  const overlay = el("g", { class: "plug-overlay" });
  svg.appendChild(overlay);
  container.replaceChildren(svg);

  let count = 0;

  function clear() {
    overlay.replaceChildren();
    count = 0;
  }

  /**
   * Draw a callout line + label pointing at a plug anchor.
   * @param {{anchor: string, label: string, tone?: "accent"|"amber", strong?: boolean}} opts
   */
  function annotate({ anchor, label, tone = "accent", strong = false }) {
    const target = ANCHORS[anchor] || ANCHORS.overmold;
    const slot = LABEL_SLOTS[count % LABEL_SLOTS.length];
    count += 1;

    const stroke = tone === "amber" ? "var(--accent-support)" : "var(--accent)";
    const group = el("g", {
      class: `callout${strong ? " callout-strong" : ""}`,
    });

    const line = el("line", {
      x1: slot.x,
      y1: slot.y,
      x2: target.x,
      y2: target.y,
      stroke,
      "stroke-width": strong ? 2.5 : 1.5,
      "stroke-linecap": "round",
    });
    const dot = el("circle", {
      cx: target.x,
      cy: target.y,
      r: strong ? 5 : 3.5,
      fill: stroke,
    });
    const text = el("text", {
      x: slot.x,
      y: slot.y - 8,
      fill: stroke,
      "text-anchor": "middle",
      class: "callout-label",
    });
    text.textContent = label;

    group.append(line, dot, text);
    overlay.appendChild(group);

    // Stroke-draw the line in unless reduced motion is requested.
    const length = Math.hypot(slot.x - target.x, slot.y - target.y);
    if (prefersReducedMotion()) {
      line.style.strokeDasharray = "none";
    } else {
      line.style.strokeDasharray = String(length);
      line.style.strokeDashoffset = String(length);
      // Force layout so the transition runs from the offset start.
      void line.getBoundingClientRect();
      line.style.transition = "stroke-dashoffset 200ms ease-out";
      line.style.strokeDashoffset = "0";
    }
    return group;
  }

  return { annotate, clear };
}
