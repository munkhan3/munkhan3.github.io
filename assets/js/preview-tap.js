// On touch devices there is no hover, so inline preview links would be unreachable.
// First tap opens the preview, a second tap within TAP_WINDOW follows the link.
// Blog-list titles are deliberately excluded: there the tap should just open the post.
(function () {
  var links = document.querySelectorAll(".post-preview-link");
  if (!links.length) return;

  var TAP_WINDOW = 10000;
  var touchLike = window.matchMedia("(hover: none)");

  var armed = null;
  var timer = null;

  function disarm() {
    if (armed) armed.classList.remove("preview-open");
    armed = null;
    if (timer) {
      clearTimeout(timer);
      timer = null;
    }
  }

  links.forEach(function (link) {
    link.addEventListener("click", function (e) {
      // Pointer devices keep the hover behaviour and navigate on the first click.
      if (!touchLike.matches) return;
      // Already showing this preview — let the second tap through to the link.
      if (armed === link) return;

      e.preventDefault();
      disarm();
      armed = link;
      link.classList.add("preview-open");
      timer = setTimeout(disarm, TAP_WINDOW);
    });
  });

  document.addEventListener("click", function (e) {
    if (armed && !armed.contains(e.target)) disarm();
  });

  document.addEventListener("keydown", function (e) {
    if (e.key === "Escape") disarm();
  });
})();
