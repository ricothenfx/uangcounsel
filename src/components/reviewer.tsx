"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import type { PDFDocumentProxy } from "pdfjs-dist";
import { SAMPLES, type SampleMeta } from "@/lib/samples";
import type { AnalyzedDocument, Risk } from "@/lib/analyze";
import { useI18n } from "@/lib/i18n/provider";

const RISK_ORDER: Risk[] = ["high", "medium", "low"];
const HL_CLASS: Record<Risk, string> = { high: "hl-high", medium: "hl-medium", low: "hl-low" };

type HighlightBox = {
  clause: number;
  risk: Risk;
  left: number;
  top: number;
  width: number;
  height: number;
};
type PageRender = { canvas: HTMLCanvasElement; width: number; height: number; hl: HighlightBox[] };

export function Reviewer() {
  const { dict, t } = useI18n();
  const r = dict.reviewer;

  const [busy, setBusy] = useState(false);
  const [stage, setStage] = useState(0);
  const [error, setError] = useState<string | null>(null);
  const [notice, setNotice] = useState<string | null>(null);
  const [docLabel, setDocLabel] = useState<string | null>(null);
  const [analysis, setAnalysis] = useState<AnalyzedDocument | null>(null);
  const [analysisMs, setAnalysisMs] = useState<number | null>(null);
  const [activeClause, setActiveClause] = useState<number | null>(null);
  const [pages, setPages] = useState<PageRender[]>([]);
  const [copied, setCopied] = useState(false);

  const docHostRef = useRef<HTMLDivElement>(null);
  const pdfDocRef = useRef<PDFDocumentProxy | null>(null);
  const stageTimer = useRef<ReturnType<typeof setInterval> | null>(null);

  // ---- pdf.js (browser build, loaded lazily) ----
  const loadPdfjs = useCallback(async () => {
    const pdfjs = await import("pdfjs-dist");
    pdfjs.GlobalWorkerOptions.workerSrc = "/pdf.worker.min.mjs";
    return pdfjs;
  }, []);

  const renderPages = useCallback(async (buf: Uint8Array, container: HTMLElement, doc: AnalyzedDocument | null) => {
    const pdfjs = await loadPdfjs();
    const loaded = await pdfjs.getDocument({ data: buf.slice() }).promise;
    pdfDocRef.current = loaded;
    const targetW = Math.min(container.clientWidth, 720);
    const renders: PageRender[] = [];
    for (let p = 1; p <= loaded.numPages; p++) {
      const page = await loaded.getPage(p);
      const base = page.getViewport({ scale: 1 });
      const scale = targetW / base.width;
      const viewport = page.getViewport({ scale: scale * Math.min(2, window.devicePixelRatio || 1) });
      const canvas = document.createElement("canvas");
      canvas.width = viewport.width;
      canvas.height = viewport.height;
      canvas.style.width = "100%";
      canvas.style.height = "auto";
      canvas.style.display = "block";
      await page.render({ canvasContext: canvas.getContext("2d")!, canvas, viewport }).promise;
      // precompute CSS-space highlight rects for this page
      const hl: HighlightBox[] = [];
      if (doc) {
        doc.clauses.forEach((c, ci) => {
          if (!c.location || c.location.page !== p) return;
          for (const rect of c.location!.rects) {
            hl.push({
              clause: ci,
              risk: c.risk,
              left: rect.x0 * scale,
              top: (base.height - rect.yTop) * scale,
              width: (rect.x1 - rect.x0) * scale,
              height: Math.max(6, (rect.yTop - rect.yBot) * scale),
            });
          }
        });
      }
      renders.push({ canvas, width: base.width, height: base.height, hl });
    }
    setPages(renders);
  }, [loadPdfjs]);

  const startStages = useCallback(() => {
    setStage(0);
    stageTimer.current = setInterval(() => {
      setStage((s) => Math.min(s + 1, r.stages.length - 1));
    }, 1600);
  }, [r]);
  const stopStages = () => {
    if (stageTimer.current) clearInterval(stageTimer.current);
    stageTimer.current = null;
  };

  const analyze = useCallback(async (payload: { sampleId: string } | { pdfBase64: string }, label: string, buf: Uint8Array | null) => {
    setBusy(true);
    setError(null);
    setNotice(null);
    setAnalysis(null);
    setPages([]);
    setActiveClause(null);
    setDocLabel(label);
    startStages();
    try {
      const res = await fetch("/api/analyze", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });
      const data = await res.json();
      if (!res.ok) {
        setError(data.error ?? r.analysisFailed);
        if (data.code === "no-llm") setNotice(r.noLlmTip);
        return;
      }
      const result = data as AnalyzedDocument;
      setAnalysis(result);
      setAnalysisMs(data.analysisMs ?? null);
      // samples: fetch the shipped PDF so the document renders alongside its analysis
      if (!buf && "sampleId" in payload) {
        const pdfRes = await fetch(`/contracts/${payload.sampleId}.pdf`);
        const ab = await pdfRes.arrayBuffer();
        buf = new Uint8Array(ab);
      }
      if (buf) await renderPages(buf, docHostRef.current!, result);
    } catch {
      setError(r.networkError);
    } finally {
      stopStages();
      setBusy(false);
    }
  }, [renderPages, r, startStages]);

  const onSample = (s: SampleMeta) => {
    void analyze({ sampleId: s.id }, dict.samples[s.id].title, null);
  };

  const onUpload = async (file: File) => {
    if (!file.name.toLowerCase().endsWith(".pdf")) {
      setError(r.choosePdf);
      return;
    }
    const buf = new Uint8Array(await file.arrayBuffer());
    if (buf.byteLength > 8 * 1024 * 1024) {
      setError(r.tooLarge);
      return;
    }
    let b64 = "";
    const chunk = 0x8000;
    for (let i = 0; i < buf.length; i += chunk) {
      b64 += String.fromCharCode(...buf.subarray(i, i + chunk));
    }
    void analyze({ pdfBase64: `data:application/pdf;base64,${btoa(b64)}` }, file.name, buf);
  };

  const focusClause = (i: number) => {
    setActiveClause(i);
    const el = docHostRef.current?.querySelector(`[data-clause="${i}"]`);
    if (el) {
      el.scrollIntoView({ behavior: "smooth", block: "center" });
      el.classList.remove("hl-pulse");
      void (el as HTMLElement).offsetWidth;
      el.classList.add("hl-pulse");
    }
  };

  const copySummary = async () => {
    if (!analysis) return;
    const md = [
      `# ${t(r.copyTitle, { doc: docLabel ?? "" })}`,
      analysis.summary ? `\n${analysis.summary}\n` : "",
      ...analysis.clauses.map((c, i) =>
        `## ${i + 1}. [${c.risk.toUpperCase()}] ${c.title}\n` +
        `- ${r.copyExcerpt}: "${c.quote}"\n` +
        `- ${r.copyWhy}: ${c.why}\n` +
        `- ${r.copyAsk}: ${c.suggestion}\n`),
      `_${r.copyDisclaimer}_`,
    ].join("\n");
    await navigator.clipboard.writeText(md);
    setCopied(true);
    setTimeout(() => setCopied(false), 1800);
  };

  useEffect(() => () => stopStages(), []);

  const counts = analysis
    ? RISK_ORDER.map((risk) => ({ risk, n: analysis.clauses.filter((c) => c.risk === risk).length }))
    : [];

  return (
    <div className="grid gap-6" id="review">
      {/* ---- controls ---- */}
      <div className="card p-5 sm:p-6">
        <div className="flex flex-wrap items-center gap-3">
          <span className="text-sm font-medium">{r.trySample}</span>
          <div className="flex flex-wrap gap-2">
            {SAMPLES.map((s) => (
              <button
                key={s.id}
                type="button"
                onClick={() => onSample(s)}
                disabled={busy}
                className={`rounded-lg border px-3 py-1.5 text-sm transition-colors disabled:opacity-50 ${
                  docLabel === dict.samples[s.id].title
                    ? "border-accent bg-accent-soft text-fg"
                    : "border-line bg-card hover:bg-card-2"
                }`}
              >
                {dict.samples[s.id].type.split(" · ")[0]}
              </button>
            ))}
          </div>
          <label className="ml-auto cursor-pointer rounded-lg bg-brand px-4 py-2 text-sm font-semibold text-brand-fg hover:opacity-90 transition-opacity">
            {r.upload}
            <input
              type="file"
              accept="application/pdf,.pdf"
              className="hidden"
              onChange={(e) => {
                const f = e.target.files?.[0];
                if (f) void onUpload(f);
                e.target.value = "";
              }}
            />
          </label>
        </div>
        <p className="mt-2 text-xs text-muted">{r.samplesNote}</p>
      </div>

      {/* ---- progress / error ---- */}
      {busy ? (
        <div className="card overflow-hidden p-0">
          <div className="h-1 shimmer" />
          <div className="p-5">
            <p className="text-sm font-medium">{r.stages[stage]}</p>
            <div className="mt-3 space-y-2" aria-hidden>
              {[0, 1, 2].map((i) => (
                <div key={i} className="h-3 rounded bg-card-2" style={{ width: `${88 - i * 18}%` }} />
              ))}
            </div>
          </div>
        </div>
      ) : null}
      {error ? (
        <div className="card border-bad/50 p-4 text-sm">
          <p className="font-medium text-bad">{error}</p>
          {notice ? <p className="mt-1 text-muted">{notice}</p> : null}
        </div>
      ) : null}

      {/* ---- result ---- */}
      {analysis ? (
        <div className="reveal grid gap-6 lg:grid-cols-[minmax(0,1fr)_400px]">
          {/* document */}
          <div className="card overflow-hidden p-0">
            <div className="flex items-center justify-between border-b border-line px-4 py-3">
              <div className="min-w-0">
                <p className="truncate text-sm font-semibold">{docLabel}</p>
                <p className="text-xs text-muted">
                  {t(r.pages, { n: analysis.numPages })} ·{" "}
                  {analysis.generatedBy === "cached"
                    ? r.precomputed
                    : analysisMs
                      ? t(r.liveAnalysis, { s: (analysisMs / 1000).toFixed(1) })
                      : r.live}{" "}
                  · {r.flagsNote}
                </p>
              </div>
              <button
                type="button"
                onClick={() => void copySummary()}
                className="shrink-0 rounded-lg border border-line px-3 py-1.5 text-xs hover:bg-card-2 transition-colors"
              >
                {copied ? r.copied : r.copySummary}
              </button>
            </div>
            <div ref={docHostRef} className="max-h-[70vh] space-y-4 overflow-y-auto bg-card-2 p-4">
              {pages.map((pr, pIdx) => (
                <div key={pIdx} className="page-wrap" style={{ maxWidth: 720 }}>
                  <div className="relative" style={{ aspectRatio: `${pr.width}/${pr.height}` }}>
                    <div
                      ref={(host) => {
                        if (host && host.firstElementChild !== pr.canvas) host.replaceChildren(pr.canvas);
                      }}
                    />
                    {pr.hl.map((h, hi) => (
                      <div
                        key={hi}
                        data-clause={h.clause}
                        className={`hl ${HL_CLASS[h.risk]} ${activeClause === h.clause ? "hl-pulse" : ""}`}
                        style={{ left: h.left, top: h.top, width: h.width, height: h.height }}
                      />
                    ))}
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* findings */}
          <div className="space-y-4">
            <div className="card p-4">
              {analysis.summary ? (
                <p className="text-sm leading-relaxed">{analysis.summary}</p>
              ) : (
                <p className="text-sm text-muted">{t(r.noClauses, { n: analysis.clauses.length })}</p>
              )}
              <div className="mt-3 flex gap-2">
                {counts.map(({ risk, n }) =>
                  n ? (
                    <span
                      key={risk}
                      className={`rounded-full border px-2.5 py-1 text-xs ${
                        risk === "high" ? "border-bad/40 text-bad" :
                        risk === "medium" ? "border-warn/40 text-warn" :
                        "border-ok/40 text-ok"
                      }`}
                    >
                      {n} × {r.riskLabel[risk]}
                    </span>
                  ) : null,
                )}
              </div>
            </div>

            <div className="space-y-3">
              {analysis.clauses
                .map((c, i) => ({ c, i }))
                .sort((a, b) => RISK_ORDER.indexOf(a.c.risk) - RISK_ORDER.indexOf(b.c.risk))
                .map(({ c, i }) => (
                  <button
                    key={i}
                    type="button"
                    onClick={() => focusClause(i)}
                    className={`clause-card block w-full rounded-xl border bg-card p-4 text-left ${
                      activeClause === i ? "border-accent" : "border-line"
                    }`}
                  >
                    <div className="flex items-center gap-2">
                      <span
                        className={`rounded-full px-2 py-0.5 text-[10px] font-bold uppercase tracking-wider ${
                          c.risk === "high" ? "bg-bad/10 text-bad" :
                          c.risk === "medium" ? "bg-warn/10 text-warn" :
                          "bg-ok/10 text-ok"
                        }`}
                      >
                        {r.risk[c.risk]}
                      </span>
                      <span className="text-sm font-semibold">{c.title}</span>
                      {c.location ? (
                        <span className="ml-auto text-[10px] text-muted">p.{c.location.page}</span>
                      ) : (
                        <span className="ml-auto text-[10px] text-muted">{r.notFound}</span>
                      )}
                    </div>
                    <p className="mt-2 border-l-2 border-accent/50 pl-3 text-xs italic text-muted">
                      “{c.quote.length > 140 ? c.quote.slice(0, 140) + "…" : c.quote}”
                    </p>
                    <p className="mt-2 text-sm">{c.why}</p>
                    <p className="mt-1.5 text-sm text-ok">↳ {c.suggestion}</p>
                  </button>
                ))}
            </div>
          </div>
        </div>
      ) : null}
    </div>
  );
}
