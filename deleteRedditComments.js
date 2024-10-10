// ==UserScript==
// @name         Delete Reddit Comments
// @namespace    http://tampermonkey.net/
// @version      2024-10-10
// @description  Delete all comments on a Reddit user page
// @author       You
// @match        https://old.reddit.com/user/*/comments/
// @icon         https://www.google.com/s2/favicons?sz=64&domain=reddit.com
// @grant        none
// ==/UserScript==

async function sleep(ms) {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

(async function () {
  "use strict";
  const firstComment = document.querySelector(".comment");
  if (!firstComment) return;

  const editButton = document.querySelector(".edit-usertext");
  editButton.click();

  const textArea = document.querySelector("textarea");
  textArea.value = "[deleted for privacy reasons]";

  const saveButton = document.querySelector(".save");
  saveButton.click();

  await sleep(5_000);

  const deleteButton = document.querySelector(".del-button a");
  deleteButton.click();

  await sleep(1_000);
  document.querySelector(".yes").click();
  await sleep(1_000);
  document.querySelector(".yes").click();

  await sleep(5_000);

  // reload the page
  window.location.reload();
})();
