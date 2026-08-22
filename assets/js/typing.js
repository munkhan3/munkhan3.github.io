(function () {
  var phases = [
    { text: "Hi!", pause: 1000, append: false },
    // `cue` marks the phase after which the scroll hint may appear (see reveal.js).
    // Flagging it on the phase rather than by index means these can be reordered or
    // reworded without silently breaking the cue.
    { text: "Hi! I'm Muneer", pause: 5000, append: true, cue: true },
    { text: "Data Scientist", pause: 1400, append: false },
    { text: "Graduate Researcher", pause: 1400, append: false },
    { text: "Freeride Skier", pause: 1400, append: false },
    { text: "Amateur Videographer", pause: 1400, append: false }
  ];
  var el = document.getElementById("typing-text");
  var cursor = document.getElementById("typing-cursor");
  if (!el) return;

  var typingSpeed = 70;
  var deletingSpeed = 40;

  var phaseIndex = 0;

  function runPhase() {
    var phase = phases[phaseIndex];
    if (!phase.append && el.textContent.length > 0) {
      eraseCurrent(function () { startTyping(phase); });
    } else {
      startTyping(phase);
    }
  }

  function eraseCurrent(callback) {
    if (cursor) cursor.classList.remove("blink");
    var current = el.textContent;
    if (current.length === 0) {
      callback();
      return;
    }
    el.textContent = current.slice(0, -1);
    setTimeout(function () { eraseCurrent(callback); }, deletingSpeed);
  }

  function startTyping(phase) {
    if (cursor) cursor.classList.remove("blink");
    var target = phase.text;

    function typeStep(pos) {
      el.textContent = target.slice(0, pos);
      if (pos < target.length) {
        setTimeout(function () { typeStep(pos + 1); }, typingSpeed);
      } else {
        if (cursor) cursor.classList.add("blink");
        document.dispatchEvent(new CustomEvent("typing:phase-done", {
          detail: { cue: !!phase.cue }
        }));
        setTimeout(nextPhase, phase.pause);
      }
    }

    typeStep(el.textContent.length);
  }

  function nextPhase() {
    phaseIndex = (phaseIndex + 1) % phases.length;
    runPhase();
  }

  runPhase();
})();
