// ==UserScript==
// @name         cutin - skip loading screen
// @namespace    http://tampermonkey.net/
// @version      0.1
// @description  Skip annoying 3 second loading screen on cutin links
// @author       You
// @match        https://cutin.it/*
// @icon         https://www.google.com/s2/favicons?sz=64&domain=cutin.it
// @grant        none
// ==/UserScript==





(function() {
    'use strict';


    // Select the node that will be observed for mutations
    const targetNode = document.querySelector('body');

    // Options for the observer (which mutations to observe)
    const config = { attributes: true, childList: true, subtree: true };

    let isGoingToURL = false;

    window.onload = (event) => {
        const originalSetTimeout = setTimeout

        globalThis.setTimeout = (callback, delayTime) => {
            originalSetTimeout(callback, 0)
        }

        const originalSetInterval = setInterval

        setInterval = (callback, delayTime) => {
            originalSetInterval(callback, 0)
        }
    };

    const callback = function() {


        if(isGoingToURL) return;
        const button = document.querySelector(".btn-success")
        var HREF = button.getAttribute("href");

        if(HREF !== "#") {
            window.location.replace(HREF);
            isGoingToURL = true;
        }
    }

    // Create an observer instance linked to the callback function
    const observer = new MutationObserver(callback);

    // Start observing the target node for configured mutations
    observer.observe(targetNode, config);
})();
