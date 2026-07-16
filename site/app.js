import { NEEDS, getVerdict } from "./decision-tree.js";

// Scaffold-stage wiring: proves the module loads and the decision tree
// resolves to a verdict. The full three-tap quiz flow lands in BUILD,
// following docs/DESIGN.md for the actual UI.
function renderScaffold() {
  const root = document.getElementById("app");
  const verdict = getVerdict(NEEDS.CHARGE_FAST);

  root.innerHTML = `
    <h1>Cable Check</h1>
    <p>Scaffold running. Sample verdict for "fast charging":</p>
    <p><strong>${verdict.headline}</strong></p>
    <p>${verdict.detail}</p>
  `;
}

document.addEventListener("DOMContentLoaded", renderScaffold);
