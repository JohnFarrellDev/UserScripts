// ==UserScript==
// @name         Udemy - Copy from Section Quiz
// @namespace    http://tampermonkey.net/
// @version      1.1
// @description  Easily copy questions and answers from Udemy section quizzes
// @author       John Farrell (https://www.johnfarrell.dev/)
// @match        https://www.udemy.com/course/*
// @icon         https://www.google.com/s2/favicons?sz=64&domain=udemy.com
// ==/UserScript==

(function () {
  "use strict";

  // Select the node that will be observed for mutations
  const targetNode = document.querySelector("body");

  // Options for the observer (which mutations to observe)
  const config = { attributes: true, childList: true, subtree: true };

  const callback = function (mutationsList, observer) {
    // return if mutationList contains mutations caused by us adding buttons, otherwise get infinite recursion until browser crashes
    if (
      mutationsList.find(
        (el) =>
          el.addedNodes[0]?.id === "userscript-added-button-copy-question" ||
          el.addedNodes[0]?.id === "userscript-added-button-copy-answer"
      )
    ) {
      return;
    }

    const isQuizPage =
      document.querySelector(
        'div[class^="compact-quiz-container--compact-quiz-container--"]'
      ) !== null;
    if (!isQuizPage) {
      return;
    }

    const progressionButton = document.querySelector(
      'button[data-purpose="next-question-button"]'
    );

    if (!progressionButton) {
      return;
    }

    const isQuestionStep = progressionButton.textContent === "Check answer";
    const isAnswerStep =
      progressionButton.textContent === "Next" ||
      progressionButton.textContent === "See results";

    const quizFooter = document.querySelector(
      'div[class^="curriculum-item-footer--flex-align-center--"] > div'
    );

    if (isQuestionStep) {
      if (document.querySelector("#userscript-added-button-copy-question")) {
        return;
      }

      // remove the copy answer button added from isAnswerStep
      const copyAnswerButton = document.querySelector(
        "#userscript-added-button-copy-answer"
      );
      copyAnswerButton?.parentNode.removeChild(copyAnswerButton);

      const questionElement = document.querySelector("#question-prompt");
      const question = questionElement.innerText;

      const answerContainer = document.querySelector(
        'ul[aria-labelledby="question-prompt"]'
      );
      const answers = Array.from(answerContainer.querySelectorAll("li")).map(
        (el) => "\t• " + el.innerText
      );

      const copyText = question + "\n\n" + answers.join("\n");

      const copyQuestionButton = document.createElement("button");
      copyQuestionButton.setAttribute(
        "id",
        "userscript-added-button-copy-question"
      );
      copyQuestionButton.innerHTML = "Copy Question";
      copyQuestionButton.addEventListener("click", () => {
        navigator.clipboard.writeText(copyText);
      });

      quizFooter.append(copyQuestionButton);
    } else if (isAnswerStep) {
      if (document.querySelector("#userscript-added-button-copy-answer")) {
        return;
      }

      const answers = Array.from(document.querySelectorAll("input[type=radio]"))
        .filter((el) => el.checked)
        .map((el) => el.parentElement.textContent.trim())
        .join("\n\n");

      const additionalInfo =
        document
          .querySelector('div[class*="alert-banner-module--body--"]')
          ?.textContent.trim() || "";

      const copyText = additionalInfo
        ? answers + "\n\n" + additionalInfo
        : answers;

      const copyAnswerButton = document.createElement("button");
      copyAnswerButton.setAttribute(
        "id",
        "userscript-added-button-copy-answer"
      );
      copyAnswerButton.innerHTML = "Copy Answer";
      copyAnswerButton.addEventListener("click", () => {
        navigator.clipboard.writeText(copyText);
      });

      quizFooter.append(copyAnswerButton);

      const nextQuestionSelector =
        'button[data-purpose="next-question-button"]';
      document
        .querySelector(nextQuestionSelector)
        .addEventListener("click", () => {
          // remove the copy question button when we click to go to the next question
          const copyQuestionButton = document.querySelector(
            "#userscript-added-button-copy-question"
          );
          copyQuestionButton?.parentNode.removeChild(copyQuestionButton);

          const copyAnswerButton = document.querySelector(
            "#userscript-added-button-copy-answer"
          );
          copyAnswerButton?.parentNode.removeChild(copyAnswerButton);
        });
    }
  };

  // Create an observer instance linked to the callback function
  const observer = new MutationObserver(callback);

  // Start observing the target node for configured mutations
  observer.observe(targetNode, config);
})();
