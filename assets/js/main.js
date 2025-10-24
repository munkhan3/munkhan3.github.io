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

const initCarousel = (root) => {
  const track = root.querySelector("[data-carousel-track]");
  if (!track) return;
  const prevBtn = root.querySelector("[data-carousel-prev]");
  const nextBtn = root.querySelector("[data-carousel-next]");

  const readGap = () => {
    const styles = window.getComputedStyle(track);
    const gap = parseFloat(styles.columnGap || styles.gap || "0") || 0;
    return gap;
  };

  const getStepSize = () => {
    const firstCard = track.firstElementChild;
    if (!firstCard) {
      return track.clientWidth;
    }
    return firstCard.getBoundingClientRect().width + readGap();
  };

  const updateButtons = () => {
    if (!prevBtn && !nextBtn) return;
    const maxScroll = track.scrollWidth - track.clientWidth - 1;
    const current = track.scrollLeft;
    if (prevBtn) {
      prevBtn.disabled = current <= 0;
    }
    if (nextBtn) {
      nextBtn.disabled = current >= maxScroll;
    }
  };

  const scrollByStep = (direction) => {
    const amount = getStepSize() * direction;
    track.scrollBy({ left: amount, behavior: "smooth" });
  };

  if (prevBtn) {
    prevBtn.addEventListener("click", () => scrollByStep(-1));
  }
  if (nextBtn) {
    nextBtn.addEventListener("click", () => scrollByStep(1));
  }

  track.addEventListener("scroll", () => {
    window.requestAnimationFrame(updateButtons);
  });

  window.addEventListener("resize", () => {
    window.requestAnimationFrame(updateButtons);
  });

  updateButtons();
};

document
  .querySelectorAll("[data-carousel]")
  .forEach((carousel) => initCarousel(carousel));

const slugify = (raw) => {
  const value = (raw || "").toLowerCase();
  return value
    .replace(/[^a-z0-9\s-]/g, "")
    .trim()
    .replace(/\s+/g, "-")
    .replace(/-+/g, "-");
};

const DEFAULT_POST_CONTENT = {
  slug: "__default__",
  title: "Article coming soon",
  readingTime: "",
  deck: "Check back shortly for the full write-up.",
  html: "<p>New posts publish regularly—try another article or refresh in a bit.</p>",
  tags: [],
  displayDate: "",
  date: "",
  summary: "",
};

const blogPostContent = new Map();
blogPostContent.set("__default__", DEFAULT_POST_CONTENT);
const BLOG_DATA_URL = "assets/data/blog-posts.json";

function createBlogPostCard(post) {
  const article = document.createElement("article");
  article.className = "blog-post";
  article.dataset.slug = post.slug || "";
  article.dataset.tags = Array.isArray(post.tags)
    ? post.tags.map((tag) => String(tag).toLowerCase()).join(" ")
    : "";
  article.dataset.title = post.title || "";
  article.dataset.summary = post.summary || "";
  article.dataset.displayDate = post.displayDate || "";
  article.dataset.date = post.date || "";
  article.dataset.readingTime = post.readingTime || "";
  article.setAttribute("data-slug", article.dataset.slug);
  article.setAttribute("data-title", article.dataset.title);
  article.setAttribute("data-summary", article.dataset.summary);
  article.setAttribute("data-display-date", article.dataset.displayDate);
  article.setAttribute("data-date", article.dataset.date);
  article.setAttribute("data-reading-time", article.dataset.readingTime);
  article.setAttribute("data-tags", article.dataset.tags);
  article.tabIndex = 0;

  const meta = document.createElement("div");
  meta.className = "blog-post-meta";

  const displayDate = post.displayDate || post.date || "";
  if (displayDate) {
    const timeEl = document.createElement("time");
    if (post.date) {
      timeEl.dateTime = post.date;
    }
    timeEl.textContent = displayDate;
    meta.appendChild(timeEl);
  }

  const tagsWrap = document.createElement("div");
  tagsWrap.className = "blog-post-tags";
  if (Array.isArray(post.tags)) {
    post.tags.forEach((tag) => {
      const chip = document.createElement("span");
      chip.className = "chip";
      chip.textContent = tag;
      tagsWrap.appendChild(chip);
    });
  }
  meta.appendChild(tagsWrap);
  article.appendChild(meta);

  const heading = document.createElement("h2");
  const headingLink = document.createElement("a");
  headingLink.href = "#";
  headingLink.textContent = post.title || "Untitled Post";
  heading.appendChild(headingLink);
  article.appendChild(heading);

  if (post.summary) {
    const summaryEl = document.createElement("p");
    summaryEl.textContent = post.summary;
    article.appendChild(summaryEl);
  }

  const cta = document.createElement("a");
  cta.className = "text-link";
  cta.href = "#";
  cta.setAttribute("aria-label", `Read ${post.title || "this post"}`);
  cta.textContent = "Read more →";
  article.appendChild(cta);

  return article;
}

