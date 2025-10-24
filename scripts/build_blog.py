#!/usr/bin/env python3
import html
import json
import re
from datetime import datetime, timezone
from pathlib import Path

ROOT = Path(__file__).resolve().parent.parent
POSTS_DIR = ROOT / "content" / "blog"
OUTPUT_DIR = ROOT / "assets" / "data"
OUTPUT_FILE = OUTPUT_DIR / "blog-posts.json"

SLUG_PATTERN = re.compile(r"[^a-z0-9\s-]")
INLINE_MATH_RE = re.compile(r"(?<!\$)\$(?!\$)(.+?)(?<!\$)\$(?!\$)")
ORDERED_ITEM_RE = re.compile(r"^(\d+)\.\s+(.*)$")
HEADING_RE = re.compile(r"^(#{2,6})\s+(.*)$")


def slugify(value: str) -> str:
  value = value.lower()
  value = SLUG_PATTERN.sub("", value)
  value = re.sub(r"\s+", "-", value.strip())
  value = re.sub(r"-+", "-", value)
  return value or "section"


def parse_scalar(value: str):
  if value.startswith('"') and value.endswith('"'):
    return value[1:-1]
  if value.startswith("'") and value.endswith("'"):
    return value[1:-1]
  number_match = re.fullmatch(r"-?\d+(?:\.\d+)?", value)
  if number_match:
    try:
      return int(value)
    except ValueError:
      return float(value)
  return value


def parse_front_matter(raw: str):
  if not raw.startswith("---"):
    return {}, raw
  parts = raw.split("---", 2)
  if len(parts) < 3:
    return {}, raw
  front, body = parts[1], parts[2]
  data = {}
  current_key = None
  for line in front.strip().splitlines():
    line = line.rstrip()
    if not line:
      continue
    if re.match(r"^[^\s].*?:", line):
      key, _, rest = line.partition(":")
      key = key.strip()
      rest = rest.strip()
      if rest:
        data[key] = parse_scalar(rest)
        current_key = None
      else:
        data[key] = []
        current_key = key
    elif current_key and line.strip().startswith("-"):
      data[current_key].append(parse_scalar(line.strip()[1:].strip()))
  return data, body


def inline_markdown(text: str) -> str:
  text = html.escape(text, quote=False)
  text = INLINE_MATH_RE.sub(lambda m: f'<span class="math-inline">{m.group(1).strip()}</span>', text)
  text = re.sub(r"\*\*([^*]+)\*\*", r"<strong>\1</strong>", text)
  text = re.sub(r"\*([^*]+)\*", r"<em>\1</em>", text)
  text = re.sub(r"`([^`]+)`", lambda m: f"<code>{m.group(1)}</code>", text)
  text = re.sub(
    r"\[([^\]]+)\]\(([^)]+)\)",
    lambda m: f'<a href="{html.escape(m.group(2), quote=True)}" target="_blank" rel="noreferrer">{m.group(1)}</a>',
    text,
  )
  return text


