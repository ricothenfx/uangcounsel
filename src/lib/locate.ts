/**
 * Token-geometry layer: extract every character of a PDF with its position,
 * then locate arbitrary quotes back to line rects. These rects are what the
 * viewer renders as highlight overlays.
 *
 * Coordinates are in PDF viewport space at scale 1 (72dpi), y origin at
 * bottom-left. The viewer converts to CSS pixels with the render viewport.
 */

export type Token = {
  ch: string;
  page: number;
  x0: number;
  x1: number;
  yTop: number;
  yBot: number;
};

export type LineRect = {
  page: number;
  x0: number;
  x1: number;
  yTop: number;
  yBot: number;
};

export type LocatedQuote = {
  page: number;
  rects: LineRect[];
};

const LINE_TOLERANCE = 2; // pt — same visual line
const GAP_THRESHOLD = 0.2; // pt — inter-word gap

type PdfTextItem = { str: string; width: number; transform: number[] };
export type { PdfTextItem };
export type PdfPageInfo = { page: number; width: number; height: number };

/**
 * Build a flat character-token index from pdfjs text content.
 * `pages` is the getTextContent() result array; keeps this function pure and
 * unit-testable without loading a real PDF.
 */
export function buildTokenIndex(
  itemsPerPage: PdfTextItem[][],
  pageDims: { width: number; height: number }[],
): { pages: PdfPageInfo[]; tokens: Token[] } {
  const pages: PdfPageInfo[] = [];
  const tokens: Token[] = [];
  for (let p = 1; p <= itemsPerPage.length; p++) {
    const dim = pageDims[p - 1];
    pages.push({ page: p, width: dim.width, height: dim.height });
    for (const item of itemsPerPage[p - 1]) {
      if (!item.str) continue;
      // pdfjs: transform [a b c d e f]; font height = hypot(c, d), baseline at (e, f)
      const [a, b, c, d, e, f] = item.transform;
      const fontH = Math.hypot(c, d) || Math.hypot(a, b) || 10;
      const x = e;
      const yBaseline = f;
      const n = item.str.length || 1;
      const charW = item.width / n;
      let xCursor = x;
      for (const ch of item.str) {
        if (ch !== " ") {
          tokens.push({
            ch,
            page: p,
            x0: xCursor,
            x1: xCursor + charW,
            yTop: yBaseline + fontH * 0.85,
            yBot: yBaseline - fontH * 0.25,
          });
        } else if (tokens.length && tokens[tokens.length - 1].page === p) {
          // trailing space acts as a word separator marker
          tokens.push({
            ch: " ",
            page: p,
            x0: xCursor,
            x1: xCursor,
            yTop: yBaseline + fontH * 0.85,
            yBot: yBaseline - fontH * 0.25,
          });
        }
        xCursor += charW;
      }
    }
  }
  return { pages, tokens };
}

/**
 * Locate a quote in the token stream → page + one rect per visual line.
 * Handles line breaks, page breaks, and whitespace differences.
 * Returns null when the quote cannot be found.
 */
