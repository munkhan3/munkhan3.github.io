const bodyEl = document.body;
const heroSection = document.getElementById("home");
const yearEl = document.getElementById("year");
if (yearEl) {
  yearEl.textContent = new Date().getFullYear();
}

const rolesTarget = document.querySelector(".typed-role");

if (rolesTarget) {
  const raw = rolesTarget.dataset.roles || "";
  let roles = [];

  if (raw) {
    try {
      const parsed = JSON.parse(raw);
      if (Array.isArray(parsed)) {
        roles = parsed;
      }
    } catch (err) {
      roles = raw
        .split("|")
        .map((item) => item.trim())
        .filter(Boolean);
      if (roles.length <= 1) {
        roles = raw
          .split(",")
          .map((item) => item.trim())
          .filter(Boolean);
      }
    }
  }

  if (!roles.length) {
    roles = [
      "Data Scientist",
      "Applied Math Researcher",
      "Videographer",
      "Football Enthusiast",
    ];
  }

  const typeDelay = 120;
  const eraseDelay = 70;
  const holdDelay = 1600;
  let roleIndex = 0;
  let charIndex = 0;
  let isErasing = false;

  const typeLoop = () => {
    const role = roles[roleIndex];

    if (!isErasing) {
      rolesTarget.textContent = role.slice(0, charIndex++);
      if (charIndex > role.length) {
        isErasing = true;
        setTimeout(typeLoop, holdDelay);
        return;
      }
    } else {
      rolesTarget.textContent = role.slice(0, charIndex--);
      if (charIndex < 0) {
        isErasing = false;
        roleIndex = (roleIndex + 1) % roles.length;
        charIndex = 0;
      }
    }

    setTimeout(typeLoop, isErasing ? eraseDelay : typeDelay);
  };

  typeLoop();
}

const dotLinks = document.querySelectorAll(".dot-link");
const headerLinks = document.querySelectorAll("[data-section-link]");
const postHeroSections = document.querySelectorAll(".post-hero");
let postHeroActivated = false;

if (dotLinks.length || headerLinks.length) {
  const sectionElements = Array.from(document.querySelectorAll("section[id]"));
  const sectionMap = new Map();
  const sectionLinks = [];

  const registerLink = (link) => {
    const href = link.getAttribute("href");
    if (!href || !href.startsWith("#")) return;
    const id = href.slice(1);
    const existing = sectionMap.get(id) || [];
    existing.push(link);
    sectionMap.set(id, existing);
    sectionLinks.push(link);
  };

  dotLinks.forEach(registerLink);
  headerLinks.forEach(registerLink);

  const highlightNav = (targetId) => {
    sectionMap.forEach((links, id) => {
      links.forEach((link) => {
        link.classList.toggle("is-active", id === targetId);
      });
    });
  };

  const aboutSection = document.getElementById("about");

  let ticking = false;
  const updateActive = () => {
    ticking = false;
    if (!sectionElements.length) {
      return;
    }

    const scrollAnchor = window.scrollY + window.innerHeight * 0.35;
    let currentSectionId = sectionElements[0].id;

    for (const section of sectionElements) {
      if (scrollAnchor >= section.offsetTop) {
        currentSectionId = section.id;
      }
    }

    highlightNav(currentSectionId);

    const showNav =
      currentSectionId !== "home" ||
      (aboutSection && scrollAnchor >= aboutSection.offsetTop - window.innerHeight * 0.15);

    bodyEl.classList.toggle("dot-nav-visible", !!showNav);
    bodyEl.classList.add("dot-nav-evaluated");
    bodyEl.classList.toggle("has-scrolled", window.scrollY > 0);
  };

  const requestUpdate = () => {
    if (ticking) return;
    window.requestAnimationFrame(updateActive);
    ticking = true;
  };

  window.addEventListener("scroll", requestUpdate, { passive: true });
  window.addEventListener("resize", updateActive);

  const initialHash = window.location.hash.replace("#", "");

  if (initialHash) {
    highlightNav(initialHash);
    if (initialHash !== "home") {
    bodyEl.classList.add("dot-nav-visible");
    }
  }

  window.addEventListener("load", () => {
    updateActive();
  });

  updateActive();

  sectionLinks.forEach((link) => {
    link.addEventListener("click", () => {
      const href = link.getAttribute("href");
      if (!href || !href.startsWith("#")) {
        return;
      }
      const id = href.slice(1);
      highlightNav(id);
      if (id !== "home") {
        bodyEl.classList.add("dot-nav-visible");
      }
    });
  });
}

const SCROLL_CUE_DELAY = 3000;
const SCROLL_CUE_HIDE_AFTER_SCROLL = 1000;
let scrollCueTimeout;
let cueDismissed = false;

const showScrollCue = () => {
  if (cueDismissed) return;
  bodyEl.classList.add("show-scroll-cue");
};

let scrollCueHideTimeout;
const SCROLL_CUE_HIDE_DELAY = 1500;

const hideScrollCue = (immediate = false) => {
  clearTimeout(scrollCueHideTimeout);
  if (immediate) {
    bodyEl.classList.remove("show-scroll-cue");
    return;
  }
  scrollCueHideTimeout = window.setTimeout(() => {
    bodyEl.classList.remove("show-scroll-cue");
  }, SCROLL_CUE_HIDE_DELAY);
};

const scheduleScrollCue = () => {
  clearTimeout(scrollCueTimeout);
  scrollCueTimeout = window.setTimeout(() => {
    if (!document.hidden) {
      showScrollCue();
    }
  }, SCROLL_CUE_DELAY);
};

const handleUserActivity = () => {
  if (bodyEl.classList.contains("show-scroll-cue")) {
    hideScrollCue();
  }
  scheduleScrollCue();
};

const handleScroll = () => {
  handleUserActivity();

  if (!postHeroActivated && heroSection && postHeroSections.length) {
    const heroRect = heroSection.getBoundingClientRect();
    if (heroRect.bottom <= window.innerHeight - 20) {
      postHeroActivated = true;
      postHeroSections.forEach((section) => {
        section.classList.add("is-visible");
      });
    }
  }

  if (bodyEl.classList.contains("show-scroll-cue")) {
    hideScrollCue();
    clearTimeout(scrollCueHideTimeout);
    scrollCueHideTimeout = window.setTimeout(() => {
      hideScrollCue();
      cueDismissed = true;
    }, SCROLL_CUE_HIDE_AFTER_SCROLL);
  }
};

hideScrollCue(true);
scheduleScrollCue();
handleScroll();

window.addEventListener("scroll", handleScroll, { passive: true });
window.addEventListener("pointermove", handleUserActivity, { passive: true });
window.addEventListener("keydown", handleUserActivity);
window.addEventListener("resize", handleUserActivity);
window.addEventListener("visibilitychange", () => {
  if (!document.hidden) {
    handleUserActivity();
  }
});