def markdown_to_html(markdown: str) -> str:
  lines = markdown.splitlines()
  html_parts = []
  paragraph = []
  list_type = None
  blockquote = False
  code_block = False
  code_lang = ""
  code_lines = []
  math_block = False
  math_lines = []

  def flush_paragraph():
    nonlocal paragraph
    if paragraph:
      html_parts.append(f"<p>{inline_markdown(' '.join(paragraph))}</p>")
      paragraph = []

  def open_list(kind: str):
    nonlocal list_type
    if list_type == kind:
      return
    close_list()
    list_type = kind
    html_parts.append(f"<{kind}>")

  def close_list():
    nonlocal list_type
    if list_type:
      html_parts.append(f"</{list_type}>")
      list_type = None

  def open_blockquote():
    nonlocal blockquote
    if not blockquote:
      html_parts.append("<blockquote>")
      blockquote = True

  def close_blockquote():
    nonlocal blockquote
    if blockquote:
      html_parts.append("</blockquote>")
      blockquote = False

  def close_code_block():
    nonlocal code_block, code_lines, code_lang
    if code_block:
      escaped = html.escape("\n".join(code_lines))
      lang_class = f' class="language-{code_lang}"' if code_lang else ""
      html_parts.append(f"<pre><code{lang_class}>{escaped}</code></pre>")
      code_block = False
      code_lines = []
      code_lang = ""

  def close_math_block():
    nonlocal math_block, math_lines
    if math_block:
      content = "\n".join(math_lines).strip()
      html_parts.append(f'<div class="math-display">{content}</div>')
      math_block = False
      math_lines = []

  def close_blocks():
    flush_paragraph()
    close_list()
    close_blockquote()

  for raw_line in lines:
    stripped = raw_line.strip()

    if code_block:
      if stripped.startswith("```"):
        close_code_block()
      else:
        code_lines.append(raw_line)
      continue

    if math_block:
      if stripped.endswith("$$"):
        math_lines.append(raw_line[: raw_line.rfind("$$")])
        close_math_block()
      else:
        math_lines.append(raw_line)
      continue

    if not stripped:
      close_blocks()
      continue

    if stripped.startswith("```"):
      close_blocks()
      close_math_block()
      code_block = True
      code_lang = stripped[3:].strip()
      code_lines = []
      continue

    if stripped.startswith("$$"):
      close_blocks()
      close_code_block()
      math_content = stripped[2:]
      if math_content.endswith("$$") and len(math_content) > 2:
        html_parts.append(f'<div class="math-display">{math_content[:-2].strip()}</div>')
      else:
        math_block = True
        math_lines = [math_content]
      continue

    if stripped.startswith("<"):
      close_blocks()
      close_code_block()
      close_math_block()
      html_parts.append(raw_line)
      continue

    heading_match = HEADING_RE.match(stripped)
    if heading_match:
      close_blocks()
      close_code_block()
      close_math_block()
      level = len(heading_match.group(1))
      text = heading_match.group(2).strip()
      html_parts.append(f'<h{level} id="{slugify(text)}">{inline_markdown(text)}</h{level}>')
      continue

    ordered_match = ORDERED_ITEM_RE.match(stripped)
    if ordered_match:
      flush_paragraph()
      close_blockquote()
      close_math_block()
      open_list("ol")
      html_parts.append(f"<li>{inline_markdown(ordered_match.group(2).strip())}</li>")
      continue

    if stripped.startswith("- "):
      flush_paragraph()
      close_blockquote()
      close_math_block()
      open_list("ul")
      html_parts.append(f"<li>{inline_markdown(stripped[2:].strip())}</li>")
      continue

    if stripped.startswith("> "):
      flush_paragraph()
      close_list()
      close_math_block()
      open_blockquote()
      html_parts.append(f"<p>{inline_markdown(stripped[2:].strip())}</p>")
      continue

    paragraph.append(stripped)

  close_blocks()
  close_code_block()
  close_math_block()
  return "".join(html_parts)


def estimate_reading_time(text: str) -> str:
  words = [w for w in re.split(r"\s+", text) if w]
  minutes = max(1, round(len(words) / 225))
  return f"{minutes} min read"


def load_posts():
  if not POSTS_DIR.exists():
    raise SystemExit(f"Posts directory not found: {POSTS_DIR}")

  posts = []
  for path in sorted(POSTS_DIR.glob("*.md")):
    if path.name.lower() == "readme.md":
      continue
    raw = path.read_text(encoding="utf-8")
    frontmatter, body = parse_front_matter(raw)
    body = body.strip()
    slug_source = frontmatter.get("slug") or frontmatter.get("title") or path.stem
    slug = slugify(slug_source)

    html_content = markdown_to_html(body)
    reading_time = frontmatter.get("readingTime") or estimate_reading_time(body)
    date_value = str(frontmatter.get("date") or "").strip()
    display_date = date_value
    if date_value:
      try:
        dt = datetime.fromisoformat(date_value)
        display_date = f"{dt.strftime('%B')} {dt.day}, {dt.year}"
      except ValueError:
        pass

    tags = frontmatter.get("tags")
    if isinstance(tags, list):
      tags = [str(tag) for tag in tags]
    else:
      tags = []

    posts.append(
      {
        "slug": slug,
        "title": frontmatter.get("title") or slug,
        "date": date_value or None,
        "displayDate": display_date if display_date else None,
        "summary": frontmatter.get("summary") or "",
        "tags": tags,
        "readingTime": reading_time,
        "deck": frontmatter.get("deck") or "",
        "html": html_content,
      }
    )

  posts.sort(
    key=lambda item: datetime.fromisoformat(item["date"]) if item["date"] else datetime.min,
    reverse=True,
  )
  return posts


def main():
  posts = load_posts()
  OUTPUT_DIR.mkdir(parents=True, exist_ok=True)
  payload = {
    "generatedAt": datetime.now(timezone.utc).isoformat(timespec="seconds").replace("+00:00", "Z"),
    "posts": posts,
  }
  OUTPUT_FILE.write_text(json.dumps(payload, indent=2), encoding="utf-8")
  print(f"Generated {len(posts)} blog post entry(s) → {OUTPUT_FILE.relative_to(ROOT)}")


if __name__ == "__main__":
  main()
