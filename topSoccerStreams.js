// ==UserScript==
// @name         Prioritize Sky Sports Streams
// @namespace    http://tampermonkey.net/
// @version      2024-09-29
// @description  try to take over the world!
// @author       You
// @match        https://top.soccerstreams100.io/event/*
// @icon         https://www.google.com/s2/favicons?sz=64&domain=soccerstreams100.io
// @grant        none
// ==/UserScript==

(function () {
  "use strict";

  // Function to check if a stream is from Sky Sports
  function isSkyStream(channel) {
    return channel.toLowerCase().includes("sky");
  }

  // Function to move Sky Sports streams to the top
  function prioritizeSkyStreams() {
    const tableBody = document.querySelector(".MuiTableBody-root");
    if (!tableBody) return;

    const rows = Array.from(tableBody.children);
    const skyRows = [];
    const otherRows = [];

    rows.forEach((row) => {
      const channelCell = row.querySelector(".MuiTableCell-root:last-child");
      if (channelCell && isSkyStream(channelCell.textContent)) {
        skyRows.push(row);
      } else {
        otherRows.push(row);
      }
    });

    // Clear the table body
    tableBody.innerHTML = "";

    // Append Sky Sports streams first, then others
    skyRows.concat(otherRows).forEach((row) => tableBody.appendChild(row));
  }

  // Run the prioritization after a short delay to ensure the table has loaded
  setTimeout(prioritizeSkyStreams, 0);
})();
