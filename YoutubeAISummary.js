// ==UserScript==
// @name         YouTube Subscription Feed AI Summary
// @namespace    http://tampermonkey.net/
// @version      0.1
// @description  Link to summarize.tech for each video in YouTube subscription feed
// @author       You
// @match        https://www.youtube.com/feed/subscriptions
// ==/UserScript==

(function () {
  "use strict";

  // Function to add video link to summarize.tech
  function addSummaryLink() {
    const videoContainer = document.querySelector("#contents");

    if (!videoContainer) return;

    const videos = videoContainer.querySelectorAll("h3 a");

    videos.forEach((video) => {
      if (video.parentElement.querySelector("#ai-summary-link")) return;

      const url = video.href;
      if (!url) return;

      const link = document.createElement("a");
      link.textContent = "AI summary";
      link.target = "_blank";
      link.href = `https://www.summarize.tech/${url}`;
      link.id = "ai-summary-link";

      video.parentElement.appendChild(link);
    });
  }

  // Initial run
  addSummaryLink();

  // Create observer to handle dynamically loaded content
  const observer = new MutationObserver((mutations) => {
    addSummaryLink();
  });

  // Start observing
  observer.observe(document.body, {
    childList: true,
    subtree: true,
  });
})();
