// Home page scroll reveal.
//
// Every `.reveal` element fades upward into place. On the first arrival of a session nothing
// below the hero shows until the visitor scrolls; on any later visit the page just fades up
// on load. Also runs the decorative scroll hint (aria-hidden in the markup).
//
// Gated on `reveal-enabled`, which head.html sets before first paint — and strips again via a
// watchdog if this file never loads, so content can never end up stranded invisible.
(function () {
  var root = document.documentElement;
  if (!root.classList.contains("reveal-enabled")) return;
  root.setAttribute("data-reveal-ready", "");

  var BATCH_STAGGER = 120;
  var MAX_STAGGER = 360;

  var targets = [].slice.call(document.querySelectorAll(".reveal"));
  if (!targets.length) return;

  function showAll() {
    targets.forEach(function (el) { el.classList.add("is-visible"); });
  }

  function startScrollReveal() {
    if (!("IntersectionObserver" in window)) { showAll(); return; }

    var observer;

    function show(el, delay) {
      if (el.classList.contains("is-visible")) return;
      el.style.transitionDelay = delay + "ms";
      el.classList.add("is-visible");
      observer.unobserve(el);
    }

    // Anything already above the viewport can never trigger an intersection, so it would stay
    // hidden for good — happens on a reload with restored scroll position, or any jump that
    // skips an element past the viewport in one step.
    function sweepPassed() {
      var pending = 0;
      targets.forEach(function (el) {
        if (el.classList.contains("is-visible")) return;
        if (el.getBoundingClientRect().bottom <= 0) show(el, 0);
        else pending++;
      });
      if (!pending) window.removeEventListener("scroll", sweepPassed);
    }

    observer = new IntersectionObserver(function (entries) {
      // Several elements can cross the line in one scroll step. Sort top-to-bottom and
      // stagger, so a batch reads as a cascade rather than everything snapping at once.
      var arriving = entries.filter(function (e) {
        return e.isIntersecting || e.boundingClientRect.bottom <= 0;
      });
      arriving.sort(function (a, b) {
        return a.boundingClientRect.top - b.boundingClientRect.top;
      });
      arriving.forEach(function (entry, i) {
        show(entry.target, Math.min(i * BATCH_STAGGER, MAX_STAGGER));
      });
    }, {
      threshold: 0,
      // Hold off until the element is a little way in, so nothing pops in while still
      // clipped by the bottom edge.
      rootMargin: "0px 0px -12% 0px"
    });

    targets.forEach(function (el) { observer.observe(el); });
    window.addEventListener("scroll", sweepPassed, { passive: true });
  }

  var firstVisit = root.classList.contains("first-visit");

  // ---- scroll hint (first visit only) --------------------------------------------------
  var cue = document.querySelector(".scroll-cue");
  var cueLine = document.querySelector(".scroll-cue-line");
  var cueTimer = null;
  var chevronShown = false;

  var DRAW_PORTION_MS = 1400;  // the 28% mark of scroll-cue-sweep's 5s cycle
  var MIN_LINE = 60;           // below this the line is too stubby to read as a gesture

  // Distance from just under the headline down to just above the chevron. The rail is fixed
  // and the headline is in flow, but the cue only ever runs at scrollY 0, so they line up.
  function measureLine() {
    var h1 = document.querySelector(".hero h1");
    var rail = document.querySelector(".scroll-cue-rail");
    if (!h1 || !rail) return 0;
    return Math.round(rail.getBoundingClientRect().top - h1.getBoundingClientRect().bottom - 22);
  }

  function hideCue() {
    clearTimeout(cueTimer);
    document.removeEventListener("typing:phase-done", onPhaseDone);
    if (cueLine) cueLine.classList.remove("is-sweeping");
    if (!cue) return;
    // Stays in the layout on purpose — pulling it out would resize the bottom-anchored rail
    // and shift the line.
    cue.classList.remove("is-shown");
  }

  function revealChevron() {
    if (chevronShown) return;
    chevronShown = true;
    cue.classList.add("is-shown");
  }

  function onPhaseDone(event) {
    if (!event.detail || !event.detail.cue) return;
    document.removeEventListener("typing:phase-done", onPhaseDone);
    // The typing loop cycles forever; by the time it comes round again the nudge has had
    // its turn either way.
    if (window.scrollY > 0 || !cue) return;

    var h = cueLine ? measureLine() : 0;
    if (h < MIN_LINE) {
      // Short viewport: no room to draw anything meaningful, so just fade the chevron in.
      revealChevron();
      return;
    }
    cueLine.style.setProperty("--cue-line-height", h + "px");
    // Loops until they scroll — one pass is easy to miss if they happened to look away.
    cueLine.classList.add("is-sweeping");
    // Arrives as the line starts being eaten, so the two read as one gesture.
    cueTimer = setTimeout(revealChevron, DRAW_PORTION_MS);
  }

  if (firstVisit && cue) document.addEventListener("typing:phase-done", onPhaseDone);

  // Returning visit: everything fades up on arrival, staggered in document order. The double
  // rAF matters — this script is deferred and may run before the hidden state has been
  // painted, and a transition from a style the browser never rendered does not animate.
  if (!firstVisit) {
    requestAnimationFrame(function () {
      requestAnimationFrame(function () {
        targets.forEach(function (el, i) {
          el.style.transitionDelay = Math.min(i * BATCH_STAGGER, MAX_STAGGER) + "ms";
          el.classList.add("is-visible");
        });
      });
    });
    return;
  }

  // Already scrolled — a reload restores the previous position and no scroll event is coming
  // — so treat the page as underway rather than waiting for a gesture.
  if (window.scrollY > 0) {
    hideCue();
    startScrollReveal();
    return;
  }

  // Nothing to wait for if the page does not scroll: there would be no way to see the
  // content. Re-checked on load, since late images and webfonts change the height.
  function revealIfUnscrollable() {
    if (root.scrollHeight <= window.innerHeight + 1) {
      window.removeEventListener("scroll", onFirstScroll);
      hideCue();
      showAll();
      return true;
    }
    return false;
  }

  // Hold everything back until the visitor scrolls. Starting the observer on load would
  // defeat the point — whatever sits just below the hero is already inside the viewport.
  function onFirstScroll() {
    window.removeEventListener("scroll", onFirstScroll);
    hideCue();
    startScrollReveal();
  }

  window.addEventListener("scroll", onFirstScroll, { passive: true });
  if (!revealIfUnscrollable()) {
    window.addEventListener("load", revealIfUnscrollable);
  }
})();
