import { describe, expect, it } from "vitest";
import { readFileSync, existsSync } from "node:fs";
import { SAMPLES } from "@/lib/samples";
import analyses from "@/data/samples/analyses.json";

describe("sample contracts", () => {
  it("each sample has a PDF shipped in public/", () => {
    for (const s of SAMPLES) {
      expect(existsSync(`public/contracts/${s.id}.pdf`), `${s.id}.pdf`).toBe(true);
    }
  });

  it("each sample has a precomputed analysis with 3-9 valid clauses", () => {
    const byId = analyses as Record<string, { summary: string; clauses: { title: string; quote: string; risk: string }[] }>;
    for (const s of SAMPLES) {
      const a = byId[s.id];
      expect(a, `analysis for ${s.id}`).toBeTruthy();
      expect(a.clauses.length).toBeGreaterThanOrEqual(3);
      expect(a.clauses.length).toBeLessThanOrEqual(9);
      for (const c of a.clauses) {
        expect(["low", "medium", "high"]).toContain(c.risk);
        expect(c.quote.length).toBeGreaterThan(10);
      }
    }
  });

  it("every sample PDF contains real text (not scanned)", async () => {
    const { extractPdf } = await import("@/lib/pdf");
    for (const s of SAMPLES) {
      const bytes = new Uint8Array(readFileSync(`public/contracts/${s.id}.pdf`));
      const extracted = await extractPdf(bytes);
      expect(extracted.text.length).toBeGreaterThan(400);
    }
  }, 30_000);
});