function renderBlogPosts(posts) {
  const blogRoot = document.querySelector("[data-blog]");
  if (!blogRoot) {
    return [];
  }
  const postsContainer =
    blogRoot.querySelector("[data-blog-list]") || blogRoot.querySelector(".blog-posts");
  if (!postsContainer) {
    return [];
  }

  const emptyMessage = blogRoot.querySelector("[data-empty-message]");
  if (emptyMessage) {
    emptyMessage.hidden = true;
  }

  postsContainer.innerHTML = "";

  if (!posts.length) {
    postsContainer.innerHTML =
      '<p class="blog-error">No posts published yet—check back soon.</p>';
    const resultsCountEl = blogRoot.querySelector("[data-results-count]");
    if (resultsCountEl) resultsCountEl.textContent = "0";
    const resultsLabelEl = blogRoot.querySelector("[data-results-label]");
    if (resultsLabelEl) resultsLabelEl.textContent = "posts";
    if (emptyMessage) {
      emptyMessage.hidden = false;
    }
    return [];
  }

  const fragment = document.createDocumentFragment();
  posts.forEach((post) => {
    if (post && post.slug) {
      blogPostContent.set(post.slug, post);
    }
    fragment.appendChild(createBlogPostCard(post));
  });
  postsContainer.appendChild(fragment);

  const renderedPosts = Array.from(postsContainer.querySelectorAll(".blog-post"));
  const resultsCountEl = blogRoot.querySelector("[data-results-count]");
  if (resultsCountEl) resultsCountEl.textContent = String(renderedPosts.length);
  const resultsLabelEl = blogRoot.querySelector("[data-results-label]");
  if (resultsLabelEl) resultsLabelEl.textContent = renderedPosts.length === 1 ? "post" : "posts";
  return renderedPosts;
}

