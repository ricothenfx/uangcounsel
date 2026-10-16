import { NextResponse } from "next/server";
import { z } from "zod";
import { extractPdf } from "@/lib/pdf";
import { analyzeExtracted, locateCached, llmConfigured, type Analysis } from "@/lib/analyze";
import { getSample } from "@/lib/samples";
import cachedAnalyses from "@/data/samples/analyses.json";
import { SAMPLE_PDF_BASE64 } from "@/data/samples/pdfs";

export const runtime = "nodejs";
export const maxDuration = 60;

const MAX_BYTES = 8 * 1024 * 1024;
const MAX_PAGES = 40;

const BodySchema = z.union([
  z.object({ sampleId: z.string().min(1).max(60) }),
  z.object({ pdfBase64: z.string().min(100) }),
]);

// naive per-IP rate limit (demo-grade; a real deployment uses edge KV)
const hits = new Map<string, { n: number; reset: number }>();
const WINDOW_MS = 60_000;
const MAX_PER_WINDOW = 10;

function rateLimited(ip: string): boolean {
  const now = Date.now();
  const rec = hits.get(ip);
  if (!rec || rec.reset < now) {
    hits.set(ip, { n: 1, reset: now + WINDOW_MS });
    return false;
  }
  rec.n += 1;
  return rec.n > MAX_PER_WINDOW;
}

export async function POST(req: Request) {
  const ip =
    req.headers.get("x-forwarded-for")?.split(",")[0]?.trim() ??
    req.headers.get("x-real-ip") ??
    "local";
  if (rateLimited(ip)) {
    return NextResponse.json({ error: "Too many analyses from this address — try again in a minute." }, { status: 429 });
  }

  let body: unknown;
  try {
    body = await req.json();
  } catch {
    return NextResponse.json({ error: "Invalid JSON" }, { status: 400 });
  }
  const parsed = BodySchema.safeParse(body);
  if (!parsed.success) {
    return NextResponse.json({ error: "Send { sampleId } or { pdfBase64 }." }, { status: 400 });
  }

  try {
    if ("sampleId" in parsed.data) {
      const sample = getSample(parsed.data.sampleId);
      if (!sample) return NextResponse.json({ error: "Unknown sample." }, { status: 404 });
      const cached = (cachedAnalyses as Record<string, Analysis>)[sample.id];
      if (!cached) return NextResponse.json({ error: "No cached analysis for this sample." }, { status: 500 });

      const b64 = SAMPLE_PDF_BASE64[sample.id];
      if (!b64) return NextResponse.json({ error: "Sample PDF missing." }, { status: 500 });
      const bytes = Uint8Array.from(Buffer.from(b64, "base64"));
      const extracted = await extractPdf(bytes);
      const result = locateCached(cached, extracted);
      return NextResponse.json({ ...result, analysisMs: 0 });
    }

    // uploaded PDF → live analysis (requires an LLM endpoint)
    if (!llmConfigured()) {
      return NextResponse.json(
        { error: "Live analysis needs an LLM endpoint (LLM_* env vars). The sample contracts work without one — every sample ships with a precomputed analysis.", code: "no-llm" },
        { status: 503 },
      );
    }
    const b64 = parsed.data.pdfBase64.replace(/^data:application\/pdf;base64,/, "");
    const bytes = Uint8Array.from(Buffer.from(b64, "base64"));
    if (bytes.byteLength > MAX_BYTES) {
      return NextResponse.json({ error: "PDF too large (max 8 MB)." }, { status: 413 });
    }
    if (bytes.byteLength < 100 || String.fromCharCode(...bytes.subarray(0, 5)) !== "%PDF-") {
      return NextResponse.json({ error: "That file is not a valid PDF." }, { status: 422 });
    }
    const t0 = Date.now();
    const extracted = await extractPdf(bytes);
    if (extracted.numPages > MAX_PAGES) {
      return NextResponse.json({ error: `PDF too long (max ${MAX_PAGES} pages).` }, { status: 413 });
    }
    if (extracted.text.length < 400) {
      return NextResponse.json({ error: "This PDF has almost no extractable text — scanned documents are not supported (text-based PDFs only)." }, { status: 422 });
    }
    const result = await analyzeExtracted(extracted, { generatedBy: "llm" });
    return NextResponse.json({ ...result, analysisMs: Date.now() - t0 });
  } catch (e) {
    console.error("[analyze] failed:", e);
    const detail = e instanceof Error ? e.message : String(e);
    const msg = detail === "analysis-unavailable"
      ? "The LLM endpoint failed or returned an unusable answer twice. Try again, or open a sample (precomputed)."
      : "Could not process that PDF.";
    return NextResponse.json({ error: msg, detail }, { status: 500 });
  }
}
