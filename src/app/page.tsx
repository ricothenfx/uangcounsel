import type { Metadata } from "next";
import { Nav } from "@/components/nav";
import { Footer } from "@/components/footer";
import { Reviewer } from "@/components/reviewer";
import { SAMPLES } from "@/lib/samples";
import { getDictionary } from "@/lib/i18n/server";

export async function generateMetadata(): Promise<Metadata> {
  const { meta } = await getDictionary();
  return {
    title: meta.titleHome,
    description: meta.descriptionHome,
  };
}

export default async function Home() {
  const dict = await getDictionary();
  return (
    <>
      <Nav />
      <main className="mx-auto w-full max-w-6xl flex-1 px-4">
        {/* hero */}
        <section className="relative overflow-hidden pb-14 pt-16 text-center sm:pt-24">
          <div className="grid-bg pointer-events-none absolute inset-0" aria-hidden />
          <div className="relative">
            <span className="inline-block rounded-full border border-line bg-card px-3 py-1 text-xs text-muted">
              {dict.home.badge}
            </span>
            <h1 className="mx-auto mt-5 max-w-3xl font-display text-4xl font-bold leading-[1.08] tracking-tight sm:text-6xl">
              {dict.home.heroTitleA}
              <span className="text-accent">{dict.home.heroTitleB}</span>
            </h1>
            <p className="mx-auto mt-5 max-w-2xl text-lg text-muted">
              {dict.home.heroBodyA}
              <em>{dict.home.heroBodyEm}</em>
              {dict.home.heroBodyB}
            </p>
            <div className="mt-6 flex flex-wrap items-center justify-center gap-x-6 gap-y-2 text-sm text-muted">
              <span>{dict.home.step1}</span>
              <span>{dict.home.step2}</span>
              <span>{dict.home.step3}</span>
            </div>
          </div>
        </section>

        {/* reviewer */}
        <Reviewer />

        {/* samples detail */}
        <section id="samples" className="pt-20">
          <h2 className="font-display text-2xl font-bold tracking-tight sm:text-3xl">{dict.home.samplesTitle}</h2>
          <p className="mt-2 max-w-2xl text-muted">{dict.home.samplesBody}</p>
          <div className="mt-6 grid gap-4 sm:grid-cols-3">
            {SAMPLES.map((s) => {
              const sDict = dict.samples[s.id];
              return (
                <div key={s.id} className="card p-5">
                  <p className="text-xs uppercase tracking-wider text-muted">{sDict.type}</p>
                  <h3 className="mt-1 font-display font-bold">{sDict.title}</h3>
                  <p className="mt-0.5 text-xs text-muted">{s.party}</p>
                  <p className="mt-3 text-sm leading-relaxed">{sDict.blurb}</p>
                  <div className="mt-3 flex flex-wrap gap-1.5">
                    {sDict.traps.map((t) => (
                      <span key={t} className="rounded-full bg-accent-soft px-2 py-0.5 text-[10px] text-accent">
                        {t}
                      </span>
                    ))}
                  </div>
                </div>
              );
            })}
          </div>
        </section>

        {/* how it works */}
        <section id="how" className="pt-20">
          <h2 className="font-display text-2xl font-bold tracking-tight sm:text-3xl">{dict.home.howTitle}</h2>
          <p className="mt-2 max-w-2xl text-muted">{dict.home.howBody}</p>
          <div className="mt-6 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
            {dict.home.howSteps.map((s) => (
              <div key={s.n} className="card p-5">
                <span className="font-display text-xs font-bold text-accent">{s.n}</span>
                <h3 className="mt-1 font-display font-bold">{s.t}</h3>
                <p className="mt-2 text-sm leading-relaxed text-muted">{s.d}</p>
              </div>
            ))}
          </div>
          <p className="mt-4 text-xs text-muted">{dict.home.disclaimer}</p>
        </section>
      </main>
      <Footer />
    </>
  );
}
