"use client";

import { useState, useCallback } from "react";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import { Button } from "@/components/ui/button";
import { Copy, Check } from "lucide-react";
import { generateHtmlSnippet, generateManifest } from "@/lib/favicon-utils";

export function CodeSnippets({ appName }: { appName: string }) {
  const [copied, setCopied] = useState<string | null>(null);

  const htmlSnippet = generateHtmlSnippet(appName || "My App");
  const manifestJson = generateManifest(appName || "My App");

  const handleCopy = useCallback((text: string, key: string) => {
    navigator.clipboard.writeText(text);
    setCopied(key);
    setTimeout(() => setCopied(null), 2000);
  }, []);

  return (
    <Tabs defaultValue="html">
      <TabsList>
        <TabsTrigger value="html">HTML Snippet</TabsTrigger>
        <TabsTrigger value="manifest">manifest.json</TabsTrigger>
      </TabsList>
      <TabsContent value="html" className="relative mt-3">
        <Button
          variant="ghost"
          size="icon"
          className="absolute right-2 top-2 h-7 w-7"
          onClick={() => handleCopy(htmlSnippet, "html")}
        >
          {copied === "html" ? (
            <Check className="h-3.5 w-3.5 text-green-500" />
          ) : (
            <Copy className="h-3.5 w-3.5" />
          )}
        </Button>
        <pre className="overflow-x-auto rounded-lg border bg-muted/30 p-4 text-xs">
          <code>{htmlSnippet}</code>
        </pre>
      </TabsContent>
      <TabsContent value="manifest" className="relative mt-3">
        <Button
          variant="ghost"
          size="icon"
          className="absolute right-2 top-2 h-7 w-7"
          onClick={() => handleCopy(manifestJson, "manifest")}
        >
          {copied === "manifest" ? (
            <Check className="h-3.5 w-3.5 text-green-500" />
          ) : (
            <Copy className="h-3.5 w-3.5" />
          )}
        </Button>
        <pre className="overflow-x-auto rounded-lg border bg-muted/30 p-4 text-xs">
          <code>{manifestJson}</code>
        </pre>
      </TabsContent>
    </Tabs>
  );
}
