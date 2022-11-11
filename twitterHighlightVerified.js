// ==UserScript==
// @name         Highlight Verified Because Only Paid
// @namespace    http://tampermonkey.net/
// @version      0.1
// @description  try to take over the world!
// @author       You
// @match        https://twitter.com/*
// @icon         https://www.google.com/s2/favicons?sz=64&domain=twitter.com
// @grant        none
// ==/UserScript==


(function() {
    'use strict';


    // Select the node that will be observed for mutations
    const targetNode = document.querySelector('body');

    // Options for the observer (which mutations to observe)
    const config = { attributes: true, childList: true, subtree: true };


    const callback = function() {

        const verifiedAccountDivs = [...document.querySelectorAll("svg[aria-label='Verified account']")]

        for(let i = 0; i <= verifiedAccountDivs.length; i++) {
            const requiredElement = verifiedAccountDivs[i]?.parentElement.parentElement.parentElement;
            if(requiredElement?.flaggedAsPaid || !requiredElement) continue;
            const propertiesFromRequiredElement = Object.getOwnPropertyNames(requiredElement)

            const reactProperty = propertiesFromRequiredElement.find(x => x.startsWith("__reactProps"))

            const importantProps = lookForProps(requiredElement[reactProperty].children)

            const onlyPaidVerified = importantProps?.isBlueVerified && !importantProps?.isVerified;

            if(onlyPaidVerified) {
                requiredElement.style.backgroundColor = 'green'
                requiredElement.flaggedAsPaid = true;
            }
        }
    }

    // Create an observer instance linked to the callback function
    const observer = new MutationObserver(callback);

    // Start observing the target node for configured mutations
    observer.observe(targetNode, config);
})();


const lookForProps = (element) => {
    const stack = [element]
    while(stack.length) {
        const currentElement = stack.shift()
        if(!currentElement) continue;

        if(currentElement.props?.isBlueVerified !== undefined) {
            return currentElement.props;
        }

        if(Array.isArray(currentElement)) {
            for(let i = 0; i <= currentElement.length; i++) {
                if(currentElement[i]) stack.push(currentElement[i])
            }
            continue;
        }

        if(currentElement.props?.children?.length) {
            for(let i = 0; i <= currentElement.props.children.length; i++) {
                if(currentElement.props.children[i]) stack.push(currentElement.props.children[i])
            }
            continue;
        }

        stack.push(currentElement.props.children)
    }
}


