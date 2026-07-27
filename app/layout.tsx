import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import localFont from "next/font/local";
import "lenis/dist/lenis.css";
import "./globals.css";
import { Providers } from "@/components/providers";
import { Footer } from "@/components/layout/footer";
import { Nav } from "@/components/layout/nav";
import { KEYWORDS, PERSON, SITE_URL, websiteJsonLd } from "@/lib/seo";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

const departureMono = localFont({
  src: [
    {
      path: "../public/fonts/DepartureMono-Regular.woff2",
      weight: "400",
      style: "normal",
    },
    {
      path: "../public/fonts/DepartureMono-Regular.woff",
      weight: "400",
      style: "normal",
    },
  ],
  variable: "--font-departure-raw",
  display: "swap",
});

// Both are length-budgeted for the SERP: titles truncate around 60 characters
// and descriptions around 160. The previous title was 75 rendered characters,
// so "Bangalore" — a primary local term — was being cut off entirely. The
// stack names live in the description, the H1 and `keywords` instead.
const TITLE = "Tanishq Bhosale — AI & Full Stack Engineer in Bangalore";
const DESCRIPTION =
  "Full Stack & AI Engineer in Bangalore building production LLM and agentic AI systems with LangGraph, FastAPI and React Native. Open to AI Engineer roles.";

export const metadata: Metadata = {
  metadataBase: new URL(SITE_URL),
  title: {
    default: TITLE,
    template: "%s | Tanishq Bhosale",
  },
  description: DESCRIPTION,
  keywords: KEYWORDS,
  authors: [{ name: PERSON.name, url: SITE_URL }],
  creator: PERSON.name,
  alternates: {
    canonical: "/",
    types: {
      // Advertises the LLM-facing twin from the document head, so an agent can
      // find it without probing for a conventional path. Post pages override
      // this with their own `.md` twin.
      "text/markdown": "/llms.txt",
    },
  },
  icons: {
    icon: [
      // Primary — webp logo for modern browsers (the tab logo)
      { url: "/logo.webp", type: "image/webp" },
      // Fallback — PNG for Safari / browsers without webp favicon support
      { url: "/icon.png", type: "image/png" },
    ],
    shortcut: "/logo.webp",
    apple: "/icon.png",
  },
  openGraph: {
    type: "website",
    locale: "en_US",
    siteName: PERSON.name,
    url: SITE_URL,
    title: TITLE,
    description: DESCRIPTION,
  },
  twitter: {
    card: "summary_large_image",
    title: TITLE,
    description: DESCRIPTION,
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      "max-image-preview": "large",
      "max-snippet": -1,
    },
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="en"
      suppressHydrationWarning
      className={`${geistSans.variable} ${geistMono.variable} ${departureMono.variable} h-full antialiased`}
    >
      <body className="flex min-h-full flex-col" suppressHydrationWarning>
        {/* Site-wide entity only. Page-specific structured data (ProfilePage,
            FAQPage, BlogPosting) is emitted by the page that owns it. */}
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(websiteJsonLd()) }}
        />
        <Providers>
          <Nav />
          <main className="flex-1">{children}</main>
        </Providers>
      </body>
    </html>
  );
}
