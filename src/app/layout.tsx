import type { Metadata } from "next";
import { Inter, Space_Grotesk } from "next/font/google";
import "./globals.css";
import { I18nProvider } from "@/lib/i18n/provider";
import { getDictionary, getLocale } from "@/lib/i18n/server";
import { LOCALES_META } from "@/lib/i18n/config";

const inter = Inter({ variable: "--font-inter", subsets: ["latin"] });
const grotesk = Space_Grotesk({ variable: "--font-grotesk", subsets: ["latin"] });

const themeInit = `(function(){try{var s=localStorage.getItem("uangcounsel-theme");var d=s?s==="dark":window.matchMedia("(prefers-color-scheme: dark)").matches;if(d)document.documentElement.classList.add("dark")}catch(e){}})()`;

const siteUrl = process.env.NEXT_PUBLIC_SITE_URL ?? "https://uangcounsel.vercel.app";

export async function generateMetadata(): Promise<Metadata> {
  const { meta } = await getDictionary();
  return {
    metadataBase: new URL(siteUrl),
    title: {
      default: meta.titleDefault,
      template: "%s · UangCounsel",
    },
    description: meta.description,
    openGraph: {
      title: meta.ogTitle,
      description: meta.ogDescription,
      url: siteUrl,
      siteName: "UangCounsel",
      type: "website",
    },
  };
}

export default async function RootLayout({ children }: { children: React.ReactNode }) {
  const locale = await getLocale();
  const dict = await getDictionary();
  return (
    <html lang={LOCALES_META[locale].bcp47} className={`${inter.variable} ${grotesk.variable} h-full antialiased`} suppressHydrationWarning>
      <head>
        <script dangerouslySetInnerHTML={{ __html: themeInit }} />
      </head>
      <body className="min-h-full flex flex-col">
        <I18nProvider locale={locale} dict={dict}>{children}</I18nProvider>
      </body>
    </html>
  );
}
