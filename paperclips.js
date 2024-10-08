// ==UserScript==
// @name         Paperclip Automatically
// @namespace    http://tampermonkey.net/
// @version      2024-10-04
// @description  try to take over the world!
// @author       You
// @match        https://www.decisionproblem.com/paperclips/index2.html
// @icon         https://www.google.com/s2/favicons?sz=64&domain=decisionproblem.com
// @grant        none
// ==/UserScript==

(function () {
  "use strict";

  let autoTournamentInterval = false;

  function clickMakePaperclip() {
    const makePaperclipButton = document.getElementById("btnMakePaperclip");
    if (makePaperclipButton && !makePaperclipButton.disabled) {
      makePaperclipButton.click();
    }
  }

  function clickQCompute() {
    const qChips = document.querySelectorAll(".qChip");
    const totalOpacity = Array.from(qChips).reduce((sum, chip) => {
      const opacity = parseFloat(chip.style.opacity) || 0;
      return sum + opacity;
    }, 0);

    if (totalOpacity > 0) {
      const qComputeButton = document.getElementById("btnQcompute");
      if (qComputeButton && !qComputeButton.disabled) {
        qComputeButton.click();
      }
    }
  }

  function newTournament() {
    const newTournamentButton = document.getElementById("btnNewTournament");
    if (newTournamentButton && !newTournamentButton.disabled) {
      newTournamentButton.click();
    }

    const runTournamentButton = document.getElementById("btnRunTournament");
    if (runTournamentButton && !runTournamentButton.disabled) {
      runTournamentButton.click();
    }
  }

  function launchProbe() {
    const makeProbeButton = document.getElementById("btnMakeProbe");
    if (makeProbeButton && !makeProbeButton.disabled) {
      makeProbeButton.click();
    }
  }

  setInterval(clickMakePaperclip, 50);

  setInterval(clickQCompute, 50);

  setInterval(launchProbe, 50);

  function toggleAutoTournament() {
    const autoTournamentButton = document.getElementById(
      "btnToggleAutoTournament"
    );
    if (autoTournamentButton) {
      if (autoTournamentButton.textContent === "Auto Tournament: OFF") {
        autoTournamentButton.textContent = "Auto Tournament: ON";
        autoTournamentInterval = setInterval(newTournament, 500);
      } else {
        autoTournamentButton.textContent = "Auto Tournament: OFF";
        clearInterval(autoTournamentInterval);
      }
    }
  }

  function initAutoTournament() {
    const autoTournamentButton = document.createElement("button");
    autoTournamentButton.id = "btnToggleAutoTournament";
    autoTournamentButton.className = "button2";
    autoTournamentButton.textContent = "Auto Tournament: OFF";
    autoTournamentButton.onclick = toggleAutoTournament;

    const manufacturingDiv = document.getElementById("manufacturingDiv");
    manufacturingDiv.appendChild(autoTournamentButton);
  }

  setTimeout(initAutoTournament, 5_000);
})();
