// ==UserScript==
// @name         YouTube - Redirect Short to Actual Video
// @namespace    http://tampermonkey.net/
// @version      0.1
// @description  try to take over the world!
// @author       You
// @match        https://www.youtube.com/*
// @icon         https://www.google.com/s2/favicons?sz=64&domain=youtube.com
// @grant        none
// ==/UserScript==

(function() {
    'use strict';

    // Select the node that will be observed for mutations
    const targetNode = document.querySelector('body');

    // Options for the observer (which mutations to observe)
    const config = { attributes: true, childList: true, subtree: true };

    let isRedirecting = false;

    const callback = () => {
        if(isRedirecting) return;
        if(!window.location.toLocaleString().includes("shorts")) return
        const path = location.pathname.split("/");
        const videoID = path[path.length - 1];
        isRedirecting = true;
        window.location.href = "https://www.youtube.com/watch?v="+videoID;
    }

    // Create an observer instance linked to the callback function
    const observer = new MutationObserver(callback);

    // Start observing the target node for configured mutations
    observer.observe(targetNode, config);
})();
