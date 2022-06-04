// ==UserScript==
// @name         Tiny URL - Skip Loading Screen
// @namespace    http://tampermonkey.net/
// @version      0.1
// @description  Skip annoying 3 second loading screen on TinyUrl links
// @author       JohnFarrell.dev
// @match        https://tinyurl.is/*
// @icon         https://www.google.com/s2/favicons?sz=64&domain=tinyurl.is
// ==/UserScript==

(function() {
    'use strict';


    // Select the node that will be observed for mutations
    const targetNode = document.querySelector('body');

    // Options for the observer (which mutations to observe)
    const config = { attributes: true, childList: true, subtree: true };

    const callback = function() {
        const skipATag = document.querySelector("ul > li > a")
        if(skipATag) {
            const link = skipATag.href;
            window.location.replace(link);
        }
    }

    // Create an observer instance linked to the callback function
    const observer = new MutationObserver(callback);

    // Start observing the target node for configured mutations
    observer.observe(targetNode, config);
})();
