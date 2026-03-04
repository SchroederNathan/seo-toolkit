"use client";

import { useCallback, useState } from "react";
import type { OGData } from "@/lib/og-types";
import { Button } from "@/components/ui/button";
import { Copy, Check } from "lucide-react";

export function MetaTable({ data }: { data: OGData }) {
  const [copiedKey, setCopiedKey] = useState<string | null>(null);

  const handleCopy = useCallback((key: string, value: string) => {
    navigator.clipboard.writeText(value);
    setCopiedKey(key);
    setTimeout(() => setCopiedKey(null), 2000);
  }, []);

  const entries = Object.entries(data).filter(
    ([key, value]) =>
      value && key !== "resolvedUrl" && key !== "fetchedAt"
  ) as [string, string][];

  if (entries.length === 0) {
    return <p className="text-sm text-muted-foreground">No meta tags found.</p>;
  }

  return (
    <div className="overflow-x-auto rounded-lg border">
      <table className="w-full text-sm">
        <thead>
          <tr className="border-b bg-muted/50">
            <th className="px-3 py-2 text-left font-medium">Property</th>
            <th className="px-3 py-2 text-left font-medium">Value</th>
            <th className="w-10 px-3 py-2" />
          </tr>
        </thead>
        <tbody>
          {entries.map(([key, value]) => (
            <tr key={key} className="border-b last:border-0">
              <td className="px-3 py-2 font-mono text-xs text-muted-foreground">
                {key}
              </td>
              <td className="max-w-[300px] truncate px-3 py-2">{value}</td>
              <td className="px-3 py-2">
                <Button
                  variant="ghost"
                  size="icon"
                  className="h-7 w-7"
                  onClick={() => handleCopy(key, value)}
                >
                  {copiedKey === key ? (
                    <Check className="h-3.5 w-3.5 text-green-500" />
                  ) : (
                    <Copy className="h-3.5 w-3.5" />
                  )}
                </Button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
