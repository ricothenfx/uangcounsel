# UangCounsel — AI contract review with receipts

**Live: [uangcounsel.vercel.app](https://uangcounsel.vercel.app)** — the three sample contracts work with zero configuration.

Upload a text-based PDF contract and get clause-level risk flags that point at the
**exact highlighted text** that triggered them — plus a one-sentence business impact
and a negotiation ask per clause. Not a chat answer; a highlight on the page you can
verify with your own eyes.

> The third piece of a showcase for [uang.ai](https://uang.ai) ("The AI Factory"),
> alongside [UangLite](https://uanglite.ricothen.com) (agent operating a real ERP)
> and [UangFactory](https://uang-v2.vercel.app) (the website that proves instead of tells).
> UangCounsel covers the **legal** vertical from uang.ai's case studies. Portfolio build —
> not affiliated with or endorsed by uang.ai. Not legal advice.

## The pipeline (no black boxes)

1. **Text + geometry** — pdf.js extracts every character with its page position → a
   character-level coordinate index.
2. **Structured LLM pass** — the model must answer in a strict JSON shape
   (title, category, risk, **verbatim quote**, why, negotiation ask). Output is validated
   with zod (lenient normalization), and a failed attempt gets exactly one repair retry.
3. **Quote location** — each verbatim quote is located back in the coordinate index:
   exact match → ellipsis-fragment matching → relaxed prefix/suffix recovery for quotes
   where the model silently dropped words. Unfindable quotes are *labeled*, never faked.
4. **Overlay you can audit** — the viewer renders the PDF on canvas and positions
   colored overlays at the located coordinates. Clicking a clause card scrolls to and
   pulses its source text.

### Honesty markers

- The three sample contracts ship with **precomputed analyses** (produced by this exact
  pipeline) — the demo works instantly, keylessly and free.
- Uploads run the live pipeline and require an LLM endpoint; without one you get a clear
  message, not a broken screen.
- A clause whose quote cannot be located says **"quote not found"** instead of guessing.

## Stack

Next.js 16 (App Router) · React 19 · Tailwind CSS 4 · TypeScript · AI SDK (any
OpenAI-compatible endpoint) · pdf.js · zod · Vitest · Playwright. **No database** —
uploads are analyzed in memory and never stored.

## Develop

```bash
pnpm install
pnpm dev              # http://localhost:3000
pnpm test             # unit tests (geometry, schema, samples)
pnpm test:e2e         # Playwright end-to-end
pnpm lint && pnpm typecheck && pnpm build
```

Optional env (`.env.local`, see `.env.example`):

```
LLM_BASE_URL=https://api.openai.com/v1
LLM_API_KEY=sk-...
LLM_MODEL=gpt-4o-mini
```

Any OpenAI-compatible endpoint works, including a local vLLM. On Vercel, set the same
variables in Project → Settings → Environment Variables.

### Regenerating the sample corpus

```bash
pnpm gen:contracts    # rebuilds the 3 PDFs and re-runs the live analysis for each
```

## Limits

Text-based PDFs only (scans have no extractable text), max 8 MB / 40 pages,
rate-limited to 10 analyses/min/IP. AI-assisted output is directional — it tells you
where to look and what to ask, not whether to sign.
