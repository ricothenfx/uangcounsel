import type { Metadata } from "next";
import { Inter, Space_Grotesk } from "next/font/google";
import "./globals.css";

const inter = Inter({ variable: "--font-inter", subsets: ["latin"] });
const grotesk = Space_Grotesk({ variable: "--font-grotesk", subsets: ["latin"] });

const themeInit = `(function(){try{var s=localStorage.getItem("uangcounsel-theme");var d=s?s==="dark":window.matchMedia("(prefers-color-scheme: dark)").matches;if(d)document.documentElement.classList.add("dark")}catch(e){}})()`;

const siteUrl = process.env.NEXT_PUBLIC_SITE_URL ?? "https://uangcounsel.vercel.app";

export const metadata: Metadata = {
  metadataBase: new URL(siteUrl),
  title: {
    default: "UangCounsel — AI contract review with receipts",
    template: "%s · UangCounsel",
  },
  description:
    "Upload a contract, watch an LLM read it clause by clause, and get risk flags with the exact text highlighted on the document. Not opinions — receipts.",
  openGraph: {
    title: "UangCounsel — AI contract review with receipts",
    description:
      "AI contract review where every risk flag points at the exact clause text that triggered it. A portfolio build by Rico.",
    url: siteUrl,
    siteName: "UangCounsel",
    type: "website",
  },
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" className={`${inter.variable} ${grotesk.variable} h-full antialiased`} suppressHydrationWarning>
      <head>
        <script dangerouslySetInnerHTML={{ __html: themeInit }} />
      </head>
      <body className="min-h-full flex flex-col">{children}</body>
    </html>
  );
}
