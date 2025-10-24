# Blog Content

Add new posts by dropping Markdown files in this folder. Every file should include a front matter block like:

```
---
title: "Post Title"
date: 2024-07-01
summary: "Short card summary."
tags:
  - Analytics
  - Product
readingTime: "7 min read"   # optional, auto-calculated when omitted
deck: "One-sentence teaser that shows in the modal."  # optional
---
## Section Heading
Body content in Markdown…
```

### Supported Markdown Extras
- Fenced code blocks using triple backticks.
- Ordered/unordered lists, blockquotes, inline code, and emphasis.
- Math typesetting: use `$inline$` for inline math and wrap block formulas in `$$` fences. The build step preserves the LaTeX and MathJax renders it at runtime.

### Rebuild the JSON feed
After adding or updating posts, regenerate the blog feed and commit both the Markdown and the JSON:

```bash
python3 scripts/build_blog.py
```

The command updates `assets/data/blog-posts.json`, which the site consumes at runtime.
