/**
 * Clause-analysis pipeline: PDF text → LLM (exact-shape JSON + zod validation +
 * one repair retry) → locate each quote in the document → highlight payload.
 *
 * Proven patterns from the spike (all verified):
 * - openai-compatible endpoints fall back to json_object mode (no schema
 *   enforcement) → the exact JSON shape is spelled out in the prompt instead
 * - models occasionally ellipsize quotes → locateFragments() fallback
 * - enum drift → lenient normalization (lowercase) before strict validation
 */
import { generateText } from "ai";
import { createOpenAICompatible } from "@ai-sdk/openai-compatible";
import { z } from "zod";
import { buildTokenIndex, locateWithFallback, type LocatedQuote } from "./locate";
import { pdfToText, type ExtractedPdf } from "./pdf";

export const RISKS = ["low", "medium", "high"] as const;
export type Risk = (typeof RISKS)[number];

export const CATEGORIES = [
  "termination",
  "liability",
  "payment",
  "confidentiality",
  "renewal",
  "amendment",
  "governing_law",
  "indemnification",
  "ip",
  "data",
  "other",
] as const;
export type Category = (typeof CATEGORIES)[number];

export const ClauseSchema = z.object({
  title: z.string().min(2).max(80),
  category: z.string().transform((s) => s.toLowerCase().trim()),
  risk: z.string().transform((s) => s.toLowerCase().trim()),
  quote: z.string().min(10).max(400),
  why: z.string().min(10).max(500),
  suggestion: z.string().min(10).max(500),
});

export const AnalysisSchema = z.object({
  summary: z.string().max(1200).optional().default(""),
  clauses: z
    .array(ClauseSchema)
    .min(3)
    .max(9)
    .transform((clauses) =>
      clauses.map((c) => ({
        ...c,
        category: (CATEGORIES as readonly string[]).includes(c.category)
          ? (c.category as Category)
          : ("other" as Category),
        risk: (RISKS as readonly string[]).includes(c.risk) ? (c.risk as Risk) : ("medium" as Risk),
      })),
    ),
});

export type Clause = z.infer<typeof AnalysisSchema>["clauses"][number];
export type Analysis = { summary: string; clauses: Clause[] };

export type HighlightedClause = Clause & { location: LocatedQuote | null };
export type AnalyzedDocument = {
  summary: string;
  clauses: HighlightedClause[];
  numPages: number;
  generatedBy: "llm" | "cached";
};

export function llmConfigured(): boolean {
  return Boolean(process.env.LLM_BASE_URL && process.env.LLM_API_KEY && process.env.LLM_MODEL);
}

function model() {
  const provider = createOpenAICompatible({
    name: "provider",
    baseURL: process.env.LLM_BASE_URL!,
    apiKey: process.env.LLM_API_KEY!,
  });
  return provider(process.env.LLM_MODEL!);
}

function withTimeout<T>(p: Promise<T>, ms: number): Promise<T> {
  return Promise.race([p, new Promise<never>((_, rej) => setTimeout(() => rej(new Error("llm timeout")), ms))]);
}

const SHAPE =
  '{"summary":"2-3 sentence overall risk assessment","clauses":[{"title":"Auto-renewal","category":"renewal","risk":"high","quote":"verbatim excerpt max 25 words word-for-word","why":"1 sentence, business impact","suggestion":"1 sentence negotiation ask"}]}';

export function analysisPrompt(docText: string): string {
  return (
    `You are a senior commercial contracts analyst reviewing from the CLIENT's perspective. ` +
    `Respond ONLY with minified JSON exactly matching this shape:\n${SHAPE}\n\n` +
    `Rules:\n` +
    `- Extract 4-8 notable clauses. Prioritize one-sided or unusual terms.\n` +
    `- risk must be one of: low | medium | high\n` +
    `- category must be one of: ${CATEGORIES.join(" | ")}\n` +
    `- "quote" MUST be a VERBATIM excerpt from the document, max 25 words, NEVER truncate ` +
    `mid-sentence with "..." (using only the start of a sentence is fine)\n` +
    `- "why" and "suggestion" must be plain text, no markdown\n\n` +
    `DOCUMENT:\n${docText}`
  );
}

/** Run the LLM extraction with one repair retry. Returns null when both attempts fail. */
export async function runLlmAnalysis(docText: string): Promise<Analysis | null> {
  if (!llmConfigured()) return null;
  let lastRaw = "";
  for (let attempt = 1; attempt <= 2; attempt++) {
    try {
      const { text } = await withTimeout(
        generateText({
          model: model(),
          maxOutputTokens: 1600,
          prompt:
            attempt === 1
              ? analysisPrompt(docText)
              : `Your previous JSON failed validation. Fix it. Respond ONLY with minified JSON in this exact shape:\n${SHAPE}\n\nRemember: verbatim quotes, lowercase risk/category from the allowed lists.\n\nINVALID PREVIOUS OUTPUT:\n${lastRaw.slice(0, 1200)}\n\nDOCUMENT:\n${docText}`,
        }),
        30_000,
      );
      lastRaw = text;
      const cleaned = text.replace(/^```json\s*/i, "").replace(/```\s*$/, "").trim();
      const parsed = AnalysisSchema.safeParse(JSON.parse(cleaned));
      if (parsed.success) {
        return { summary: parsed.data.summary ?? "", clauses: parsed.data.clauses };
      }
    } catch {
      // retry once, then give up (caller decides fallback)
    }
  }
  return null;
}

/** Full pipeline for an extracted PDF: LLM + quote location. */
export async function analyzeExtracted(
  extracted: ExtractedPdf,
  opts: { generatedBy?: "llm" | "cached" } = {},
): Promise<AnalyzedDocument> {
  const { itemsPerPage, pageDims } = extracted;
  const { tokens } = buildTokenIndex(itemsPerPage, pageDims);

  const generatedBy: "llm" | "cached" = opts.generatedBy ?? "llm";
  let analysis: Analysis | null = null;

  if (llmConfigured()) {
    analysis = await runLlmAnalysis(pdfToText(itemsPerPage));
  }
  if (!analysis) {
    throw new Error("analysis-unavailable");
  }

  const clauses: HighlightedClause[] = analysis.clauses.map((c) => ({
    ...c,
    location: locateWithFallback(tokens, c.quote),
  }));

  return {
    summary: analysis.summary,
    clauses,
    numPages: extracted.numPages,
    generatedBy,
  };
}

/** Attach locations to a cached (precomputed) analysis. */
export function locateCached(
  cached: Analysis,
  extracted: ExtractedPdf,
): AnalyzedDocument {
  const { itemsPerPage, pageDims } = extracted;
  const { tokens } = buildTokenIndex(itemsPerPage, pageDims);
  const clauses: HighlightedClause[] = cached.clauses.map((c) => ({
    ...c,
    location: locateWithFallback(tokens, c.quote),
  }));
  return {
    summary: cached.summary,
    clauses,
    numPages: extracted.numPages,
    generatedBy: "cached",
  };
}

export function riskCounts(clauses: { risk: Risk }[]): Record<Risk, number> {
  const counts: Record<Risk, number> = { high: 0, medium: 0, low: 0 };
  for (const c of clauses) counts[c.risk]++;
  return counts;
}
