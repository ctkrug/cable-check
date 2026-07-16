import { QUESTIONS } from "./questions.js";
import { NEEDS } from "./decision-tree.js";
import { Quiz } from "./quiz.js";
import { createDiagram } from "./diagram.js";
import {
  isMuted,
  toggleMuted,
  playTick,
  playChime,
} from "./sound.js";

// Which part of the plug each need's annotation points at, and a short label
// for the verdict callout (kept to physical markings, never spec names).
const NEED_ANCHOR = {
  [NEEDS.CHARGE_FAST]: "shell",
  [NEEDS.CHARGE_STANDARD]: "shell",
  [NEEDS.VIDEO_4K]: "pins",
  [NEEDS.TRANSFER_FAST]: "pins",
};
const MARK_HINT = {
  [NEEDS.CHARGE_FAST]: "⚡ / 5A",
  [NEEDS.VIDEO_4K]: "DP",
  [NEEDS.TRANSFER_FAST]: "SS10",
  [NEEDS.CHARGE_STANDARD]: "any cable",
};

function boot() {
  const cardEl = document.getElementById("question-card");
  const diagramEl = document.getElementById("diagram");
  const statusEl = document.getElementById("live-status");
  const muteBtn = document.getElementById("mute-toggle");

  const diagram = createDiagram(diagramEl);
  const quiz = new Quiz();

  function announce(message) {
    statusEl.textContent = message;
  }

  function renderMuteButton() {
    const muted = isMuted();
    muteBtn.setAttribute("aria-pressed", String(muted));
    muteBtn.setAttribute(
      "aria-label",
      muted ? "Unmute sound" : "Mute sound"
    );
    muteBtn.textContent = muted ? "🔇" : "🔊";
  }

  muteBtn.addEventListener("click", () => {
    toggleMuted();
    renderMuteButton();
    if (!isMuted()) {
      playTick();
    }
  });

  function focusHeading() {
    const heading = cardEl.querySelector(".question-prompt");
    if (heading) {
      heading.focus();
    }
  }

  function renderQuestion() {
    const step = quiz.step;
    const question = QUESTIONS[step];
    cardEl.replaceChildren();

    const meta = document.createElement("p");
    meta.className = "step-meta";
    meta.textContent = `Question ${step + 1} of ${QUESTIONS.length}`;

    const prompt = document.createElement("h2");
    prompt.className = "question-prompt";
    prompt.tabIndex = -1;
    prompt.textContent = question.prompt;

    const list = document.createElement("div");
    list.className = "options";
    list.setAttribute("role", "group");
    list.setAttribute("aria-label", question.prompt);

    for (const option of question.options) {
      const button = document.createElement("button");
      button.type = "button";
      button.className = "option";
      button.textContent = option.label;
      button.addEventListener("click", () => choose(question, option));
      list.appendChild(button);
    }

    cardEl.append(meta, prompt, list);
    focusHeading();
  }

  function choose(question, option) {
    playTick();
    if (question.id === "device") {
      diagram.annotate({ anchor: "cable", label: option.label });
    } else if (question.id === "need") {
      diagram.annotate({
        anchor: NEED_ANCHOR[option.value] || "shell",
        label: option.label,
      });
    }
    quiz.answer(option.value);
    if (quiz.done) {
      renderVerdict();
    } else {
      renderQuestion();
    }
  }

  function renderVerdict() {
    const verdict = quiz.result();
    const need = quiz.answers.need;
    cardEl.replaceChildren();

    const eyebrow = document.createElement("p");
    eyebrow.className = "step-meta";
    eyebrow.textContent = "Your answer";

    const headline = document.createElement("h2");
    headline.className = `verdict-headline verdict-${verdict.status}`;
    headline.tabIndex = -1;
    headline.textContent = verdict.headline;

    const detail = document.createElement("p");
    detail.className = "verdict-detail";
    detail.textContent = verdict.detail;

    const restart = document.createElement("button");
    restart.type = "button";
    restart.className = "option restart";
    restart.textContent = "Check another cable";
    restart.addEventListener("click", restartQuiz);

    cardEl.append(eyebrow, headline, detail, restart);

    diagram.annotate({
      anchor: verdict.marking ? "overmold" : "shell",
      label: MARK_HINT[need] || "look here",
      tone: "amber",
      strong: true,
    });

    playChime();
    announce(`${verdict.headline}. ${verdict.detail}`);
    headline.focus();
  }

  function restartQuiz() {
    quiz.reset();
    diagram.clear();
    announce("");
    renderQuestion();
  }

  renderMuteButton();
  renderQuestion();
}

document.addEventListener("DOMContentLoaded", boot);
