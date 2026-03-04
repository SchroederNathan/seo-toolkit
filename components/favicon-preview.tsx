"use client";

import { useCallback } from "react";
import type { FaviconSize } from "@/lib/og-types";
import { Button } from "@/components/ui/button";
import { downloadBlob } from "@/lib/favicon-utils";
import { Download } from "lucide-react";

export function FaviconPreview({ favicons }: { favicons: FaviconSize[] }) {
  const handleDownload = useCallback((favicon: FaviconSize) => {
    downloadBlob(favicon.blob, `favicon-${favicon.size}x${favicon.size}.png`);
  }, []);

  return (
    <div className="grid grid-cols-2 gap-3 sm:grid-cols-3 md:grid-cols-4">
      {favicons.map((favicon) => (
        <div
          key={favicon.size}
          className="flex flex-col items-center gap-2 rounded-md border border-brand-3 bg-brand-2 p-3"
        >
          <div className="flex h-20 w-20 items-center justify-center">
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              src={favicon.url}
              alt={`${favicon.size}x${favicon.size}`}
              width={Math.min(favicon.size, 64)}
              height={Math.min(favicon.size, 64)}
              style={{ imageRendering: "pixelated" }}
            />
          </div>
          <span className="text-xs text-brand-11">
            {favicon.size}×{favicon.size}
          </span>
          <Button
            plain
            className="text-xs"
            onClick={() => handleDownload(favicon)}
          >
            <Download data-slot="icon" className="h-3.5 w-3.5" />
            PNG
          </Button>
        </div>
      ))}
    </div>
  );
}
