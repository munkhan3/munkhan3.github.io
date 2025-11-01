const bodyEl = document.body;
const heroSection = document.getElementById("home");
const yearEl = document.getElementById("year");
if (yearEl) {
  yearEl.textContent = new Date().getFullYear();
}

const rolesTarget = document.querySelector(".typed-role");
const heroNameEl = document.querySelector(".hero-name");
const headerBrand = document.querySelector(".brand");

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
  const canAnimateBrand = !!(headerBrand && heroNameEl && document.body.classList.contains("single-page"));

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

    if (canAnimateBrand) {
      const heroRect = heroNameEl.getBoundingClientRect();
      const showBrand = heroRect.bottom <= 40;
      bodyEl.classList.toggle("brand-visible", showBrand);
    }
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

const normalizeTagValue = (tag) => slugify(tag || "");

const BLOG_DATA_URL = "/assets/data/blog-posts.json";

function resolvePostHref(post) {
  if (post && typeof post.url === "string" && post.url.trim().length) {
    return post.url.trim();
  }
  const slug = post && post.slug ? post.slug : "";
  return slug ? `blog/post.html?slug=${encodeURIComponent(slug)}` : "#";
}

function createBlogPostCard(post) {
  const article = document.createElement("article");
  article.className = "blog-post";
  article.dataset.slug = post.slug || "";
  const tagSlugs = Array.isArray(post.tags)
    ? post.tags
        .map((tag) => normalizeTagValue(tag))
        .filter(Boolean)
    : [];
  article.dataset.tags = tagSlugs.join(",");
  article.dataset.tagsText = Array.isArray(post.tags)
    ? post.tags
        .map((tag) => String(tag).toLowerCase())
        .join(" ")
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
  article.setAttribute("data-tags-text", article.dataset.tagsText);

  const header = document.createElement("div");
  header.className = "blog-post-header";

  const titleEl = document.createElement("h2");
  titleEl.className = "blog-post-title";
  const titleLink = document.createElement("a");
  const postHref = resolvePostHref(post);
  titleLink.href = postHref;
  titleLink.textContent = post.title || "Untitled Post";
  titleEl.appendChild(titleLink);

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

  if (post.readingTime) {
    const readingEl = document.createElement("span");
    readingEl.textContent = post.readingTime;
    meta.appendChild(readingEl);
  }

  const tagsWrap = document.createElement("div");
  tagsWrap.className = "blog-post-tags";
  if (Array.isArray(post.tags) && post.tags.length) {
    post.tags.forEach((tag) => {
      const chip = document.createElement("span");
      chip.className = "chip";
      chip.textContent = tag;
      tagsWrap.appendChild(chip);
    });
    meta.appendChild(tagsWrap);
  }

  header.appendChild(titleEl);
  if (meta.childElementCount) {
    header.appendChild(meta);
  }
  article.appendChild(header);

  if (post.summary) {
    const summaryEl = document.createElement("p");
    summaryEl.className = "blog-post-summary";
    summaryEl.textContent = post.summary;
    article.appendChild(summaryEl);
  }

  const footer = document.createElement("div");
  footer.className = "blog-post-footer";
  const cta = document.createElement("a");
  cta.className = "text-link";
  cta.href = postHref;
  cta.setAttribute("aria-label", `Read ${post.title || "this post"}`);
  cta.textContent = "Read full post →";
  footer.appendChild(cta);
  article.appendChild(footer);

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

function renderTagFilters(posts) {
  const blogRoot = document.querySelector("[data-blog]");
  if (!blogRoot) {
    return;
  }
  const tagList =
    blogRoot.querySelector("[data-tag-filter-list]") || blogRoot.querySelector(".tag-filter-list");
  if (!tagList) {
    return;
  }

  const tagMeta = new Map();
  posts.forEach((post) => {
    if (!post || !Array.isArray(post.tags)) {
      return;
    }
    post.tags.forEach((tag) => {
      const slug = normalizeTagValue(tag);
      if (!slug) {
        return;
      }
      if (!tagMeta.has(slug)) {
        tagMeta.set(slug, { label: tag, count: 0 });
      }
      tagMeta.get(slug).count += 1;
    });
  });

  tagList.innerHTML = "";
  const allButton = document.createElement("button");
  allButton.type = "button";
  allButton.className = "tag-filter is-active";
  allButton.dataset.tag = "all";
  allButton.textContent = "All posts";
  tagList.appendChild(allButton);

  const sorted = Array.from(tagMeta.entries()).sort((a, b) =>
    a[1].label.localeCompare(b[1].label, undefined, { sensitivity: "base" }),
  );

  sorted.forEach(([slug, meta]) => {
    const button = document.createElement("button");
    button.type = "button";
    button.className = "tag-filter";
    button.dataset.tag = slug;
    button.textContent = meta.count > 1 ? `${meta.label} (${meta.count})` : meta.label;
    tagList.appendChild(button);
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
    const tagValues = post.dataset.tags || "";
    const title = (post.dataset.title || post.textContent || "").toLowerCase();
    const summary = (post.dataset.summary || "").toLowerCase();
    const tagText = post.dataset.tagsText || "";

    const tagList = tagValues ? tagValues.split(",").filter(Boolean) : [];
    const matchesTag = tag === "all" || tagList.includes(tag);
    const matchesQuery =
      !query ||
      title.includes(query) ||
      summary.includes(query) ||
      tagText.includes(query);

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

      renderTagFilters(posts);
      renderBlogPosts(posts);
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

const PAGE_EXIT_DURATION = 160;

function loadBlogPostPage() {
  if (!document.body.classList.contains("blog-post-page")) {
    return;
  }

  const layoutRoot = document.querySelector(".blog-post-layout");
  const articleRoot = document.querySelector("[data-blog-post]");
  const eyebrowEl = articleRoot?.querySelector("[data-post-eyebrow]");
  const titleEl = articleRoot?.querySelector("[data-post-title]");
  const deckEl = articleRoot?.querySelector("[data-post-deck]");
  const metaWrap = articleRoot?.querySelector("[data-post-meta]");
  const contentEl = articleRoot?.querySelector("[data-blog-post-content]");
  const outlineRoot = document.querySelector("[data-post-outline]");
  const outlineToggle = outlineRoot?.querySelector("[data-outline-toggle]");
  const outlineNav = outlineRoot?.querySelector("[data-outline-nav]");
  const outlineItemsList = outlineRoot?.querySelector("[data-outline-items]");
  let outlineEntries = [];
  let outlineScrollHandler = null;
  const params = new URLSearchParams(window.location.search);
  const slug = params.get("slug");

  const detachOutlineScroll = () => {
    if (outlineScrollHandler) {
      window.removeEventListener("scroll", outlineScrollHandler);
      outlineScrollHandler = null;
    }
  };

  const clearOutline = (hide = true) => {
    detachOutlineScroll();
    outlineEntries = [];
    if (outlineItemsList) {
      outlineItemsList.innerHTML = "";
    }
    outlineNav?.classList.remove("is-collapsed");
    outlineToggle?.setAttribute("aria-expanded", "true");
    outlineToggle?.setAttribute("aria-label", hide ? "Expand outline" : "Collapse outline");
    outlineRoot?.classList.remove("is-collapsed");
    layoutRoot?.classList.remove("outline-collapsed");
    if (outlineRoot) {
      outlineRoot.hidden = hide;
    }
    if (hide) {
      layoutRoot?.classList.add("outline-collapsed");
    }
  };

  if (outlineToggle && outlineNav && outlineToggle.dataset.bound !== "true") {
    outlineToggle.dataset.bound = "true";
    outlineToggle.addEventListener("click", () => {
      const expanded = outlineToggle.getAttribute("aria-expanded") !== "false";
      const next = !expanded;
      outlineToggle.setAttribute("aria-expanded", String(next));
      outlineNav.classList.toggle("is-collapsed", !next);
      if (outlineRoot) {
        outlineRoot.classList.toggle("is-collapsed", !next);
      }
      if (layoutRoot) {
        layoutRoot.classList.toggle("outline-collapsed", !next);
      }
      outlineToggle.setAttribute("aria-label", next ? "Collapse outline" : "Expand outline");
    });
  }

  const renderError = (message) => {
    if (eyebrowEl) {
      eyebrowEl.textContent = "Blog Post";
    }
    if (titleEl) {
      titleEl.textContent = "Article not found";
    }
    if (deckEl) {
      deckEl.hidden = false;
      deckEl.textContent = message || "We couldn't find the article you were looking for.";
    }
    if (metaWrap) {
      metaWrap.hidden = true;
    }
    if (contentEl) {
      contentEl.innerHTML = `<p class="post-error">${message || "Try returning to the blog to browse other posts."}</p>`;
    }
    clearOutline();
  };

  if (!articleRoot || !titleEl || !contentEl) {
    return;
  }

  clearOutline();

  if (!slug) {
    renderError("No article specified.");
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
      const posts = Array.isArray(payload.posts) ? payload.posts : [];
      const post = posts.find((entry) => entry && entry.slug === slug);
      if (!post) {
        renderError("This article may have moved or no longer exists.");
        return;
      }

      document.title = `${post.title || "Blog Post"} • Muneer Khan`;
      const metaDescription = document.querySelector('meta[name="description"]');
      if (metaDescription && post.summary) {
        metaDescription.setAttribute("content", post.summary);
      }

      titleEl.textContent = post.title || "Untitled Post";

      if (eyebrowEl) {
        if (Array.isArray(post.tags) && post.tags.length) {
          eyebrowEl.textContent = post.tags[0];
        } else {
          eyebrowEl.textContent = "Blog Post";
        }
      }

      if (deckEl) {
        if (post.deck) {
          deckEl.hidden = false;
          deckEl.textContent = post.deck;
        } else if (post.summary) {
          deckEl.hidden = false;
          deckEl.textContent = post.summary;
        } else {
          deckEl.hidden = true;
        }
      }

      if (metaWrap) {
        metaWrap.innerHTML = "";
        const metaParts = [];
        if (post.displayDate || post.date) {
          const timeEl = document.createElement("time");
          const isoDate = post.date || post.displayDate;
          if (isoDate) {
            timeEl.dateTime = isoDate;
          }
          timeEl.textContent = post.displayDate || post.date;
          metaParts.push(timeEl);
        }
        if (post.readingTime) {
          const readingEl = document.createElement("span");
          readingEl.textContent = post.readingTime;
          metaParts.push(readingEl);
        }
        if (Array.isArray(post.tags) && post.tags.length) {
          const tagsEl = document.createElement("div");
          tagsEl.className = "blog-post-tags";
          post.tags.forEach((tag) => {
            const chip = document.createElement("span");
            chip.className = "chip";
            chip.textContent = tag;
            tagsEl.appendChild(chip);
          });
          metaParts.push(tagsEl);
        }
        if (metaParts.length) {
          metaParts.forEach((node) => metaWrap.appendChild(node));
          metaWrap.hidden = false;
        } else {
          metaWrap.hidden = true;
        }
      }

      const htmlContent = post.html || "";
      if (htmlContent) {
        contentEl.innerHTML = htmlContent;
      } else if (post.summary) {
        contentEl.innerHTML = `<p>${post.summary}</p>`;
      } else {
        contentEl.innerHTML = "<p>Full article coming soon.</p>";
      }

      if (window.MathJax && typeof window.MathJax.typesetPromise === "function") {
        window.MathJax.typesetPromise([contentEl]).catch((err) => {
          console.error("MathJax typeset failed", err);
        });
      }

      const buildOutline = () => {
        if (!outlineRoot || !outlineItemsList) {
          return;
        }

        detachOutlineScroll();
        outlineEntries = [];
        outlineItemsList.innerHTML = "";

        const headings = Array.from(contentEl.querySelectorAll("h2, h3"));
        if (!headings.length) {
          clearOutline();
          return;
        }

        const usedIds = new Set();
        headings.forEach((heading) => {
          if (heading.id) {
            usedIds.add(heading.id);
          }
        });

        const ensureHeadingId = (heading, index) => {
          const baseText = heading.textContent || `section-${index + 1}`;
          let baseId = slugify(baseText);
          if (!baseId) {
            baseId = `section-${index + 1}`;
          }
          let candidate = heading.id && heading.id.trim() ? heading.id.trim() : baseId;
          let suffix = 2;
          while (usedIds.has(candidate)) {
            candidate = `${baseId}-${suffix++}`;
          }
          heading.id = candidate;
          usedIds.add(candidate);
          return candidate;
        };

        const fragment = document.createDocumentFragment();

        headings.forEach((heading, index) => {
          const id = ensureHeadingId(heading, index);
          const depth = heading.tagName === "H3" ? 3 : 2;

          const item = document.createElement("li");
          item.className = `outline-entry depth-${depth}`;

          const link = document.createElement("a");
          link.className = "outline-link";
          link.href = `#${id}`;
          link.dataset.target = id;
          link.textContent = heading.textContent || `Section ${index + 1}`;
          item.appendChild(link);

          fragment.appendChild(item);

          outlineEntries.push({
            id,
            heading,
            item,
            link,
          });

          link.addEventListener("click", (event) => {
            event.preventDefault();
            const header = document.querySelector(".site-header");
            const offset =
              heading.getBoundingClientRect().top +
              window.scrollY -
              (header ? header.offsetHeight + 16 : 100);
            window.scrollTo({
              top: Math.max(offset, 0),
              behavior: "smooth",
            });
          });
        });

        outlineItemsList.appendChild(fragment);
        outlineRoot.hidden = false;
        if (outlineNav) {
          outlineNav.classList.remove("is-collapsed");
        }
        if (outlineToggle) {
          outlineToggle.setAttribute("aria-expanded", "true");
          outlineToggle.setAttribute("aria-label", "Collapse outline");
        }
        outlineRoot.classList.remove("is-collapsed");
        layoutRoot?.classList.remove("outline-collapsed");

        const setActiveEntry = (id) => {
          outlineEntries.forEach((entry) => {
            entry.item.classList.toggle("is-active", entry.id === id);
          });
        };

        const updateActiveFromScroll = () => {
          if (!outlineEntries.length) {
            return;
          }
          const anchor = window.scrollY + window.innerHeight * 0.25;
          let activeId = outlineEntries[0].id;
          outlineEntries.forEach((entry) => {
            const top = entry.heading.getBoundingClientRect().top + window.scrollY;
            if (top <= anchor) {
              activeId = entry.id;
            }
          });
          setActiveEntry(activeId);
        };

        let ticking = false;
        const handleScroll = () => {
          if (ticking) {
            return;
          }
          ticking = true;
          window.requestAnimationFrame(() => {
            ticking = false;
            updateActiveFromScroll();
          });
        };

        outlineScrollHandler = handleScroll;
        window.addEventListener("scroll", outlineScrollHandler, { passive: true });
        updateActiveFromScroll();
      };

      buildOutline();
    })
    .catch((error) => {
      console.error("Failed to load article", error);
      renderError("Unable to load the article right now. Please try again soon.");
    });
}

loadBlogPostPage();

function initPageTransitions() {
  const body = document.body;
  if (!body) {
    return;
  }

  const mediaQuery =
    typeof window !== "undefined" && window.matchMedia
      ? window.matchMedia("(prefers-reduced-motion: reduce)")
      : null;

  const prefersReducedMotion = () => !!(mediaQuery && mediaQuery.matches);

  const handleLinkClick = (event) => {
    if (event.defaultPrevented || event.metaKey || event.ctrlKey || event.shiftKey || event.altKey) {
      return;
    }

    const link = event.target.closest("a");
    if (!link) {
      return;
    }

    if ((link.target && link.target !== "_self") || link.hasAttribute("download")) {
      return;
    }

    if (link.dataset.noTransition === "true" || link.dataset.pdf) {
      return;
    }

    const href = link.getAttribute("href");
    if (
      !href ||
      href.startsWith("#") ||
      href.startsWith("mailto:") ||
      href.startsWith("tel:")
    ) {
      return;
    }

    let url;
    try {
      url = new URL(href, window.location.href);
    } catch (err) {
      return;
    }

    if (url.origin !== window.location.origin) {
      return;
    }

    if (url.href === window.location.href) {
      return;
    }

    event.preventDefault();

    if (prefersReducedMotion()) {
      window.location.href = url.href;
      return;
    }

    body.classList.add("is-page-transitioning");
    window.setTimeout(() => {
      window.location.href = url.href;
    }, PAGE_EXIT_DURATION);
  };

  document.addEventListener("click", handleLinkClick);
  window.addEventListener("pageshow", () => {
    body.classList.remove("is-page-transitioning");
  });
}

initPageTransitions();

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

const storedTheme = typeof window !== "undefined" ? window.localStorage.getItem(THEME_STORAGE_KEY) : null;
applyTheme(storedTheme || "dark");

const themeToggle = document.querySelector(".theme-toggle");
if (themeToggle) {
  themeToggle.addEventListener("click", () => {
    const isDark = document.body.classList.contains("theme-dark");
    const nextTheme = isDark ? "light" : "dark";
    applyTheme(nextTheme);
    window.localStorage.setItem(THEME_STORAGE_KEY, nextTheme);
  });
}
