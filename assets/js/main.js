const basePath = document.body.dataset.basePath || "";

const toPath = (relativePath) => `${basePath}${relativePath}`;

const cleanMetaText = (value) => {
  if (!value) return "";
  let output = String(value).trim();
  output = output.replace(/\s+#.*$/, "").trim();
  if (output.startsWith('"') && output.endsWith('"') && output.length > 1) {
    output = output.slice(1, -1).trim();
  }
  return output;
};

const normalizePath = (pathname) => {
  if (!pathname) return "/";
  let normalized = pathname.replace(/\/index\.html$/, "/");
  normalized = normalized.replace(/\/$/, "") || "/";
  return normalized;
};

const setYear = () => {
  document.querySelectorAll("[data-year]").forEach((el) => {
    el.textContent = String(new Date().getFullYear());
  });
};

const setupMobileMenu = () => {
  const nav = document.querySelector(".nav-shell");
  const toggle = document.querySelector(".menu-toggle");
  if (!nav || !toggle) return;

  toggle.addEventListener("click", () => {
    const open = nav.classList.toggle("menu-open");
    toggle.setAttribute("aria-expanded", String(open));
  });

  document.addEventListener("click", (event) => {
    if (!nav.classList.contains("menu-open")) return;
    if (nav.contains(event.target)) return;
    nav.classList.remove("menu-open");
    toggle.setAttribute("aria-expanded", "false");
  });
};

const highlightActiveNav = () => {
  const links = Array.from(document.querySelectorAll("a[data-nav]"));
  if (!links.length) return;

  const current = normalizePath(window.location.pathname);

  links.forEach((link) => {
    const href = link.getAttribute("href");
    if (!href) return;

    const target = normalizePath(new URL(href, window.location.href).pathname);
    const isBlogPost = current.includes("/blog/post") && target.endsWith("/blog");
    const active = current === target || isBlogPost;
    link.classList.toggle("active", active);
  });
};

const setupReveal = () => {
  const revealNodes = document.querySelectorAll(".reveal");
  if (!revealNodes.length) return;

  const observer = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        if (!entry.isIntersecting) return;
        entry.target.classList.add("is-visible");
        observer.unobserve(entry.target);
      });
    },
    { threshold: 0.14 }
  );

  revealNodes.forEach((node) => observer.observe(node));
};

const fetchPosts = async () => {
  const response = await fetch(toPath("assets/data/blog-posts.json"));
  if (!response.ok) {
    throw new Error(`Failed to load posts (${response.status})`);
  }

  const payload = await response.json();
  const posts = Array.isArray(payload.posts) ? payload.posts : [];

  return posts
    .map((post) => ({
      ...post,
      deck: cleanMetaText(post.deck),
      readingTime: cleanMetaText(post.readingTime),
      tags: Array.isArray(post.tags) ? post.tags : [],
    }))
    .sort((a, b) => {
      const left = Date.parse(a.date || 0);
      const right = Date.parse(b.date || 0);
      return right - left;
    });
};

const setupRecentPosts = async () => {
  const wrapper = document.querySelector("[data-recent-posts-list]");
  if (!wrapper) return;

  try {
    const posts = await fetchPosts();
    const featured = posts.slice(0, 3);

    if (!featured.length) {
      wrapper.innerHTML = '<article class="card"><h3>No posts yet</h3></article>';
      return;
    }

    wrapper.innerHTML = featured
      .map(
        (post) => `
        <article class="card">
          <h3>${post.title}</h3>
          <p>${post.summary || "No summary available."}</p>
          <p class="meta">${post.displayDate || ""}${post.readingTime ? ` · ${post.readingTime}` : ""}</p>
          <a class="btn" href="${toPath(`blog/post.html?slug=${encodeURIComponent(post.slug)}`)}">Read post</a>
        </article>
      `
      )
      .join("");
  } catch (error) {
    wrapper.innerHTML = '<article class="card"><h3>Unable to load posts</h3><p>Please try again later.</p></article>';
  }
};

