"use client";

import type { OGData } from "@/lib/og-types";

export function FacebookCard({ data }: { data: OGData }) {
  const title = data.ogTitle || data.title || "No title";
  const description = data.ogDescription || data.description || "";
  const image = data.ogImage;
  const domain = (() => {
    try {
      return new URL(data.resolvedUrl).hostname.toUpperCase();
    } catch {
      return data.resolvedUrl;
    }
  })();

  return (
    <div className="max-w-[504px] overflow-hidden border border-[#3a3b3c] bg-[#242526]">
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
      <div className="border-t border-[#3a3b3c] px-3 py-2.5">
        <p className="text-[12px] uppercase text-[#b0b3b8]">{domain}</p>
        <p className="mt-0.5 truncate text-[16px] font-semibold text-[#e4e6eb]">
          {title}
        </p>
        <p className="line-clamp-1 text-[14px] text-[#b0b3b8]">
          {description}
        </p>
      </div>
    </div>
  );
}