function initBlogModal(posts) {
  const overlay = document.querySelector("[data-blog-modal]");
  if (!overlay) return;

  const modal = overlay.querySelector(".blog-modal");
  const articleContainer = overlay.querySelector("[data-blog-modal-article]");
  const outlineContainer = overlay.querySelector("[data-outline-content]");
  const outlineWrap = overlay.querySelector("[data-blog-modal-outline]");
  const outlineToggle = overlay.querySelector("[data-outline-toggle]");
  const closeBtn = overlay.querySelector(".blog-modal-close");

  if (!modal || !articleContainer || !outlineContainer || !outlineWrap || !outlineToggle || !closeBtn) {
    return;
  }

  let lastFocusedElement = null;

  const resetOutline = () => {
    outlineWrap.classList.remove("is-collapsed");
    outlineToggle.setAttribute("aria-expanded", "true");
  };

  const cleanupOverlay = () => {
    overlay.hidden = true;
    articleContainer.innerHTML = "";
    outlineContainer.innerHTML = "";
    articleContainer.scrollTop = 0;
    resetOutline();
  };

  const closeModal = () => {
    if (!overlay.classList.contains("is-visible")) {
      return;
    }
    overlay.classList.remove("is-visible");
    bodyEl.classList.remove("is-modal-open");

    const handleTransitionEnd = (event) => {
      if (event.target !== overlay) return;
      overlay.removeEventListener("transitionend", handleTransitionEnd);
      cleanupOverlay();
    };

    overlay.addEventListener("transitionend", handleTransitionEnd);
    window.setTimeout(() => {
      overlay.removeEventListener("transitionend", handleTransitionEnd);
      if (!overlay.hidden) {
        cleanupOverlay();
      }
    }, 260);

    if (lastFocusedElement && typeof lastFocusedElement.focus === "function") {
      lastFocusedElement.focus();
    }
    lastFocusedElement = null;
  };

  const openModal = (post) => {
    if (overlay.classList.contains("is-visible")) {
      return;
    }

    const slugAttr =
      post.getAttribute("data-slug") ||
      post.getAttribute("data-article-id") ||
      slugify(post.getAttribute("data-title") || post.textContent || "article");

    const content = blogPostContent.get(slugAttr) || blogPostContent.get("__default__");

    const heading = post.querySelector("h2");
    const fallbackTitle = heading ? heading.textContent : "Untitled Post";
    const titleText =
      content.title ||
      post.getAttribute("data-title") ||
      fallbackTitle;
    const displayDate = content.displayDate || post.getAttribute("data-display-date") || "";
    const isoDate = content.date || post.getAttribute("data-date") || "";
    const summary = content.summary || post.getAttribute("data-summary") || "";
    const deck = content.deck || summary;
    const readingTime = content.readingTime || post.getAttribute("data-reading-time") || "";
    const tags = Array.isArray(content.tags) ? content.tags : [];

    articleContainer.innerHTML = "";
    outlineContainer.innerHTML = "";
    articleContainer.scrollTop = 0;

    const metaParts = [];
    if (displayDate) {
      if (isoDate) {
        metaParts.push(`<time datetime="${isoDate}">${displayDate}</time>`);
      } else {
        metaParts.push(`<span>${displayDate}</span>`);
      }
    }
    if (readingTime) {
      metaParts.push(`<span>${readingTime}</span>`);
    }
    if (tags.length) {
      metaParts.push(`<span>${tags.join(" • ")}</span>`);
    }

    const articleEl = document.createElement("article");
    articleEl.className = "blog-modal-article";
    articleEl.innerHTML = `
      <header>
        ${metaParts.length ? `<div class="meta">${metaParts.join("")}</div>` : ""}
        <h1 id="blog-modal-title">${titleText}</h1>
        ${deck ? `<p class="deck">${deck}</p>` : ""}
      </header>
      <div class="blog-modal-content">${content.html || "<p>Content coming soon.</p>"}</div>
    `;

    articleContainer.appendChild(articleEl);
    if (window.MathJax && typeof window.MathJax.typesetPromise === "function") {
      window.MathJax.typesetPromise([articleContainer]).catch((err) => {
        console.error("MathJax typeset failed", err);
      });
    }

    const usedIds = new Set(
      Array.from(articleEl.querySelectorAll("[id]")).map((el) => el.id)
    );

    const ensureHeadingId = (base) => {
      let candidate = base ? base.replace(/^-+/, "") : "section";
      if (!candidate) {
        candidate = "section";
      }
      let unique = candidate;
      let suffix = 2;
      while (usedIds.has(unique)) {
        unique = `${candidate}-${suffix++}`;
      }
      usedIds.add(unique);
      return unique;
    };

    const headings = Array.from(articleEl.querySelectorAll("h2, h3"));
    if (!headings.length) {
      outlineContainer.innerHTML = '<p class="outline-empty">Outline coming soon.</p>';
    } else {
      const outlineLinks = headings.map((heading, index) => {
        let headingId = heading.id;
        if (!headingId || usedIds.has(headingId)) {
          headingId = ensureHeadingId(slugify(heading.textContent) || `section-${index + 1}`);
          heading.id = headingId;
        }
        const depth = heading.tagName === "H3" ? "3" : "2";
        return `<a class="outline-link" data-depth="${depth}" href="#${headingId}">${heading.textContent}</a>`;
      });
      outlineContainer.innerHTML = outlineLinks.join("");
    }

    resetOutline();

    lastFocusedElement = document.activeElement;

    overlay.hidden = false;
    overlay.getBoundingClientRect();
    overlay.classList.add("is-visible");
    bodyEl.classList.add("is-modal-open");

    window.setTimeout(() => {
      try {
        articleContainer.focus({ preventScroll: true });
      } catch (err) {
        articleContainer.focus();
      }
    }, 20);
  };

  outlineToggle.addEventListener("click", () => {
    const isCollapsed = outlineWrap.classList.toggle("is-collapsed");
    outlineToggle.setAttribute("aria-expanded", String(!isCollapsed));
  });

  outlineContainer.addEventListener("click", (event) => {
    const link = event.target.closest(".outline-link");
    if (!link) return;
    event.preventDefault();
    const hrefValue = link.getAttribute("href");
    const targetId = hrefValue ? hrefValue.replace("#", "") : "";
    if (!targetId) return;
    const targetHeading = articleContainer.querySelector(`#${targetId}`);
    if (targetHeading) {
      const offset = targetHeading.offsetTop;
      articleContainer.scrollTo({
        top: Math.max(0, offset - 16),
        behavior: "smooth",
      });
    }
  });

  closeBtn.addEventListener("click", closeModal);

  overlay.addEventListener("click", (event) => {
    if (event.target === overlay) {
      closeModal();
    }
  });

  document.addEventListener("keydown", (event) => {
    if (event.key === "Escape" && overlay.classList.contains("is-visible")) {
      closeModal();
    }
  });

  posts.forEach((post) => {
    if (post.dataset.modalBound === "true") {
      return;
    }

    const handleOpen = (event) => {
      const anchor = event.target.closest("a");
      if (anchor) {
        event.preventDefault();
      }
      openModal(post);
    };

    post.addEventListener("click", handleOpen);
    post.addEventListener("keydown", (event) => {
      if (event.key === "Enter" || event.key === " ") {
        event.preventDefault();
        openModal(post);
      }
    });

    post.dataset.modalBound = "true";
  });
}