const setupBlogIndex = async () => {
  const listNode = document.querySelector("[data-blog-list]");
  const searchInput = document.querySelector("[data-blog-search]");
  const tagsNode = document.querySelector("[data-blog-tags]");
  const countNode = document.querySelector("[data-blog-count]");

  if (!listNode || !searchInput || !tagsNode || !countNode) return;

  try {
    const posts = await fetchPosts();
    const uniqueTags = new Set();
    posts.forEach((post) => {
      post.tags.forEach((tag) => uniqueTags.add(tag));
    });

    Array.from(uniqueTags)
      .sort((a, b) => a.localeCompare(b))
      .forEach((tag) => {
        const button = document.createElement("button");
        button.type = "button";
        button.className = "tag-btn";
        button.dataset.tag = tag;
        button.textContent = tag;
        tagsNode.appendChild(button);
      });

    let activeTag = "all";

    const render = () => {
      const query = searchInput.value.trim().toLowerCase();
      const filtered = posts.filter((post) => {
        const matchesTag = activeTag === "all" || post.tags.includes(activeTag);
        const searchText = [post.title, post.summary, post.tags.join(" ")]
          .join(" ")
          .toLowerCase();
        return matchesTag && searchText.includes(query);
      });

      countNode.textContent = `${filtered.length} post${filtered.length === 1 ? "" : "s"}`;

      if (!filtered.length) {
        listNode.innerHTML = '<article class="card"><h3>No matching posts</h3><p>Try a different keyword or tag.</p></article>';
        return;
      }

      listNode.innerHTML = filtered
        .map(
          (post) => `
          <article class="card">
            <h3>${post.title}</h3>
            <p>${post.summary || "No summary available."}</p>
            <p class="meta">${post.displayDate || ""}${post.readingTime ? ` · ${post.readingTime}` : ""}</p>
            <a class="btn" href="${toPath(`blog/post.html?slug=${encodeURIComponent(post.slug)}`)}">Read post</a>
          </article>
        `
        )
        .join("");
    };

    tagsNode.addEventListener("click", (event) => {
      const target = event.target;
      if (!(target instanceof HTMLButtonElement)) return;
      if (!target.dataset.tag) return;

      activeTag = target.dataset.tag;
      tagsNode.querySelectorAll(".tag-btn").forEach((button) => {
        button.classList.toggle("active", button === target);
      });
      render();
    });

    searchInput.addEventListener("input", render);
    render();
  } catch (error) {
    countNode.textContent = "Unable to load posts";
    listNode.innerHTML = '<article class="card"><h3>Unable to load blog</h3><p>Please check your JSON data.</p></article>';
  }
};

const setupBlogPost = async () => {
  const titleNode = document.querySelector("[data-post-title]");
  const metaNode = document.querySelector("[data-post-meta]");
  const deckNode = document.querySelector("[data-post-deck]");
  const bodyNode = document.querySelector("[data-post-body]");

  if (!titleNode || !metaNode || !deckNode || !bodyNode) return;

  const slug = new URLSearchParams(window.location.search).get("slug");
  if (!slug) {
    titleNode.textContent = "Post not found";
    metaNode.textContent = "Missing post slug.";
    bodyNode.innerHTML = "<p>Please open a post from the blog index.</p>";
    return;
  }

  try {
    const posts = await fetchPosts();
    const post = posts.find((item) => item.slug === slug);

    if (!post) {
      titleNode.textContent = "Post not found";
      metaNode.textContent = "The requested post does not exist.";
      bodyNode.innerHTML = "<p>Please return to the blog page and choose another article.</p>";
      return;
    }

    titleNode.textContent = post.title;
    deckNode.textContent = post.deck || post.summary || "";
    metaNode.textContent = `${post.displayDate || ""}${post.readingTime ? ` · ${post.readingTime}` : ""}`;
    bodyNode.innerHTML = post.html || "<p>No content available.</p>";
    document.title = `${post.title} | Muneer Khan`;
  } catch (error) {
    titleNode.textContent = "Unable to load post";
    metaNode.textContent = "Please try again.";
    bodyNode.innerHTML = "<p>There was a problem reading this article.</p>";
  }
};

setYear();
setupMobileMenu();
highlightActiveNav();
setupReveal();
setupRecentPosts();
setupBlogIndex();
setupBlogPost();
