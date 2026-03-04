import { NextRequest, NextResponse } from "next/server";
import { parse } from "node-html-parser";
import type { OGData } from "@/lib/og-types";

export async function GET(request: NextRequest) {
  const url = request.nextUrl.searchParams.get("url");

  if (!url) {
    return NextResponse.json({ error: "URL parameter is required" }, { status: 400 });
  }

  let normalizedUrl = url;
  if (!/^https?:\/\//i.test(normalizedUrl)) {
    normalizedUrl = `https://${normalizedUrl}`;
  }

  try {
    new URL(normalizedUrl);
  } catch {
    return NextResponse.json({ error: "Invalid URL" }, { status: 400 });
  }

  try {
    const response = await fetch(normalizedUrl, {
      headers: {
        "User-Agent":
          "Mozilla/5.0 (compatible; OGToolkit/1.0; +https://og-toolkit.dev)",
        Accept: "text/html,application/xhtml+xml",
      },
      redirect: "follow",
      signal: AbortSignal.timeout(10000),
    });

    if (!response.ok) {
      return NextResponse.json(
        { error: `Failed to fetch URL: ${response.status} ${response.statusText}` },
        { status: 502 }
      );
    }

    const html = await response.text();
    const root = parse(html);
    const head = root.querySelector("head") || root;

    function getMeta(property: string): string | undefined {
      const el =
        head.querySelector(`meta[property="${property}"]`) ||
        head.querySelector(`meta[name="${property}"]`);
      return el?.getAttribute("content") || undefined;
    }

    const titleEl = head.querySelector("title");
    const canonicalEl = head.querySelector('link[rel="canonical"]');
    const faviconEl =
      head.querySelector('link[rel="icon"]') ||
      head.querySelector('link[rel="shortcut icon"]');

    let faviconHref = faviconEl?.getAttribute("href");
    if (faviconHref && !faviconHref.startsWith("http")) {
      const base = new URL(normalizedUrl);
      faviconHref = new URL(faviconHref, base.origin).href;
    }

    const data: OGData = {
      ogTitle: getMeta("og:title"),
      ogDescription: getMeta("og:description"),
      ogImage: getMeta("og:image"),
      ogUrl: getMeta("og:url"),
      ogSiteName: getMeta("og:site_name"),
      ogType: getMeta("og:type"),
      twitterCard: getMeta("twitter:card"),
      twitterTitle: getMeta("twitter:title"),
      twitterDescription: getMeta("twitter:description"),
      twitterImage: getMeta("twitter:image"),
      twitterSite: getMeta("twitter:site"),
      twitterCreator: getMeta("twitter:creator"),
      title: titleEl?.text || undefined,
      description: getMeta("description"),
      canonical: canonicalEl?.getAttribute("href") || undefined,
      favicon: faviconHref,
      resolvedUrl: response.url || normalizedUrl,
      fetchedAt: new Date().toISOString(),
    };

    return NextResponse.json(data);
  } catch (err) {
    const message = err instanceof Error ? err.message : "Unknown error";
    return NextResponse.json({ error: `Fetch failed: ${message}` }, { status: 502 });
  }
}
