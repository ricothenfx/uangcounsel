import type { Metadata } from "next";
import Link from "next/link";
import { Nav } from "@/components/nav";
import { Footer } from "@/components/footer";

export const metadata: Metadata = {
  title: "Q&A — about this project",
  description:
    "Questions and straight answers about UangCounsel: what's real, what's precomputed, how the pipeline works, privacy, and how it relates to uang.ai.",
};

type Qa = { q: string; a: string };
type Category = { id: string; label: string; items: Qa[] };

const CATEGORIES: Category[] = [
  {
    id: "project",
    label: "The project",
    items: [
      {
        q: "What is UangCounsel?",
        a: "An AI contract-review tool built as a portfolio piece: upload a text-based PDF contract and get back clause-level risk flags, each pointing at the exact highlighted text that triggered it, plus a one-sentence business explanation and a negotiation ask per clause.",
      },
      {
        q: "Why did you build it?",
        a: "As the third piece of a showcase for uang.ai (\"The AI Factory\"): UangLite proves an agent can safely operate a business app, UangFactory proves a website can prove instead of tell, and UangCounsel proves the same design language works on unstructured documents — one of uang.ai's own case-study verticals (legal).",
      },
      {
        q: "Is this affiliated with uang.ai?",
        a: "No. Independent portfolio work by Rico — not affiliated with or endorsed by uang.ai. It is inspired by their positioning: business understanding + engineering + AI expertise.",
      },
      {
        q: "Is this legal advice?",
        a: "No. The analysis is AI-assisted and directional. It is designed to tell you where to look and what to ask, not to replace a lawyer. Every output says so.",
      },
    ],
  },
  {
    id: "real",
    label: "Real vs. precomputed",
    items: [
      {
        q: "Is the analysis real AI?",
        a: "Yes. Uploaded PDFs run live through an LLM pipeline (any OpenAI-compatible endpoint). The three sample contracts ship with precomputed analyses — produced by the exact same pipeline, then frozen so the demo opens instantly and costs nothing to run.",
      },
      {
        q: "How do I know the highlights aren't faked?",
        a: "Every highlight is geometry, not a screenshot: the server locates the model's verbatim quote back in a character-level coordinate index of the PDF. If a quote can't be found — for instance because the model truncated it — the clause card says 'quote not found' instead of pretending.",
      },
      {
        q: "What happens without an API key?",
        a: "The samples still work fully (precomputed), and uploads return a clear 'LLM endpoint not configured' message instead of a broken screen. Graceful degradation is a design principle here, not an afterthought.",
      },
      {
        q: "Can the model hallucinate?",
        a: "It can hallucinate a quote — that's exactly why the locate step exists. The pipeline only displays a quote it can find verbatim in the document; everything else is either repaired (one retry) or labeled as not found. The 'why' and 'suggestion' fields are model judgment and marked as directional.",
      },
    ],
  },
  {
    id: "pipeline",
    label: "How it works",
    items: [
      {
        q: "How does the highlighting work, technically?",
        a: "pdf.js extracts every character with its page position. That builds a coordinate index; the model's quote is matched back to it (case-insensitive, whitespace-tolerant, with an ellipsis-fragment fallback) and merged into one rectangle per visual line. The viewer renders the PDF on canvas and absolutely positions colored overlays at those coordinates.",
      },
      {
        q: "What keeps the LLM output valid?",
        a: "A strict JSON shape is spelled out in the prompt (OpenAI-compatible endpoints often run without hard schema enforcement), output is validated with zod with lenient normalization (e.g. 'High' → 'high'), and a failed attempt gets exactly one repair round-trip before falling back to a clear error.",
      },
      {
        q: "What are the limits?",
        a: "Text-based PDFs only — scanned documents have no extractable text and are rejected with an explanation. Max 8 MB and 40 pages. Multi-column layouts can stress the line-merging heuristics. Rate-limited to 10 analyses per minute per IP.",
      },
    ],
  },
  {
    id: "privacy",
    label: "Privacy & data",
    items: [
      {
        q: "Do you store my uploaded contracts?",
        a: "No. Uploads are analyzed in memory and discarded. There is no database in this project — nothing about your document persists after the response is sent.",
      },
      {
        q: "What does the LLM provider see?",
        a: "The extracted text of the document you upload is sent to the configured LLM endpoint to be analyzed. That's inherent to any LLM review. For sensitive contracts, run your own instance — the whole pipeline works self-hosted with a local model endpoint.",
      },
    ],
  },
  {
    id: "stack",
    label: "Stack & meta",
    items: [
      {
        q: "What is it built with?",
        a: "Next.js 16 (App Router) · React 19 · Tailwind CSS 4 · TypeScript · AI SDK with any OpenAI-compatible endpoint · pdf.js for parsing and rendering · Vitest for unit tests · Playwright for end-to-end tests. No database by design.",
      },
      {
        q: "How was it tested?",
        a: "Unit tests cover the geometry layer (quote location, fragment fallback) and output validation. Playwright end-to-end tests cover the full user flow: opening a sample, watching highlights render, clicking a clause to jump to its source text, theme switching, and the Q&A page.",
      },
      {
        q: "Where does dark/light mode come from?",
        a: "A hand-rolled token system (CSS custom properties + Tailwind 4), persisted per browser, following prefers-color-scheme on first visit. No UI library needed.",
      },
      {
        q: "Can I run my own instance?",
        a: "Yes — it's open source. Clone the repo, optionally set LLM_BASE_URL / LLM_API_KEY / LLM_MODEL as environment variables (any OpenAI-compatible endpoint works, including a local one), and deploy. Everything else works with zero configuration.",
      },
    ],
  },
];

export default function QaPage() {
  return (
    <>
      <Nav />
      <main className="mx-auto w-full max-w-4xl flex-1 px-4 pb-16 pt-12">
        <h1 className="font-display text-3xl font-bold tracking-tight sm:text-4xl">Q&A</h1>
        <p className="mt-2 max-w-2xl text-muted">
          Straight answers about UangCounsel itself: what&apos;s real, what&apos;s precomputed, how the
          pipeline works, and what happens to your data.
        </p>
        <div className="mt-10 space-y-10">
          {CATEGORIES.map((cat) => (
            <section key={cat.id}>
              <h2 className="font-display text-sm font-bold uppercase tracking-wider text-accent">{cat.label}</h2>
              <div className="mt-3 space-y-3">
                {cat.items.map((item) => (
                  <details key={item.q} className="card group p-4 open:pb-5">
                    <summary className="cursor-pointer list-none font-medium marker:hidden">
                      <span className="mr-2 inline-block text-muted transition-transform group-open:rotate-90">›</span>
                      {item.q}
                    </summary>
                    <p className="mt-3 pl-5 text-sm leading-relaxed text-muted">{item.a}</p>
                  </details>
                ))}
              </div>
            </section>
          ))}
        </div>
        <p className="mt-12 text-sm text-muted">
          Something the Q&A doesn&apos;t cover? Try the{" "}
          <Link href="/#review" className="text-accent underline underline-offset-2">reviewer</Link> and see
          for yourself.
        </p>
      </main>
      <Footer />
    </>
  );
}
