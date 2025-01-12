// ==UserScript==
// @name         AWS DIrect Links
// @namespace    http://tampermonkey.net/
// @version      2025-01-12
// @description  try to take over the world!
// @author       You
// @match        https://eu-west-2.console.aws.amazon.com/s3/buckets/google-photos-sadhjdjhsaudysahsdadsaadsfa*
// @icon         https://www.google.com/s2/favicons?sz=64&domain=amazon.com
// @grant        none
// ==/UserScript==

(function () {
  "use strict";

  function addDirectS3Links() {
    const links = document.querySelectorAll("table a");

    links.forEach((link) => {
      const url = new URL(link.href);

      // Only process S3 console links
      if (url.pathname.includes("/s3/object/")) {
        // Extract bucket name and object key
        const bucket = url.pathname.split("/s3/object/")[1];
        const prefix = url.searchParams.get("prefix");
        const region = url.searchParams.get("region");

        // Create direct S3 URL
        const directUrl = `https://${bucket}.s3.${region}.amazonaws.com/${prefix}`;

        // Create new direct link element
        const directLink = document.createElement("a");
        directLink.href = directUrl;
        directLink.textContent = "(Direct Link)";
        directLink.style.marginLeft = "10px";
        directLink.target = "_blank";

        // Add direct link next to original link
        link.parentNode.insertBefore(directLink, link.nextSibling);
      }
    });
  }

  // Run when page loads
  setTimeout(addDirectS3Links, 1_000);
})();
