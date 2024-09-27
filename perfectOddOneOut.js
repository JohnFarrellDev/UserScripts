// ==UserScript==
// @name         Perfect Odd One Out Score
// @namespace    http://tampermonkey.net/
// @version      2024-09-27
// @description  try to take over the world!
// @author       You
// @match        https://emojipedia.org/emoji-playground/odd-one-out/*
// @icon         https://www.google.com/s2/favicons?sz=64&domain=emojipedia.org
// @grant        none
// ==/UserScript==

(function () {
  "use strict";

  function findAndClickOddEmoji() {
    // Get all emoji buttons
    const emojiButtons = document.querySelectorAll(
      '[class^="OptionButton_option-button__"]'
    );

    // Create a map to store emoji frequencies
    const emojiMap = new Map();

    // Count the frequency of each emoji
    emojiButtons.forEach((button) => {
      const emojiUrl = button.querySelector('[class^="Emoji_emoji__"]').style
        .backgroundImage;
      emojiMap.set(emojiUrl, (emojiMap.get(emojiUrl) || 0) + 1);
    });

    // Find the odd emoji (the one with frequency 1)
    let oddEmojiUrl;
    for (const [url, count] of emojiMap.entries()) {
      if (count === 1) {
        oddEmojiUrl = url;
        break;
      }
    }

    // Click the button with the odd emoji
    if (oddEmojiUrl) {
      const oddButton = Array.from(emojiButtons).find(
        (button) =>
          button.querySelector(".Emoji_emoji__6sYSR").style.backgroundImage ===
          oddEmojiUrl
      );
      if (oddButton) {
        oddButton.click();
      }
    }
  }

  // Function to check if the quiz is active
  function isQuizActive() {
    return (
      document.querySelector('[class^="QuizWrapper_quiz-wrapper__"]') !== null
    );
  }

  // Main function to run the script
  function runScript() {
    if (isQuizActive()) {
      findAndClickOddEmoji();
    }
  }

  // Run the script initially
  runScript();

  // Set up a MutationObserver to detect when new questions are loaded
  const observer = new MutationObserver((mutations) => {
    for (const mutation of mutations) {
      if (mutation.type === "childList" && mutation.addedNodes.length > 0) {
        runScript();
        break;
      }
    }
  });

  // Start observing the document body for changes
  observer.observe(document.body, { childList: true, subtree: true });
})();
