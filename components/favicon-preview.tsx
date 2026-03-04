"use client";

import { useCallback } from "react";
import type { FaviconSize } from "@/lib/og-types";
import { Button } from "@/components/ui/button";
import { downloadBlob, generateIco } from "@/lib/favicon-utils";
import { Download, FileIcon } from "lucide-react";

export function FaviconPreview({ favicons }: { favicons: FaviconSize[] }) {
  const handleDownload = useCallback((favicon: FaviconSize) => {
    downloadBlob(favicon.blob, `favicon-${favicon.size}x${favicon.size}.png`);
  }, []);

  const handleDownloadIco = useCallback(async () => {
    const ico = await generateIco(favicons);
    downloadBlob(ico, "favicon.ico");
  }, [favicons]);

  return (
    <div className="space-y-4">
      <Button outline className="w-full" onClick={handleDownloadIco}>
        <FileIcon className="mr-1.5 h-4 w-4" />
        Download favicon.ico
      </Button>
      <div className="grid grid-cols-2 gap-px bg-white/[0.06] sm:grid-cols-3 md:grid-cols-4">
        {favicons.map((favicon) => (
          <div
            key={favicon.size}
            className="flex flex-col items-center gap-2 bg-zinc-950 p-4"
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
            <span className="text-xs text-zinc-500 font-mono">
              {favicon.size}×{favicon.size}
            </span>
            <Button
              plain
              className="text-xs"
              onClick={() => handleDownload(favicon)}
            >
              <Download className="mr-1 h-3 w-3" />
              PNG
            </Button>
          </div>
        ))}
      </div>
    </div>
  );
}