function initBlogFilters() {
  const blogRoot = document.querySelector("[data-blog]");
  if (!blogRoot || blogRoot.dataset.filtersInitialized === "true") {
    return;
  }

  const searchInput = blogRoot.querySelector("#blog-search");
  const clearSearchBtn = blogRoot.querySelector(".clear-search");
  const tagButtons = Array.from(blogRoot.querySelectorAll(".tag-filter"));
  const resultsCountEl = blogRoot.querySelector("[data-results-count]");
  const resultsLabelEl = blogRoot.querySelector("[data-results-label]");
  const emptyMessageEl = blogRoot.querySelector("[data-empty-message]");
  const resetBtn = blogRoot.querySelector(".blog-reset");
  const postsContainer =
    blogRoot.querySelector("[data-blog-list]") || blogRoot.querySelector(".blog-posts");

  if (!searchInput || !postsContainer) {
    return;
  }

  blogRoot.dataset.filtersInitialized = "true";

  const normalize = (value) => (value || "").toLowerCase().trim();

  const getPosts = () => Array.from(postsContainer.querySelectorAll(".blog-post"));

  const allButton = tagButtons.find((btn) => (btn.dataset.tag || "").toLowerCase() === "all");
  let activeTag = allButton ? (allButton.dataset.tag || "all") : "all";

  const updateClearBtn = () => {
    const hasValue = !!normalize(searchInput.value);
    if (clearSearchBtn) {
      clearSearchBtn.classList.toggle("is-visible", hasValue);
    }
  };

  const updateResultsMeta = (count) => {
    if (resultsCountEl) {
      resultsCountEl.textContent = String(count);
    }
    if (resultsLabelEl) {
      resultsLabelEl.textContent = count === 1 ? "post" : "posts";
    }
  };

  const applyFilters = () => {
    const posts = getPosts();
    const query = normalize(searchInput.value);
    const tag = activeTag.toLowerCase();
    let visible = 0;

    posts.forEach((post) => {
      const tagValues = (post.dataset.tags || "").toLowerCase();
      const title = (post.dataset.title || post.textContent || "").toLowerCase();
      const summary = (post.dataset.summary || "").toLowerCase();

      const tagList = tagValues.split(/\s+/).filter(Boolean);
      const matchesTag = tag === "all" || tagList.includes(tag);
      const matchesQuery =
        !query ||
        title.includes(query) ||
        summary.includes(query) ||
        tagValues.includes(query);

      const isVisible = matchesTag && matchesQuery;
      post.hidden = !isVisible;
      if (isVisible) {
        visible += 1;
      }
    });

    updateResultsMeta(visible);

    if (emptyMessageEl) {
      emptyMessageEl.hidden = visible !== 0;
    }
  };

  const setActiveTag = (nextTag) => {
    activeTag = nextTag || "all";
    tagButtons.forEach((btn) => {
      const value = btn.dataset.tag || "all";
      btn.classList.toggle("is-active", value === activeTag);
    });
  };

  searchInput.addEventListener("input", () => {
    updateClearBtn();
    applyFilters();
  });

  if (clearSearchBtn) {
    clearSearchBtn.addEventListener("click", () => {
      searchInput.value = "";
      updateClearBtn();
      applyFilters();
      searchInput.focus();
    });
  }

  tagButtons.forEach((button) => {
    button.addEventListener("click", () => {
      const tag = button.dataset.tag || "all";
      if (tag === activeTag) {
        if (tag !== "all" && allButton) {
          setActiveTag("all");
        } else {
          return;
        }
      } else {
        setActiveTag(tag);
      }
      applyFilters();
    });
  });

  if (resetBtn) {
    resetBtn.addEventListener("click", () => {
      setActiveTag("all");
      if (allButton) {
        allButton.focus();
      }
      searchInput.value = "";
      updateClearBtn();
      applyFilters();
    });
  }

  updateClearBtn();
  applyFilters();
}

