// ==UserScript==
// @name         Youtube Auto Liker
// @namespace    http://tampermonkey.net/
// @version      0.1
// @description  try to take over the world!
// @author       You
// @match        https://www.youtube.com/*
// @icon         https://www.google.com/s2/favicons?sz=64&domain=youtube.com
// @grant        none
// ==/UserScript==

(function () {
  "use strict";

  let likedChannels;
  try {
    likedChannels = JSON.parse(localStorage.getItem("liked-channels"));
  } catch {
    likedChannels = {};
  }

  function addToLikedChannels(channelName, addToLiked) {
    likedChannels[channelName] = addToLiked;
    localStorage.setItem("liked-channels", JSON.stringify(likedChannels));
  }

  function createButton(channelName, addToLiked) {
    if (document.querySelector("#userscript-added-button")) {
      return;
    }

    const button = document.createElement("button");
    button.setAttribute("id", "userscript-added-button");
    button.innerHTML = addToLiked
      ? "Add to Auto Liker"
      : "Remove from Auto Liker";

    button.addEventListener("click", () => {
      addToLikedChannels(channelName, addToLiked);
      button.remove();
    });

    return button;
  }

  // Select the node that will be observed for mutations
  const targetNode = document.querySelector("body");

  // Options for the observer (which mutations to observe)
  const config = { attributes: true, childList: true, subtree: true };

  const callback = function (mutationsList, observer) {
    const channelName = document
      .querySelector(".ytd-channel-name")
      .querySelector("a").textContent;
    const uploadSection = document.querySelector("#upload-info");

    if (!likedChannels[channelName]) {
      uploadSection.appendChild(createButton(channelName, true));
    } else {
      uploadSection.appendChild(createButton(channelName, false));

      const likeButton = document
        .querySelector(
          "#top-level-buttons-computed.top-level-buttons.style-scope.ytd-menu-renderer"
        )
        .querySelectorAll("a")[0];
      const isLiked =
        likeButton.querySelector(
          ".style-scope.ytd-toggle-button-renderer.style-default-active"
        ) !== null;

      if (!isLiked) {
        likeButton.click();
      }
    }
  };

  // Create an observer instance linked to the callback function
  const observer = new MutationObserver(callback);

  // Start observing the target node for configured mutations
  observer.observe(targetNode, config);
})();
