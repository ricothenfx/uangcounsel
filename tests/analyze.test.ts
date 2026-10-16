import { describe, expect, it } from "vitest";
import { AnalysisSchema, riskCounts } from "@/lib/analyze";

const clause = (over: Partial<{ title: string; category: string; risk: string; quote: string }> = {}) => ({
  title: "Auto-renewal",
  category: "renewal",
  risk: "high",
  quote: "this Agreement shall automatically renew for successive periods",
  why: "Easy to miss the exit window.",
  suggestion: "Reduce the notice period to 30 days.",
  ...over,
});

const VALID = {
  summary: "Significant one-sided terms.",
  clauses: [clause(), clause({ title: "Indemnity", category: "indemnification" }), clause({ title: "Liability cap", category: "liability", risk: "medium" })],
};

describe("AnalysisSchema", () => {
  it("accepts a valid payload", () => {
    const r = AnalysisSchema.safeParse(VALID);
    expect(r.success).toBe(true);
  });

  it("normalizes capitalized risk values", () => {
    const r = AnalysisSchema.parse({ ...VALID, clauses: VALID.clauses.map((c, i) => (i === 0 ? { ...c, risk: "High" } : c)) });
    expect(r.clauses[0].risk).toBe("high");
  });

  it("maps unknown categories to other", () => {
    const r = AnalysisSchema.parse({ ...VALID, clauses: VALID.clauses.map((c, i) => (i === 0 ? { ...c, category: "weird-stuff" } : c)) });
    expect(r.clauses[0].category).toBe("other");
  });

  it("defaults missing summary to empty", () => {
    const noSummary = { clauses: VALID.clauses };
    const r = AnalysisSchema.parse(noSummary);
    expect(r.summary).toBe("");
  });

  it("rejects clauses with a too-short quote", () => {
    const bad = { ...VALID, clauses: VALID.clauses.map((c, i) => (i === 0 ? { ...c, quote: "short" } : c)) };
    expect(AnalysisSchema.safeParse(bad).success).toBe(false);
  });

  it("rejects fewer than 3 clauses", () => {
    expect(AnalysisSchema.safeParse({ clauses: [] }).success).toBe(false);
  });

  it("rejects non-JSON garbage at the parse boundary", () => {
    expect(AnalysisSchema.safeParse({ clauses: "all of them" }).success).toBe(false);
  });
});

describe("riskCounts", () => {
  it("counts by risk", () => {
    expect(riskCounts([{ risk: "high" }, { risk: "high" }, { risk: "low" }])).toEqual({
      high: 2,
      medium: 0,
      low: 1,
    });
  });
});
