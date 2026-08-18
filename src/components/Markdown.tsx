// Lightweight markdown renderer for the in-app wiki.
// Supports: headings, paragraphs, bold, inline code, code blocks, lists,
// tables, blockquotes, links, and horizontal rules. Safe (no raw HTML).

function escapeHtml(s: string): string {
  return s
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;");
}

function inline(s: string): string {
  let out = escapeHtml(s);
  // `code`
  out = out.replace(/`([^`]+)`/g, "<code>$1</code>");
  // **bold**
  out = out.replace(/\*\*([^*]+)\*\*/g, "<strong>$1</strong>");
  // *italic*
  out = out.replace(/\*([^*]+)\*/g, "<em>$1</em>");
  // [text](url)
  out = out.replace(/\[([^\]]+)\]\(([^)]+)\)/g, '<a href="$2">$1</a>');
  return out;
}

function renderTable(rows: string[]): string {
  const parse = (line: string) =>
    line
      .trim()
      .replace(/^\||\|$/g, "")
      .split("|")
      .map((c) => c.trim());
  const header = parse(rows[0]);
  const body = rows.slice(2).filter((r) => r.trim());
  let html = "<table><thead><tr>";
  for (const h of header) html += `<th>${inline(h)}</th>`;
  html += "</tr></thead><tbody>";
  for (const r of body) {
    html += "<tr>";
    for (const c of parse(r)) html += `<td>${inline(c)}</td>`;
    html += "</tr>";
  }
  html += "</tbody></table>";
  return html;
}

export function renderMarkdown(md: string): string {
  const lines = md.split("\n");
  const out: string[] = [];
  let i = 0;
  let inCode = false;
  let codeBuf: string[] = [];
  let listBuf: string[] = [];
  let tableBuf: string[] = [];

  const flushList = () => {
    if (listBuf.length) {
      out.push(`<ul>${listBuf.map((li) => `<li>${inline(li)}</li>`).join("")}</ul>`);
      listBuf = [];
    }
  };
  const flushTable = () => {
    if (tableBuf.length) {
      out.push(renderTable(tableBuf));
      tableBuf = [];
    }
  };

  while (i < lines.length) {
    const line = lines[i];

    if (line.trim().startsWith("```")) {
      if (inCode) {
        out.push(`<pre><code>${escapeHtml(codeBuf.join("\n"))}</code></pre>`);
        codeBuf = [];
        inCode = false;
      } else {
        flushList();
        flushTable();
        inCode = true;
      }
      i++;
      continue;
    }
    if (inCode) {
      codeBuf.push(line);
      i++;
      continue;
    }

    const trimmed = line.trim();
    if (!trimmed) {
      flushList();
      flushTable();
      i++;
      continue;
    }

    // Heading
    const h = trimmed.match(/^(#{1,6})\s+(.*)$/);
    if (h) {
      flushList();
      flushTable();
      const level = h[1].length;
      out.push(`<h${level}>${inline(h[2])}</h${level}>`);
      i++;
      continue;
    }

    // Horizontal rule
    if (/^---+$/.test(trimmed)) {
      flushList();
      flushTable();
      out.push("<hr/>");
      i++;
      continue;
    }

    // Table (header row followed by |---| separator)
    if (trimmed.includes("|") && i + 1 < lines.length && /^\s*\|?[\s:|-]+\|?\s*$/.test(lines[i + 1]) && lines[i + 1].includes("-")) {
      flushList();
      tableBuf = [trimmed, lines[i + 1]];
      i += 2;
      while (i < lines.length && lines[i].trim().startsWith("|")) {
        tableBuf.push(lines[i]);
        i++;
      }
      flushTable();
      continue;
    }

    // List item
    if (/^\s*[-*]\s+/.test(trimmed)) {
      flushTable();
      listBuf.push(trimmed.replace(/^\s*[-*]\s+/, ""));
      i++;
      continue;
    }

    // Blockquote
    if (trimmed.startsWith(">")) {
      flushList();
      flushTable();
      out.push(`<blockquote>${inline(trimmed.replace(/^>\s?/, ""))}</blockquote>`);
      i++;
      continue;
    }

    // Paragraph
    flushList();
    flushTable();
    out.push(`<p>${inline(trimmed)}</p>`);
    i++;
  }

  if (inCode) out.push(`<pre><code>${escapeHtml(codeBuf.join("\n"))}</code></pre>`);
  flushList();
  flushTable();

  return out.join("\n");
}

export function Markdown({ source }: { source: string }) {
  return (
    <div
      className="wiki-md"
      dangerouslySetInnerHTML={{ __html: renderMarkdown(source) }}
    />
  );
}
