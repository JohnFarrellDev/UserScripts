// ==UserScript==
// @name         Udemy - Copy from Section Quiz
// @namespace    http://tampermonkey.net/
// @version      2.0
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

  const copyQuestionId = "userscript-added-button-copy-question";
  const copyAnswerOptionsId = "userscript-added-button-copy-answer-options";
  const copyAnswerId = "userscript-added-button-copy-answer";

  const ourButtonIds = [copyQuestionId, copyAnswerOptionsId, copyAnswerId];

  const selectors = {
    quizPage: 'div[class^="compact-quiz-container--compact-quiz-container--"]',
    nextQuestionButton: 'button[data-purpose="next-question-button"]',
    quizFooter:
      'div[class^="curriculum-item-footer--flex-align-center--"] > div',
    questionContainer: "#question-prompt",
    possibleAnswersContainer: 'ul[aria-labelledby="question-prompt"]',
  };

  const udemyText = {
    nextQuestion: {
      check: "Check answer",
      next: "Next",
      results: "See results",
    },
  };

  const callback = function (mutationsList) {
    const addedNodes = mutationsList
      .map((element) => {
        return element.addedNodes;
      })
      .filter((nodeList) => nodeList.length > 0 && nodeList[0].id)
      .map((node) => node[0].id);

    const isOurMutation = addedNodes.reduce((prev, curr) => {
      if (prev) return prev;

      return ourButtonIds.includes(curr);
    }, false);

    if (isOurMutation) return;

    const isQuizPage = document.querySelector(selectors.quizPage);

    if (!isQuizPage) return;

    const nextQuestionButton = document.querySelector(
      selectors.nextQuestionButton
    );

    if (!nextQuestionButton) return;

    const isQuestionStep =
      nextQuestionButton.textContent === udemyText.nextQuestion.check;

    const isAnswerStep =
      nextQuestionButton.textContent === udemyText.nextQuestion.next ||
      nextQuestionButton.textContent === udemyText.nextQuestion.results;

    const quizFooter = document.querySelector(selectors.quizFooter);

    if (isQuestionStep) {
      if (document.querySelector(copyQuestionId)) return;

      // remove the copy answer button added from isAnswerStep
      const copyAnswerButton = document.querySelector(copyAnswerId);
      copyAnswerButton?.parentNode.removeChild(copyAnswerButton);

      const questionContainer = document.querySelector(
        selectors.questionContainer
      );
      const question = questionContainer.innerText;

      const possibleAnswersContainer = document.querySelector(
        selectors.possibleAnswersContainer
      );
      const answers = Array.from(
        possibleAnswersContainer.querySelectorAll("li")
      )
        .map((el) => el.innerText)
        .join("\n\n");

      const copyQuestionButton = document.createElement("button");
      copyQuestionButton.setAttribute("id", copyQuestionId);
      copyQuestionButton.innerHTML = "Copy Question";
      copyQuestionButton.addEventListener("click", () => {
        navigator.clipboard.writeText(question);
      });

      const copyAnswerOptionsButton = document.createElement("button");
      copyAnswerOptionsButton.setAttribute("id", copyAnswerOptionsId);
      copyAnswerOptionsButton.innerHTML = "Copy Options";
      copyAnswerOptionsButton.addEventListener("click", () => {
        navigator.clipboard.writeText(answers);
      });

      quizFooter.append(copyQuestionButton);
      quizFooter.append(copyAnswerOptionsButton);

      return;
    }

    if (isAnswerStep) {
      if (document.querySelector(copyAnswerId)) {
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
      copyAnswerButton.setAttribute("id", copyAnswerId);
      copyAnswerButton.innerHTML = "Copy Answer";
      copyAnswerButton.addEventListener("click", () => {
        navigator.clipboard.writeText(copyText);
      });

      quizFooter.append(copyAnswerButton);

      document
        .querySelector(selectors.nextQuestionButton)
        .addEventListener("click", () => {
          // remove the copy question button when we click to go to the next question
          const copyQuestionButton = document.querySelector(copyQuestionId);
          copyQuestionButton?.parentNode.removeChild(copyQuestionButton);

          const copyAnswerButton = document.querySelector(copyAnswerId);
          copyAnswerButton?.parentNode.removeChild(copyAnswerButton);
        });
    }
  };

  // Create an observer instance linked to the callback function
  const observer = new MutationObserver(callback);

  // Start observing the target node for configured mutations
  observer.observe(targetNode, config);
})();
