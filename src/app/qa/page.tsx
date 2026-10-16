import type { Metadata } from "next";
import Link from "next/link";
import { Nav } from "@/components/nav";
import { Footer } from "@/components/footer";
import { getDictionary } from "@/lib/i18n/server";

export async function generateMetadata(): Promise<Metadata> {
  const { meta } = await getDictionary();
  return {
    title: meta.titleQa,
    description: meta.descriptionQa,
  };
}

const CATEGORY_IDS = ["project", "real", "pipeline", "privacy", "stack"] as const;

export default async function QaPage() {
  const dict = await getDictionary();
  return (
    <>
      <Nav />
      <main className="mx-auto w-full max-w-4xl flex-1 px-4 pb-16 pt-12">
        <h1 className="font-display text-3xl font-bold tracking-tight sm:text-4xl">{dict.qa.heading}</h1>
        <p className="mt-2 max-w-2xl text-muted">{dict.qa.intro}</p>
        <div className="mt-10 space-y-10">
          {CATEGORY_IDS.map((id) => {
            const cat = dict.qa.categories[id];
            return (
              <section key={id}>
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
            );
          })}
        </div>
        <p className="mt-12 text-sm text-muted">
          {dict.qa.cover}
          <Link href="/#review" className="text-accent underline underline-offset-2">{dict.qa.coverLink}</Link>
          {dict.qa.coverTail}
        </p>
      </main>
      <Footer />
    </>
  );
}
