// ==UserScript==
// @name         YouTube Subscription Feed Video ID Copier
// @namespace    http://tampermonkey.net/
// @version      0.1
// @description  Display and copy video IDs from YouTube subscription feed
// @author       You
// @match        https://www.youtube.com/feed/subscriptions
// @grant        GM_addStyle
// ==/UserScript==

(function () {
  "use strict";

  // Add custom CSS
  GM_addStyle(`
        .video-id-button {
            background: rgba(0,0,0,0.7);
            color: white;
            padding: 4px 8px;
            border-radius: 4px;
            cursor: pointer;
            margin-top: 4px;
            display: inline-block;
            font-size: 12px;
        }
        .video-id-button:hover {
            background: rgba(0,0,0,0.9);
        }
    `);

  // Function to copy text to clipboard using modern API
  async function copyToClipboard(text) {
    try {
      const newText = window.currentText
        ? window.currentText + "\n\n" + text
        : text;
      window.currentText = newText;

      await navigator.clipboard.writeText(newText);
      return true;
    } catch (err) {
      console.error("Failed to copy text: ", err);
      return false;
    }
  }

  // Function to add video ID buttons
  function addVideoIdButtons() {
    const videoContainer = document.querySelector("#contents");

    if (!videoContainer) return;

    const videos = videoContainer.querySelectorAll("h3 a");

    videos.forEach((video) => {
      if (video.getAttribute("data-video-id")) return;

      const videoId = video.href.split("v=")[1]?.split("&")[0];
      if (!videoId) return;

      // Create button
      const button = document.createElement("button");
      button.className = "video-id-button";
      button.textContent = videoId;
      button.onclick = async (e) => {
        e.preventDefault();
        if (await copyToClipboard(videoId)) {
          button.textContent = "Copied!";
          setTimeout(() => {
            button.textContent = videoId;
          }, 1000);
        }
      };

      // Add button to the video element
      video.parentElement.appendChild(button);
      video.setAttribute("data-video-id", videoId);
    });
  }

  // Initial run
  addVideoIdButtons();

  // Create observer to handle dynamically loaded content
  const observer = new MutationObserver((mutations) => {
    addVideoIdButtons();
  });

  // Start observing
  observer.observe(document.body, {
    childList: true,
    subtree: true,
  });
})();
