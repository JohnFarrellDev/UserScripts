// ==UserScript==
// @name         Udemy - Copy from Section Quiz
// @namespace    http://tampermonkey.net/
// @version      1.0
// @description  Easily copy questions and answers from Udemy section quizzes
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
        // return if mutationList contains mutations caused by us adding buttons, otherwise get infinite recursion until browser crashes
        if(mutationsList.find(el => el.addedNodes[0]?.id === "userscript-added-button-copy-question" || el.addedNodes[0]?.id === "userscript-added-button-copy-answer")) return;

        const isQuizPage = document.querySelector(".compact-quiz-container--compact-quiz-container--1BjpZ") !== null;
        if(!isQuizPage) return;

        const isQuestionStep = document.querySelector("button.udlite-btn-primary")?.textContent === "Check answer"
        const isAnswerStep = document.querySelector("button.udlite-btn-small:nth-child(1)")?.textContent === "Next" || document.querySelector("button.udlite-btn-small:nth-child(1)")?.textContent === "See results"

        const quizFooter = document.querySelector("div.curriculum-item-footer--flex-align-center--3ja06:nth-child(2)");

        if(isQuestionStep) {

            if(document.querySelector("#userscript-added-button-copy-question")) return

            // remove the copy answer button added from isAnswerStep
            const copyAnswerButton = document.querySelector("#userscript-added-button-copy-answer");
            copyAnswerButton?.parentNode.removeChild(copyAnswerButton);

            const question = document.querySelector("#question-prompt > p:nth-child(1)").innerText
            const answers = Array.from(document.querySelectorAll("#udemy > div.main-content-wrapper > div.main-content > div > div > main > div > div.app--row--1ydzX.app--body-container--10gJo > div > div > div > div > div > div > div > div > div > div > div > div > div > div > form > ul > li > label > div.udlite-heading-md > div > div > p")).map((el) => "\t\t•\t " + el.innerText);
            const copyText = question + "\n\n" + answers.join("\n");

            const copyQuestionButton = document.createElement("button");
            copyQuestionButton.setAttribute("id", "userscript-added-button-copy-question");
            copyQuestionButton.innerHTML = "Copy Question";
            copyQuestionButton.addEventListener("click", () => {
                navigator.clipboard.writeText(copyText)
            })

            quizFooter.append(copyQuestionButton);
        }
         else if(isAnswerStep) {

             if(document.querySelector("#userscript-added-button-copy-answer")) return

            const answers = Array.from(document.querySelectorAll('input[type=radio]'))
                .filter(el => el.checked)
                .map(el => el.parentElement.textContent.trim()).join("\n\n")
            const addidtionalInfo = document.querySelector(".alert-banner--body--1ucrB")?.textContent.trim() || '';
            const copyText = addidtionalInfo ? answers + "\n\n" + addidtionalInfo : answers;

            const copyAnswerButton = document.createElement("button");
            copyAnswerButton.setAttribute("id", "userscript-added-button-copy-answer");
            copyAnswerButton.innerHTML = "Copy Answer";
            copyAnswerButton.addEventListener("click", () => {
                navigator.clipboard.writeText(copyText)
            })

            quizFooter.append(copyAnswerButton);

             const nextQuestionSelector = 'button.udlite-btn-small:nth-child(1)'
            document.querySelector(nextQuestionSelector).addEventListener("click", () => {
                // remove the copy question button when we click to go to the next question
                const copyQuestionButton = document.querySelector("#userscript-added-button-copy-question");
                copyQuestionButton?.parentNode.removeChild(copyQuestionButton);
            })
        }
    }


    // Create an observer instance linked to the callback function
    const observer = new MutationObserver(callback);

    // Start observing the target node for configured mutations
    observer.observe(targetNode, config);
})();
