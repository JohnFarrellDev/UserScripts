// ==UserScript==
// @name         LinkedIn Clout Chasing Remover
// @namespace    http://tampermonkey.net/
// @version      0.1
// @description  try to take over the world!
// @author       You
// @match        https://www.linkedin.com/*
// @icon         https://www.google.com/s2/favicons?sz=64&domain=linkedin.com
// @grant        none
// ==/UserScript==

(function() {
    'use strict';

    // Select the node that will be observed for mutations
    const targetNode = document.querySelector('body');

    // Options for the observer (which mutations to observe)
    const config = { attributes: true, childList: true, subtree: true };

    const callback = function(mutationsList, observer) {
        const selectedPosts = [...document.querySelectorAll(".social-details-social-counts__social-proof-fallback-number"), ...document.querySelectorAll(".social-details-social-counts__reactions-count")]
        selectedPosts.forEach((social) => {
            const socialInteractions = Number(social.innerText.replace(/,/g, '').match(/\d+/)[0])
            if ( socialInteractions > 50 ) {
                let element = social;
                while(!element.className.startsWith("feed-shared-update-v2")) {
                    element = element.parentElement;
                }
                element.remove()
            }
        })
    };

    // Create an observer instance linked to the callback function
    const observer = new MutationObserver(callback);

    // Start observing the target node for configured mutations
    observer.observe(targetNode, config);
})();
