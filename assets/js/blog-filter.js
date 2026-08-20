(function () {
  var searchInput = document.getElementById("blog-search");
  var dropdown = document.getElementById("tag-dropdown");
  var trigger = document.getElementById("tag-dropdown-trigger");
  var menu = document.getElementById("tag-dropdown-menu");
  var label = trigger ? trigger.querySelector(".tag-dropdown-label") : null;
  var options = menu ? menu.querySelectorAll(".tag-dropdown-option") : [];
  var items = document.querySelectorAll("#blog-post-list .post-item");
  var emptyState = document.getElementById("blog-empty-state");
  if (!items.length) return;

  var selectedSubject = "";

  function applyFilters() {
    var query = ((searchInput && searchInput.value) || "").trim().toLowerCase();
    var visibleCount = 0;

    items.forEach(function (item) {
      var itemTags = (item.dataset.tags || "").split(",").filter(Boolean);
      var itemKeywords = (item.dataset.keywords || "").split(",").filter(Boolean);
      var title = item.dataset.title || "";
      var subject = item.dataset.subject || "";

      var matchesSubject = !selectedSubject || subject === selectedSubject;
      var matchesSearch = !query
        || title.indexOf(query) !== -1
        || itemTags.some(function (t) { return t.indexOf(query) !== -1; })
        || itemKeywords.some(function (k) { return k.indexOf(query) !== -1; });

      var visible = matchesSubject && matchesSearch;
      item.hidden = !visible;
      if (visible) visibleCount++;
    });

    if (emptyState) emptyState.hidden = visibleCount !== 0;
  }

  function openMenu() {
    if (!dropdown || !menu || !trigger) return;
    dropdown.classList.add("open");
    menu.hidden = false;
    trigger.setAttribute("aria-expanded", "true");
  }

  function closeMenu() {
    if (!dropdown || !menu || !trigger) return;
    dropdown.classList.remove("open");
    menu.hidden = true;
    trigger.setAttribute("aria-expanded", "false");
  }

  function selectOption(opt) {
    selectedSubject = opt.dataset.subject || "";
    if (label) label.textContent = opt.textContent;
    options.forEach(function (o) {
      o.classList.remove("active");
      o.setAttribute("aria-selected", "false");
    });
    opt.classList.add("active");
    opt.setAttribute("aria-selected", "true");
    closeMenu();
    applyFilters();
  }

  if (trigger) {
    trigger.addEventListener("click", function () {
      if (menu && menu.hidden) openMenu(); else closeMenu();
    });
  }

  options.forEach(function (opt) {
    opt.addEventListener("click", function () { selectOption(opt); });
    opt.addEventListener("keydown", function (e) {
      if (e.key === "Enter" || e.key === " ") {
        e.preventDefault();
        selectOption(opt);
      }
    });
  });

  document.addEventListener("click", function (e) {
    if (dropdown && !dropdown.contains(e.target)) closeMenu();
  });

  document.addEventListener("keydown", function (e) {
    if (e.key === "Escape") closeMenu();
  });

  if (searchInput) searchInput.addEventListener("input", applyFilters);
})();
