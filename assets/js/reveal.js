// Home page scroll reveal.
//
// Every `.reveal` element fades upward into place. On the first arrival of a session nothing
// below the hero shows until the visitor scrolls, and each element then arrives as it enters
// the viewport. On any later visit the whole page simply fades up on load.
//
// Also runs the scroll hint: if the visitor still has not scrolled by the time the typing
// headline lands, a small chevron fades in. It is decorative only — aria-hidden in the
// markup, with no interaction of its own.
//
// Gated on `reveal-enabled`, which head.html sets before first paint and only when JS is
// running and the visitor has not asked for reduced motion. head.html also carries a
// watchdog that strips the class if this file never loads, so content can never end up
// stranded invisible.
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

    // Anything already above the viewport can never trigger an intersection, so it would
    // stay hidden for good. That happens on a reload with restored scroll position and on
    // any jump that skips an element past the viewport in one step.
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
      // Several elements can cross the line in one scroll step. Sort them top-to-bottom
      // and stagger, so a batch reads as a cascade rather than everything snapping at once.
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
      // Hold off until the element is a little way into the viewport, so things do not
      // pop in while still clipped by the bottom edge.
      rootMargin: "0px 0px -12% 0px"
    });

    targets.forEach(function (el) { observer.observe(el); });
    window.addEventListener("scroll", sweepPassed, { passive: true });
  }

  // The first arrival of a session waits for a scroll before revealing anything, and is
  // offered the chevron. Every later visit just fades the content up on arrival.
  var firstVisit = root.classList.contains("first-visit");

  // ---- scroll hint (first visit only) --------------------------------------------------
  var cue = document.querySelector(".scroll-cue");
  var cueLine = document.querySelector(".scroll-cue-line");
  var cueTimer = null;
  var chevronShown = false;

  var DRAW_PORTION_MS = 1400;  // the 28% mark of scroll-cue-sweep's 5s cycle
  var MIN_LINE = 60;           // below this the line is too stubby to read as a gesture

  // Distance from just under the headline down to just above the chevron. The rail is
  // fixed and the headline is in flow, but the cue only ever runs at scrollY 0, so
  // viewport coordinates line up.
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
    // Fades out and stops animating. It stays in the layout on purpose — pulling it out
    // would resize the bottom-anchored rail and shift the line.
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
    // The typing loop cycles forever; by the time it comes round again the visitor has
    // either scrolled or deliberately not, and either way the nudge has had its turn.
    if (window.scrollY > 0 || !cue) return;

    var h = cueLine ? measureLine() : 0;
    if (h < MIN_LINE) {
      // Short viewport: no room to draw anything meaningful, so just fade the chevron in.
      revealChevron();
      return;
    }
    cueLine.style.setProperty("--cue-line-height", h + "px");
    // The sweep loops on its own until they scroll — one pass is easy to miss if they
    // happened to look away.
    cueLine.classList.add("is-sweeping");
    // The chevron arrives as the line starts being eaten, so the two read as one gesture.
    // Matches the 28% keyframe of the 5s cycle; being a frame off only shifts the fade.
    cueTimer = setTimeout(revealChevron, DRAW_PORTION_MS);
  }

  if (firstVisit && cue) document.addEventListener("typing:phase-done", onPhaseDone);

  // Returning visit: nothing to wait for and nothing gated on position — everything fades
  // up on arrival, staggered in document order, whether or not it is on screen yet.
  // The double rAF matters: this script is deferred and may run before the hidden state has
  // been painted, and a transition from a style the browser never rendered does not animate.
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

  // Already scrolled — a reload restores the previous position, and no scroll event is
  // coming — so treat the page as underway rather than waiting for a gesture.
  if (window.scrollY > 0) {
    hideCue();
    startScrollReveal();
    return;
  }

  // Nothing to wait for if the page does not scroll: there would be no way to ever see
  // the content. Re-checked on load, since late images and webfonts change the height.
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
  // defeat the point — whatever sits just below the hero is already inside the viewport
  // and would appear without them doing anything.
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
