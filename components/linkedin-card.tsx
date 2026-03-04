"use client";

import type { OGData } from "@/lib/og-types";

export function LinkedInCard({ data }: { data: OGData }) {
  const title = data.ogTitle || data.title || "No title";
  const description = data.ogDescription || data.description || "";
  const image = data.ogImage;
  const domain = (() => {
    try {
      return new URL(data.resolvedUrl).hostname;
    } catch {
      return data.resolvedUrl;
    }
  })();

  return (
    <div className="max-w-[504px] overflow-hidden rounded-md border border-[#38434f] bg-[#1b1f23]">
      {image && (
        <div className="aspect-[1.91/1] w-full bg-muted">
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            src={image}
            alt=""
            className="h-full w-full object-cover"
          />
        </div>
      )}
      <div className="border-t border-[#38434f] px-3 py-2.5">
        <p className="truncate text-[14px] font-semibold text-[#ffffffe6]">
          {title}
        </p>
        <p className="mt-0.5 line-clamp-2 text-[12px] text-[#ffffff99]">
          {description}
        </p>
        <p className="mt-1 text-[12px] text-[#ffffff99]">{domain}</p>
      </div>
    </div>
  );
}
