import { Analytics } from "@vercel/analytics/next";
import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

const siteUrl = "https://seo-toolkit.vercel.app";

export const metadata: Metadata = {
  title: {
    default: "SEO Toolkit — OG Preview & Favicon Generator",
    template: "%s | SEO Toolkit",
  },
  description:
    "Free SEO toolkit to preview how your URLs appear on Twitter, Facebook, and LinkedIn. Generate favicons in all sizes with HTML snippets and manifest.json. No signup required.",
  keywords: [
    "og preview",
    "open graph checker",
    "social share preview",
    "favicon generator",
    "meta tag checker",
    "twitter card preview",
    "seo toolkit",
    "og image checker",
  ],
  authors: [{ name: "Nathan Schroeder", url: "https://nathanschroeder.dev" }],
  creator: "Nathan Schroeder",
  metadataBase: new URL(siteUrl),
  openGraph: {
    type: "website",
    locale: "en_US",
    url: siteUrl,
    title: "SEO Toolkit — OG Preview & Favicon Generator",
    description:
      "Preview social cards and generate favicons instantly. Free, no signup required.",
    siteName: "SEO Toolkit",
    images: [
      {
        url: "/og-image.png",
        width: 1200,
        height: 630,
        alt: "SEO Toolkit — OG Preview & Favicon Generator",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "SEO Toolkit — OG Preview & Favicon Generator",
    description:
      "Preview social cards and generate favicons instantly. Free, no signup required.",
    images: ["/og-image.png"],
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      "max-video-preview": -1,
      "max-image-preview": "large",
      "max-snippet": -1,
    },
  },
  icons: {
    icon: [
      { url: "/favicon-16x16.png", sizes: "16x16", type: "image/png" },
      { url: "/favicon-32x32.png", sizes: "32x32", type: "image/png" },
      { url: "/favicon.ico", sizes: "48x48" },
    ],
    apple: [{ url: "/favicon-192x192.png", sizes: "192x192" }],
  },
  manifest: "/site.webmanifest",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className="dark">
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased`}
      >
        {children}
        <Analytics />
      </body>
    </html>
  );
}
