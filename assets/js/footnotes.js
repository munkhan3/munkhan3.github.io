// Margin notes.
//
// Lifts each kramdown footnote out of the list at the foot of the post and shows it next to
// its marker on hover, focus, or tap. Three placements, matching .post-preview-card: the
// right margin where there is room for it, a popup under the marker on narrower screens, and
// a sheet pinned to the bottom edge on phones.
//
// The list at the foot of the post is deliberately left in place — it is the no-JS fallback,
// the target the markers link to, and what prints.
(function () {
  var content = document.querySelector(".post-content");
  if (!content) return;

  var refs = content.querySelectorAll("a.footnote");
  if (!refs.length) return;

  var MARGIN = window.matchMedia("(min-width: 1240px)");
  var PHONE = window.matchMedia("(max-width: 600px)");
  var TOUCH = window.matchMedia("(hover: none)");
  var TAP_WINDOW = 10000;
  var LINGER_MARGIN = 3000;
  var LINGER_NEAR = 220;

  var pairs = [];
  var open = null;
  var tapTimer = null;
  var hideTimer = null;

  refs.forEach(function (ref) {
    var li = document.getElementById(decodeURIComponent(ref.getAttribute("href").slice(1)));
    if (!li) return;

    var note = document.createElement("aside");
    note.className = "sidenote";
    note.innerHTML = li.innerHTML;

    // The backlink only means something inside the list it points back into.
    var back = note.querySelector(".reversefootnote");
    if (back) back.parentNode.removeChild(back);

    content.appendChild(note);
    pairs.push({ ref: ref, note: note });
  });

  if (!pairs.length) return;

  function place(pair) {
    var note = pair.note;
    note.classList.remove("sidenote-left", "sidenote-right");

    // Phone placement is a fixed sheet, entirely CSS. Clearing the inline values left by a
    // previous popup is what lets those rules apply.
    if (PHONE.matches) {
      note.style.top = "";
      note.style.left = "";
      return;
    }
    var box = content.getBoundingClientRect();
    var mark = pair.ref.getBoundingClientRect();
    if (MARGIN.matches) {
      // Aligned with the marker's own line. Only the horizontal side comes from CSS here —
      // leaving `top` unset would drop the note at its static position, the far end of
      // the post.
      note.style.top = mark.top - box.top - 4 + "px";
      note.style.left = "";
      // The note goes in whichever margin the marker is nearer, so the eye travels the
      // shorter distance. Both margins are the same width, the column being centred, so
      // one breakpoint covers either side.
      var onLeft = mark.left + mark.width / 2 < window.innerWidth / 2;
      note.classList.add(onLeft ? "sidenote-left" : "sidenote-right");
      return;
    }
    note.style.top = mark.bottom - box.top + 10 + "px";
    // Roughly under the marker, then pulled back inside the column at either edge.
    var left = mark.left - box.left - 40;
    note.style.left = Math.max(0, Math.min(left, box.width - note.offsetWidth)) + "px";
  }

  function show(pair) {
    clearTimeout(hideTimer);
    hideTimer = null;
    if (open && open !== pair) hide();
    place(pair);
    pair.note.classList.add("is-open");
    open = pair;
  }

  function hide() {
    clearTimeout(tapTimer);
    clearTimeout(hideTimer);
    tapTimer = null;
    hideTimer = null;
    if (!open) return;
    open.note.classList.remove("is-open");
    open = null;
  }

  // Notes can carry links, so the pointer has to be able to reach one without the marker's
  // mouseleave closing it on the way. A margin note is a deliberate trip across the gutter,
  // well past the few hundred ms that bridging a popup sitting under the marker needs — and
  // it costs nothing to leave up, being clear of the text either way.
  function hideSoon() {
    clearTimeout(hideTimer);
    hideTimer = setTimeout(hide, MARGIN.matches ? LINGER_MARGIN : LINGER_NEAR);
  }

  pairs.forEach(function (pair) {
    var marker = pair.ref.parentNode.tagName === "SUP" ? pair.ref.parentNode : pair.ref;

    marker.addEventListener("mouseenter", function () {
      if (!TOUCH.matches) show(pair);
    });
    marker.addEventListener("mouseleave", function () {
      if (!TOUCH.matches) hideSoon();
    });
    pair.note.addEventListener("mouseenter", function () {
      if (!TOUCH.matches) show(pair);
    });
    pair.note.addEventListener("mouseleave", function () {
      if (!TOUCH.matches) hideSoon();
    });

    pair.ref.addEventListener("focus", function () { show(pair); });
    pair.ref.addEventListener("blur", function () { hide(); });

    // Touch has no hover, and the marker's own job — jumping to the list — is the worse
    // of the two outcomes here. First tap opens the note, a second follows the link.
    pair.ref.addEventListener("click", function (e) {
      if (!TOUCH.matches) return;
      if (open === pair) return;
      e.preventDefault();
      show(pair);
      tapTimer = setTimeout(hide, TAP_WINDOW);
    });
  });

  document.addEventListener("click", function (e) {
    if (open && !open.note.contains(e.target) && !open.ref.contains(e.target)) hide();
  });

  document.addEventListener("keydown", function (e) {
    if (e.key === "Escape") hide();
  });

  // A resize can change which of the three placements applies, and reflow moves the markers.
  window.addEventListener("resize", function () {
    if (open) place(open);
  });

  // Cloned before MathJax runs, so the notes still hold raw \(..\) and get typeset with the
  // rest of the page. If MathJax happened to finish first, typeset the clones directly —
  // before it starts, window.MathJax is just the config object and has no typesetPromise.
  if (window.MathJax && window.MathJax.typesetPromise) {
    window.MathJax.typesetPromise(pairs.map(function (p) { return p.note; }));
  }
})();
