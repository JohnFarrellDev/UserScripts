// ==UserScript==
// @name         Udemy - Copy from Practice Test
// @namespace    http://tampermonkey.net/
// @version      1.0
// @description  Copy questions and answers from Udemy practice exams with ease
// @author       John Farrell (https://www.johnfarrell.dev/)
// @match        https://www.udemy.com/course/*
// @icon         https://www.google.com/s2/favicons?sz=64&domain=udemy.com
// ==/UserScript==

(function() {
    'use strict';

    // Select the node that will be observed for mutations
    const targetNode = document.querySelector('body');

    // Options for the observer (which mutations to observe)
    const config = { attributes: true, childList: true, subtree: true };

    const callback = function(mutationsList, observer) {
        // if muation is caused by our added button elements return to avoid infinte recursion
        if(mutationsList.find(el => el.addedNodes[0]?.id === "userscript-added-button")) return;

        const questionElementSelector = "div.detailed-result-panel--panel-row--2aE8z:nth-child(2) > form:nth-child(1)"
        document.querySelectorAll(questionElementSelector)
            .forEach(el => {

            // if button already added to the question/answer form return
            if(el.querySelector("#userscript-added-button")) return;

            const question = el.querySelector("#question-prompt").textContent.trim()
            const allAnswers = Array.from(el.querySelector("ul").querySelectorAll("p")).map(el => el.textContent.trim()).join("\n\n");
            const explanation = el.querySelector(".mc-quiz-question--explanation--Q5KHQ > div")?.textContent.trim()

            const copyQuestionButton = document.createElement("button");
            copyQuestionButton.setAttribute("id", "userscript-added-button")
            copyQuestionButton.innerHTML = "Copy Question";

            copyQuestionButton.addEventListener("click", () => {
                navigator.clipboard.writeText(question + "\n\n" + allAnswers)
            })

            const copyAnswerButton = document.createElement("button");
            copyAnswerButton.setAttribute("id", "userscript-added-button")
            copyAnswerButton.innerHTML = "Copy Answer";

            copyAnswerButton.addEventListener("click", () => {
                navigator.clipboard.writeText(explanation)
            })

            el.querySelector(".unstyled-list").append(copyQuestionButton)
            el.querySelector(".unstyled-list").append(copyAnswerButton)
        })
    };

    // Create an observer instance linked to the callback function
    const observer = new MutationObserver(callback);

    // Start observing the target node for configured mutations
    observer.observe(targetNode, config);
})();
