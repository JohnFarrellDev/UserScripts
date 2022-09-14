// ==UserScript==
// @name         YouTube - Redirect Short to Actual Video
// @namespace    http://tampermonkey.net/
// @version      0.1
// @description  try to take over the world!
// @author       You
// @match        https://www.youtube.com/shorts/*
// @icon         https://www.google.com/s2/favicons?sz=64&domain=youtube.com
// @grant        none
// ==/UserScript==

(function() {
    'use strict';
    const path = location.pathname.split("/");
    const videoID = path[path.length - 1];
    window.location.href = "https://www.youtube.com/watch?v="+videoID;
})();
