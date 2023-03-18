// ==UserScript==
// @name         Streamcheck Link Skipper
// @namespace    http://tampermonkey.net/
// @version      0.1
// @description  try to take over the world!
// @author       You
// @match        https://streamcheck.link/*
// @icon         https://www.google.com/s2/favicons?sz=64&domain=streamcheck.link
// @grant        none
// ==/UserScript==

(function() {
    'use strict';

    window.location.href = document.querySelector("li > a").href
})();