export function locate(tokens: Token[], quote: string): LocatedQuote | null {
  const norm = quote.replace(/\s+/g, " ").trim().toLowerCase();
  if (!norm) return null;

  type StreamChar = { ch: string; t: Token | null };
  const stream: StreamChar[] = [];
  let prev: Token | null = null;
  for (const raw of tokens) {
    const chNorm = raw.ch.toLowerCase();
    const startsNewLine =
      prev && (raw.page !== prev.page || Math.abs(raw.yTop - prev.yTop) > LINE_TOLERANCE);
    const gap =
      prev &&
      raw.page === prev.page &&
      Math.abs(raw.yTop - prev.yTop) <= LINE_TOLERANCE &&
      raw.x0 - prev.x1 > GAP_THRESHOLD;
    if (stream.length && (startsNewLine || gap) && stream[stream.length - 1].ch !== " ") {
      stream.push({ ch: " ", t: null });
    }
    for (const c of chNorm) {
      if (c === " ") {
        if (stream.length && stream[stream.length - 1].ch !== " ") stream.push({ ch: " ", t: null });
      } else {
        stream.push({ ch: c, t: raw });
      }
    }
    prev = raw;
  }

  const hay = stream.map((s) => s.ch).join("");
  let start = hay.indexOf(norm);

  if (start === -1) {
    // fallback: collapse ALL whitespace (quote may span hyphenation/odd spacing)
    const hayC = hay.replace(/ /g, "");
    const normC = norm.replace(/ /g, "");
    const j = hayC.indexOf(normC);
    if (j === -1) return null;
    // walk the stream back to the original index
    let hi = 0;
    let ci = 0;
    while (hi < stream.length && (ci < j || stream[hi].ch === " ")) {
      if (stream[hi].ch !== " ") ci++;
      hi++;
    }
    start = hi;
  }

  const hits: Token[] = [];
  for (let i = start; i < Math.min(start + norm.length, stream.length); i++) {
    const tok = stream[i].t;
    if (tok) hits.push(tok);
  }
  if (!hits.length) return null;

  // merge tokens into one rect per visual line
  const lines = new Map<string, LineRect>();
  for (const h of hits) {
    const key = `${h.page}:${Math.round(h.yTop * 2) / 2}`;
    const L = lines.get(key);
    if (!L) {
      lines.set(key, { page: h.page, x0: h.x0, x1: h.x1, yTop: h.yTop, yBot: h.yBot });
    } else {
      L.x0 = Math.min(L.x0, h.x0);
      L.x1 = Math.max(L.x1, h.x1);
      L.yTop = Math.min(L.yTop, h.yTop);
      L.yBot = Math.max(L.yBot, h.yBot);
    }
  }
  return { page: hits[0].page, rects: [...lines.values()] };
}

/**
 * Relaxed recovery for quotes where the model silently dropped words in the
 * middle (no ellipsis marker). Finds the longest locating prefix and suffix
 * and merges their rects. Never invents geometry — both halves must exist.
 */
export function locateRelaxed(tokens: Token[], quote: string, minWords = 3): LocatedQuote | null {
  const words = quote.replace(/\s+/g, " ").trim().split(" ");
  if (words.length < minWords) return null;

  let prefix: LocatedQuote | null = null;
  for (let n = words.length; n >= minWords; n--) {
    const hit = locate(tokens, words.slice(0, n).join(" "));
    if (hit) {
      prefix = hit;
      break;
    }
  }
  let suffix: LocatedQuote | null = null;
  for (let s = 0; s <= words.length - minWords; s++) {
    const hit = locate(tokens, words.slice(s).join(" "));
    if (hit) {
      suffix = hit;
      break;
    }
  }

  if (prefix && suffix) {
    const page = prefix.page;
    return { page, rects: [...prefix.rects, ...suffix.rects.filter((r) => r.page === page)] };
  }
  return prefix ?? suffix;
}

/** Locate with automatic fragment fallback. */
export function locateFragments(tokens: Token[], quote: string): LocatedQuote | null {
  const frags = quote
    .split(/\s*(?:\.\.\.|\u2026)\s*/)
    .map((s) => s.replace(/^,+|,+$/g, "").trim())
    .filter((s) => s.split(" ").length >= 2);
  frags.sort((a, b) => b.length - a.length);
  for (const f of frags) {
    const hit = locate(tokens, f);
    if (hit) return hit;
  }
  return null;
}

/** Locate with all recovery strategies: exact → ellipsis fragments → relaxed prefix/suffix. */
export function locateWithFallback(tokens: Token[], quote: string): LocatedQuote | null {
  return locate(tokens, quote) ?? locateFragments(tokens, quote) ?? locateRelaxed(tokens, quote);
}
