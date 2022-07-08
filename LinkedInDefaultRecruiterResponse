// ==UserScript==
// @name         LinkedIn Auto Reply Recruiters
// @namespace    http://tampermonkey.net/
// @version      0.1
// @description  try to take over the world!
// @author       You
// @match        https://www.linkedin.com/*
// @icon         https://www.google.com/s2/favicons?sz=64&domain=linkedin.com
// @grant        none
// ==/UserScript==

(function () {
  "use strict";

  // Select the node that will be observed for mutations
  const targetNode = document.querySelector("body");

  // Options for the observer (which mutations to observe)
  const config = { attributes: true, childList: true, subtree: true };

  const callback = function (mutationsList, observer) {
    const openChats = [...document.querySelectorAll(".msg-convo-wrapper")];

    openChats.forEach((chat) => {
      if (!chat.querySelector("#auto-reply-button")) {
        const name = chat
          .querySelector(".msg-overlay-bubble-header__title > a > span")
          .innerHTML.trim();
        const firstName = name.split(" ")[0];
        const buttonContainer = chat.querySelector(".msg-form__left-actions");
        const textField = chat.querySelector(".msg-form__contenteditable > p");
        const submitButton = chat.querySelector(".msg-form__send-button");

        const replyMessage = `Hi ${firstName}, thanks for reaching out. I recently accepted a new role at DAZN so am not looking for any new work opportunities at the moment. Thanks, John Farrell.`;

        const button = document.createElement("button");
        button.setAttribute("id", "auto-reply-button");
        button.innerHTML = "Default Message";

        button.addEventListener("click", () => {
          textField.textContent = replyMessage;
        });

        buttonContainer.appendChild(button);

        submitButton.disabled = false;
      }
    });
  };

  // Create an observer instance linked to the callback function
  const observer = new MutationObserver(callback);

  // Start observing the target node for configured mutations
  observer.observe(targetNode, config);
})();
