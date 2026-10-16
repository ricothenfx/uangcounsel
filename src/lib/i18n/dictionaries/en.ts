export const en = {
  meta: {
    titleDefault: "UangCounsel — AI contract review with receipts",
    titleHome: "AI contract review with receipts",
    titleQa: "Q&A — about this project",
    description:
      "Upload a contract, watch an LLM read it clause by clause, and get risk flags with the exact text highlighted on the document. Not opinions — receipts.",
    descriptionHome:
      "Upload a contract, watch an LLM read it clause by clause, and get risk flags that point at the exact text that triggered them.",
    descriptionQa:
      "Questions and straight answers about UangCounsel: what's real, what's precomputed, how the pipeline works, privacy, and how it relates to uang.ai.",
    ogTitle: "UangCounsel — AI contract review with receipts",
    ogDescription:
      "AI contract review where every risk flag points at the exact clause text that triggered it. A portfolio build by Rico.",
  },
  common: {
    chooseLanguage: "Choose language",
    toLight: "Switch to light mode",
    toDark: "Switch to dark mode",
    toggleTheme: "Toggle theme",
  },
  nav: {
    review: "Review",
    samples: "Samples",
    how: "How it works",
    qa: "Q&A",
  },
  home: {
    badge: "AI review, but with receipts",
    heroTitleA: "Contracts reviewed clause by clause —",
    heroTitleB: " with the exact text highlighted.",
    heroBodyA:
      "Most AI reviews give you opinions in a chat window. UangCounsel flags risky clauses ",
    heroBodyEm: "on the document itself",
    heroBodyB:
      ", explains the business impact in one sentence, and drafts the negotiation ask. You read the contract; the machine shows you where to look.",
    step1: "① open a sample or upload a PDF",
    step2: "② LLM reads it",
    step3: "③ every flag links to its source text",
    samplesTitle: "The sample files",
    samplesBody:
      "Three realistic contracts with one-sided terms deliberately planted — the same traps in-house teams meet every week.",
    howTitle: "No black boxes",
    howBody:
      "The pipeline is deliberately transparent — the same honesty markers as our other builds.",
    howSteps: [
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
    ],
    disclaimer:
      "AI-assisted and directional — not legal advice. Uploaded PDFs are analyzed in memory and never stored.",
  },
  samples: {
    "vendor-msa": {
      title: "Vendor Master Services Agreement",
      type: "MSA · consulting",
      blurb:
        "The classic vendor paper: auto-renewal with a 180-day notice trap, one-way indemnity, a 3-month liability cap — and a unilateral amendment clause.",
      traps: ["auto-renewal", "one-way indemnity", "low liability cap", "unilateral amendment"],
    },
    "saas-subscription": {
      title: "SaaS Subscription Agreement",
      type: "SaaS · subscription",
      blurb:
        "Stacked auto-renewal price escalation, no SLA remedies, data lock-in on exit, and 'continued use constitutes acceptance' term changes.",
      traps: ["price escalation", "no SLA remedy", "data retrieval fee", "silent term change"],
    },
    "employment-offer": {
      title: "Senior Consultant Employment Agreement",
      type: "Employment",
      blurb:
        "Broad non-compete, perpetual confidentiality, unpaid-notice clawback and IP assignment that overreaches into personal projects.",
      traps: ["non-compete", "perpetual NDA", "clawback", "broad IP assignment"],
    },
  },
  reviewer: {
    trySample: "Try a sample contract",
    upload: "Upload your PDF",
    samplesNote:
      "Samples: real PDFs analyzed by the same pipeline, precomputed so they open instantly. Uploads run live through the LLM pipeline. Text-based PDFs only (max 8 MB).",
    stages: [
      "Reading document…",
      "Extracting clauses…",
      "Weighing risks…",
      "Locating quotes on the page…",
    ],
    analysisFailed: "Analysis failed.",
    noLlmTip:
      "Tip: the three sample contracts below work without any API key — their analysis ships precomputed.",
    networkError: "Network error — could not reach the analysis endpoint.",
    choosePdf: "Please choose a PDF file.",
    tooLarge: "PDF too large (max 8 MB).",
    copied: "Copied ✓",
    copySummary: "Copy summary",
    pages: "{n} page(s)",
    precomputed: "precomputed analysis",
    live: "live analysis",
    liveAnalysis: "live analysis in {s}s",
    flagsNote: "every flag points at its source text",
    notFound: "quote not found",
    noClauses: "{n} notable clauses found.",
    riskLabel: { high: "High risk", medium: "Review", low: "OK" },
    risk: { high: "high", medium: "medium", low: "low" },
    copyTitle: "Contract review — {doc}",
    copyExcerpt: "Excerpt",
    copyWhy: "Why it matters",
    copyAsk: "Negotiation ask",
    copyDisclaimer: "AI-assisted review — directional, not legal advice.",
  },
  footer: {
    disclaimer:
      "Portfolio build by Rico. Analysis is AI-assisted and directional — not legal advice. Not affiliated with or endorsed by uang.ai.",
  },
  notFound: {
    text: "This page is not in the contract.",
    back: "Back to review",
  },
  qa: {
    heading: "Q&A",
    intro:
      "Straight answers about UangCounsel itself: what's real, what's precomputed, how the pipeline works, and what happens to your data.",
    cover: "Something the Q&A doesn't cover? Try the ",
    coverLink: "reviewer",
    coverTail: " and see for yourself.",
    categories: {
      project: {
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
      real: {
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
      pipeline: {
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
      privacy: {
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
      stack: {
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
    },
  },
};

export type Dictionary = typeof en;
