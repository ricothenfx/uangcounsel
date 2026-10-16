import type { Metadata } from "next";
import { Nav } from "@/components/nav";
import { Footer } from "@/components/footer";
import { Reviewer } from "@/components/reviewer";
import { SAMPLES } from "@/lib/samples";

export const metadata: Metadata = {
  title: "AI contract review with receipts",
  description:
    "Upload a contract, watch an LLM read it clause by clause, and get risk flags that point at the exact text that triggered them.",
};

export default function Home() {
  return (
    <>
      <Nav />
      <main className="mx-auto w-full max-w-6xl flex-1 px-4">
        {/* hero */}
        <section className="relative overflow-hidden pb-14 pt-16 text-center sm:pt-24">
          <div className="grid-bg pointer-events-none absolute inset-0" aria-hidden />
          <div className="relative">
            <span className="inline-block rounded-full border border-line bg-card px-3 py-1 text-xs text-muted">
              AI review, but with receipts
            </span>
            <h1 className="mx-auto mt-5 max-w-3xl font-display text-4xl font-bold leading-[1.08] tracking-tight sm:text-6xl">
              Contracts reviewed clause&nbsp;by&nbsp;clause —
              <span className="text-accent"> with the exact text highlighted.</span>
            </h1>
            <p className="mx-auto mt-5 max-w-2xl text-lg text-muted">
              Most AI reviews give you opinions in a chat window. UangCounsel flags risky clauses
              <em> on the document itself</em>, explains the business impact in one sentence, and
              drafts the negotiation ask. You read the contract; the machine shows you where to look.
            </p>
            <div className="mt-6 flex flex-wrap items-center justify-center gap-x-6 gap-y-2 text-sm text-muted">
              <span>① open a sample or upload a PDF</span>
              <span>② LLM reads it</span>
              <span>③ every flag links to its source text</span>
            </div>
          </div>
        </section>

        {/* reviewer */}
        <Reviewer />

        {/* samples detail */}
        <section id="samples" className="pt-20">
          <h2 className="font-display text-2xl font-bold tracking-tight sm:text-3xl">The sample files</h2>
          <p className="mt-2 max-w-2xl text-muted">
            Three realistic contracts with one-sided terms deliberately planted — the same traps
            in-house teams meet every week.
          </p>
          <div className="mt-6 grid gap-4 sm:grid-cols-3">
            {SAMPLES.map((s) => (
              <div key={s.id} className="card p-5">
                <p className="text-xs uppercase tracking-wider text-muted">{s.type}</p>
                <h3 className="mt-1 font-display font-bold">{s.title}</h3>
                <p className="mt-0.5 text-xs text-muted">{s.party}</p>
                <p className="mt-3 text-sm leading-relaxed">{s.blurb}</p>
                <div className="mt-3 flex flex-wrap gap-1.5">
                  {s.traps.map((t) => (
                    <span key={t} className="rounded-full bg-accent-soft px-2 py-0.5 text-[10px] text-accent">
                      {t}
                    </span>
                  ))}
                </div>
              </div>
            ))}
          </div>
        </section>

        {/* how it works */}
        <section id="how" className="pt-20">
          <h2 className="font-display text-2xl font-bold tracking-tight sm:text-3xl">No black boxes</h2>
          <p className="mt-2 max-w-2xl text-muted">
            The pipeline is deliberately transparent — the same honesty markers as our other builds.
          </p>
          <div className="mt-6 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
            {[
              {
                n: "01",
                t: "Text + geometry",
                d: "The PDF is parsed with pdf.js: every character is extracted with its exact page position, building a searchable coordinate index.",
              },
              {
                n: "02",
                t: "Structured LLM pass",
                d: "The model must answer in a strict JSON shape: title, category, risk, a verbatim quote, the business impact and a negotiation ask. Invalid output is repaired once, then rejected.",
              },
              {
                n: "03",
                t: "Quote location",
                d: "Each verbatim quote is located back in the coordinate index — line by line. If the model truncated a quote, fragment matching recovers it. Unfindable quotes are labeled, never faked.",
              },
              {
                n: "04",
                t: "Overlay you can audit",
                d: "The result is not a chat answer. It's a highlight on the page you can verify with your own eyes, plus a precomputed mode that works with zero AI infrastructure.",
              },
            ].map((s) => (
              <div key={s.n} className="card p-5">
                <span className="font-display text-xs font-bold text-accent">{s.n}</span>
                <h3 className="mt-1 font-display font-bold">{s.t}</h3>
                <p className="mt-2 text-sm leading-relaxed text-muted">{s.d}</p>
              </div>
            ))}
          </div>
          <p className="mt-4 text-xs text-muted">
            AI-assisted and directional — not legal advice. Uploaded PDFs are analyzed in memory and never stored.
          </p>
        </section>
      </main>
      <Footer />
    </>
  );
}
