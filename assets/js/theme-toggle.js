// Flips between light and dark and remembers the choice. The stored value is also read
// by the inline script in head.html, which applies it before first paint so the page
// never flashes the wrong theme.
(function () {
  var toggle = document.querySelector(".theme-toggle");
  if (!toggle) return;

  var root = document.documentElement;
  var systemDark = window.matchMedia("(prefers-color-scheme: dark)");

  function current() {
    return root.getAttribute("data-theme") || (systemDark.matches ? "dark" : "light");
  }

  toggle.addEventListener("click", function () {
    var next = current() === "dark" ? "light" : "dark";
    root.setAttribute("data-theme", next);
    try {
      localStorage.setItem("theme", next);
    } catch {
      // Private browsing can block storage; the theme still applies for this page view.
    }
  });

  // Follow the OS until the visitor has picked a side themselves.
  systemDark.addEventListener("change", function (event) {
    try {
      if (localStorage.getItem("theme")) return;
    } catch {
      return;
    }
    root.setAttribute("data-theme", event.matches ? "dark" : "light");
  });
})();
