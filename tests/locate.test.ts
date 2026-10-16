import { describe, expect, it } from "vitest";
import { buildTokenIndex, locate, locateFragments, locateRelaxed, locateWithFallback, type Token } from "@/lib/locate";

// Synthetic token stream: render lines of text into positioned tokens.
function tokensFromLines(lines: string[], page = 1, charW = 6, lineH = 12): Token[] {
  const tokens: Token[] = [];
  lines.forEach((line, row) => {
    const yTop = row * lineH + 10;
    const yBot = row * lineH + 2;
    for (let i = 0; i < line.length; i++) {
      const ch = line[i];
      if (ch === " ") continue;
      tokens.push({ ch, page, x0: i * charW, x1: (i + 1) * charW, yTop, yBot });
    }
  });
  return tokens;
}

const DOC = [
  "This Agreement commences on the Effective Date and",
  "continues for an initial term of twelve (12) months.",
  "Thereafter, this Agreement shall automatically renew",
  "for successive twelve (12) month periods unless either",
  "party provides written notice of non-renewal at least",
  "one hundred eighty (180) days prior to the end of the",
  "then-current term.",
];

describe("buildTokenIndex", () => {
  it("builds tokens from per-page text items", () => {
    const items = [[
      { str: "Hello ", width: 36, transform: [12, 0, 0, 12, 10, 50] },
      { str: "World", width: 30, transform: [12, 0, 0, 12, 46, 50] },
    ]];
    const { pages, tokens } = buildTokenIndex(items as never, [{ width: 612, height: 792 }]);
    expect(pages).toEqual([{ page: 1, width: 612, height: 792 }]);
    expect(tokens.map((t) => t.ch).join("")).toBe("Hello World");
    const words = tokens.map((t) => t.ch).join("").split(" ");
    expect(words.filter(Boolean)).toEqual(["Hello", "World"]);
  });
});

describe("locate", () => {
  it("finds a single-line quote and returns one rect", () => {
    const tokens = tokensFromLines(DOC);
    const hit = locate(tokens, "initial term of twelve (12) months");
    expect(hit).not.toBeNull();
    expect(hit!.page).toBe(1);
    expect(hit!.rects).toHaveLength(1);
    expect(hit!.rects[0].x1).toBeGreaterThan(hit!.rects[0].x0);
  });

  it("finds a multi-line quote and merges per line", () => {
    const tokens = tokensFromLines(DOC);
    const hit = locate(tokens, "automatically renew for successive twelve (12) month periods unless");
    expect(hit).not.toBeNull();
    expect(hit!.rects.length).toBeGreaterThanOrEqual(2);
    // lines stack downward
    expect(hit!.rects[1].yTop).toBeGreaterThan(hit!.rects[0].yTop);
  });

  it("is tolerant to whitespace differences", () => {
    const tokens = tokensFromLines(DOC);
    const hit = locate(tokens, "notice of non-renewal  at least one hundred eighty (180) days");
    expect(hit).not.toBeNull();
  });

  it("is case-insensitive", () => {
    const tokens = tokensFromLines(DOC);
    expect(locate(tokens, "AUTOMATICALLY RENEW")).not.toBeNull();
  });

  it("returns null for a missing quote", () => {
    const tokens = tokensFromLines(DOC);
    expect(locate(tokens, "this sentence does not exist in the document")).toBeNull();
  });

  it("returns null for an empty quote", () => {
    const tokens = tokensFromLines(DOC);
    expect(locate(tokens, "   ")).toBeNull();
  });

  it("resolves rects in multi-page documents", () => {
    const tokens = [...tokensFromLines(DOC, 1), ...tokensFromLines(["Provider may modify this Agreement at any time."], 2)];
    const hit = locate(tokens, "Provider may modify this Agreement");
    expect(hit!.page).toBe(2);
  });
});

describe("locateFragments / locateWithFallback", () => {
  it("recovers an ellipsis-truncated quote via its longest fragment", () => {
    const tokens = tokensFromLines(DOC);
    const truncated = "Thereafter, this Agreement shall ... unless either party provides written notice";
    const hit = locateFragments(tokens, truncated);
    expect(hit).not.toBeNull();
  });

  it("locateWithFallback falls back to fragments when the full quote misses", () => {
    const tokens = tokensFromLines(DOC);
    const hit = locateWithFallback(tokens, "no such text ... automatically renew");
    expect(hit).not.toBeNull();
  });

  it("locateWithFallback returns null when nothing matches", () => {
    const tokens = tokensFromLines(DOC);
    expect(locateWithFallback(tokens, "nothing ... matches here")).toBeNull();
  });
});

describe("locateRelaxed", () => {
  it("recovers a quote where the model dropped middle words without ellipsis", () => {
    // doc: "Thereafter, this Agreement shall automatically renew / for successive twelve (12) month periods unless either"
    const tokens = tokensFromLines(DOC);
    const dropped = "this Agreement shall automatically renew unless either party provides notice";
    const hit = locateRelaxed(tokens, dropped);
    expect(hit).not.toBeNull();
    expect(hit!.page).toBe(1);
    expect(hit!.rects.length).toBeGreaterThanOrEqual(1);
  });

  it("returns null when neither half matches", () => {
    const tokens = tokensFromLines(DOC);
    expect(locateRelaxed(tokens, "purple elephant dreams loudly here")).toBeNull();
  });

  it("locateWithFallback uses the relaxed layer", () => {
    const tokens = tokensFromLines(DOC);
    expect(locateWithFallback(tokens, "this Agreement shall automatically renew unless either party")).not.toBeNull();
  });
});
