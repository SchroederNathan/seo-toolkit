"use client";

import { useCallback, useState } from "react";
import type { OGData } from "@/lib/og-types";
import { Button } from "@/components/ui/button";
import { Text } from "@/components/ui/text";
import {
  Table,
  TableHead,
  TableBody,
  TableRow,
  TableHeader,
  TableCell,
} from "@/components/ui/table";
import { Copy, Check } from "lucide-react";
import { copyToClipboard } from "@/lib/clipboard";

export function MetaTable({ data }: { data: OGData }) {
  const [copiedKey, setCopiedKey] = useState<string | null>(null);

  const handleCopy = useCallback(async (key: string, value: string) => {
    await copyToClipboard(value);
    setCopiedKey(key);
    setTimeout(() => setCopiedKey(null), 2000);
  }, []);

  const entries = Object.entries(data).filter(
    ([key, value]) =>
      value && key !== "resolvedUrl" && key !== "fetchedAt"
  ) as [string, string][];

  if (entries.length === 0) {
    return <Text className="text-sm">No meta tags found.</Text>;
  }

  return (
    <Table dense>
      <TableHead>
        <TableRow>
          <TableHeader>Property</TableHeader>
          <TableHeader>Value</TableHeader>
          <TableHeader className="w-10" />
        </TableRow>
      </TableHead>
      <TableBody>
        {entries.map(([key, value]) => (
          <TableRow key={key}>
            <TableCell className="font-mono text-xs text-brand-11">
              {key}
            </TableCell>
            <TableCell className="max-w-[300px] truncate">{value}</TableCell>
            <TableCell>
              <Button
                plain
                onClick={() => handleCopy(key, value)}
              >
                {copiedKey === key ? (
                  <Check className="h-3.5 w-3.5 text-green-500" />
                ) : (
                  <Copy className="h-3.5 w-3.5" />
                )}
              </Button>
            </TableCell>
          </TableRow>
        ))}
      </TableBody>
    </Table>
  );
}
