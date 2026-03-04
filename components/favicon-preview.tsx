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
          className="flex flex-col items-center gap-2 rounded-lg border bg-muted/30 p-3"
        >
          <div className="flex h-20 w-20 items-center justify-center">
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              src={favicon.url}
              alt={`${favicon.size}x${favicon.size}`}
              width={Math.min(favicon.size, 64)}
              height={Math.min(favicon.size, 64)}
              className="image-rendering-pixelated"
              style={{ imageRendering: "pixelated" }}
            />
          </div>
          <span className="text-xs text-muted-foreground">
            {favicon.size}×{favicon.size}
          </span>
          <Button
            variant="ghost"
            size="sm"
            className="h-7 text-xs"
            onClick={() => handleDownload(favicon)}
          >
            <Download className="mr-1 h-3 w-3" />
            PNG
          </Button>
        </div>
      ))}
    </div>
  );
}