function loadBlogData() {
  const blogRoot = document.querySelector("[data-blog]");
  if (!blogRoot || typeof window.fetch !== "function") {
    return;
  }

  const postsContainer =
    blogRoot.querySelector("[data-blog-list]") || blogRoot.querySelector(".blog-posts");
  if (!postsContainer) {
    return;
  }

  fetch(BLOG_DATA_URL, { cache: "no-store" })
    .then((response) => {
      if (!response.ok) {
        throw new Error(`Failed to fetch blog posts: ${response.status}`);
      }
      return response.json();
    })
    .then((payload) => {
      const posts = Array.isArray(payload.posts) ? payload.posts.slice() : [];

      posts.sort((a, b) => {
        const timeA = a && a.date ? new Date(a.date).getTime() : 0;
        const timeB = b && b.date ? new Date(b.date).getTime() : 0;
        return timeB - timeA;
      });

      blogPostContent.clear();
      blogPostContent.set("__default__", DEFAULT_POST_CONTENT);

      const rendered = renderBlogPosts(posts);
      if (rendered.length) {
        initBlogModal(rendered);
        if (window.MathJax && typeof window.MathJax.typesetPromise === "function") {
          const blogRoot = document.querySelector("[data-blog]");
          const postsContainer =
            blogRoot && (blogRoot.querySelector("[data-blog-list]") || blogRoot.querySelector(".blog-posts"));
          if (postsContainer) {
            window.MathJax.typesetPromise([postsContainer]).catch((err) => {
              console.error("MathJax typeset failed", err);
            });
          }
        }
      }
      initBlogFilters();
    })
    .catch((err) => {
      console.error("Failed to load blog posts", err);
      postsContainer.innerHTML =
        '<p class="blog-error">Unable to load posts right now. Please try again soon.</p>';
      const resultsCountEl = blogRoot.querySelector("[data-results-count]");
      if (resultsCountEl) resultsCountEl.textContent = "0";
      const resultsLabelEl = blogRoot.querySelector("[data-results-label]");
      if (resultsLabelEl) resultsLabelEl.textContent = "posts";
      const emptyMessage = blogRoot.querySelector("[data-empty-message]");
      if (emptyMessage) {
        emptyMessage.hidden = true;
      }
    });
}

loadBlogData();

const THEME_STORAGE_KEY = "mk-theme";

const applyTheme = (theme) => {
  const normalized = theme === "dark" ? "dark" : "light";
  document.body.classList.toggle("theme-dark", normalized === "dark");
  const htmlEl = document.documentElement;
  htmlEl.style.colorScheme = normalized;
  const toggleBtn = document.querySelector(".theme-toggle");
  if (toggleBtn) {
    toggleBtn.dataset.theme = normalized;
    const thumb = toggleBtn.querySelector(".theme-toggle-thumb");
    if (thumb) {
      thumb.textContent = "";
    }
    toggleBtn.setAttribute("aria-label", normalized === "dark" ? "Switch to light mode" : "Switch to dark mode");
  }
};

const detectPreferredTheme = () => {
  if (typeof window === "undefined" || !window.matchMedia) {
    return "light";
  }
  return window.matchMedia("(prefers-color-scheme: dark)").matches ? "dark" : "light";
};

const storedTheme = typeof window !== "undefined" ? window.localStorage.getItem(THEME_STORAGE_KEY) : null;
applyTheme(storedTheme || detectPreferredTheme());

const themeToggle = document.querySelector(".theme-toggle");
if (themeToggle) {
  themeToggle.addEventListener("click", () => {
    const isDark = document.body.classList.contains("theme-dark");
    const nextTheme = isDark ? "light" : "dark";
    applyTheme(nextTheme);
    window.localStorage.setItem(THEME_STORAGE_KEY, nextTheme);
  });
}

if (typeof window !== "undefined" && window.matchMedia) {
  window.matchMedia("(prefers-color-scheme: dark)").addEventListener("change", (event) => {
    const stored = window.localStorage.getItem(THEME_STORAGE_KEY);
    if (stored) {
      return;
    }
    applyTheme(event.matches ? "dark" : "light");
  });
}
