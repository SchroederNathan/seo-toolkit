"use client";

import type { OGData } from "@/lib/og-types";

export function TwitterCard({ data }: { data: OGData }) {
  const title = data.twitterTitle || data.ogTitle || data.title || "No title";
  const description =
    data.twitterDescription || data.ogDescription || data.description || "";
  const image = data.twitterImage || data.ogImage;
  const domain = (() => {
    try {
      return new URL(data.resolvedUrl).hostname;
    } catch {
      return data.resolvedUrl;
    }
  })();

  const isLargeCard = data.twitterCard === "summary_large_image";

  if (isLargeCard) {
    return (
      <div className="max-w-[504px] overflow-hidden rounded-lg border border-[#2f3336]">
        {image && (
          <div className="aspect-[2/1] w-full bg-muted">
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              src={image}
              alt=""
              className="h-full w-full object-cover"
            />
          </div>
        )}
        <div className="border-t border-[#2f3336] bg-[#16181c] px-3 py-2.5">
          <p className="text-[13px] text-[#71767b]">{domain}</p>
          <p className="truncate text-[15px] text-[#e7e9ea]">{title}</p>
          <p className="line-clamp-2 text-[13px] text-[#71767b]">
            {description}
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="flex max-w-[504px] overflow-hidden rounded-lg border border-[#2f3336]">
      {image && (
        <div className="h-[128px] w-[128px] shrink-0 bg-muted">
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            src={image}
            alt=""
            className="h-full w-full object-cover"
          />
        </div>
      )}
      <div className="flex flex-col justify-center border-l border-[#2f3336] bg-[#16181c] px-3 py-2">
        <p className="text-[13px] text-[#71767b]">{domain}</p>
        <p className="truncate text-[15px] text-[#e7e9ea]">{title}</p>
        <p className="line-clamp-2 text-[13px] text-[#71767b]">
          {description}
        </p>
      </div>
    </div>
  );
}
