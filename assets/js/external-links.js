// Sends off-site links to a new tab.
//
// Done here rather than in the markdown because GitHub Pages will not run the plugin that
// would do it at build time, and hand-writing the attributes on every link in a post is the
// kind of thing that gets forgotten.
//
// Load order matters: this is the last deferred script on the page, so the footnote copies
// footnotes.js makes are already in the DOM and get the same treatment.
(function () {
  var links = document.querySelectorAll('a[href^="http://"], a[href^="https://"]');

  [].forEach.call(links, function (link) {
    // `link.hostname` is resolved against the current page, so a relative href never matches
    // here — only genuinely off-site URLs do.
    if (link.hostname === window.location.hostname) return;

    link.target = "_blank";

    // Without this the opened page gets a window.opener handle back to this one. Modern
    // browsers imply it for target=_blank, but it costs nothing to be explicit. Deliberately
    // not "noreferrer": the sites being linked to should still see where the traffic is from.
    // The footer already writes rel="noopener" by hand, so check before appending.
    var rel = (link.getAttribute("rel") || "").split(/\s+/).filter(Boolean);
    if (rel.indexOf("noopener") === -1) rel.push("noopener");
    link.setAttribute("rel", rel.join(" "));
  });
})();
