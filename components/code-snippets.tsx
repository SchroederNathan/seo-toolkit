"use client";

import { useState, useCallback } from "react";
import { TabGroup, TabList, Tab, TabPanels, TabPanel } from "@headlessui/react";
import clsx from "clsx";
import { Button } from "@/components/ui/button";
import { Copy, Check } from "lucide-react";
import { generateHtmlSnippet, generateManifest } from "@/lib/favicon-utils";
import { copyToClipboard } from "@/lib/clipboard";

export function CodeSnippets({ appName }: { appName: string }) {
  const [copied, setCopied] = useState<string | null>(null);

  const htmlSnippet = generateHtmlSnippet(appName || "My App");
  const manifestJson = generateManifest(appName || "My App");

  const handleCopy = useCallback(async (text: string, key: string) => {
    await copyToClipboard(text);
    setCopied(key);
    setTimeout(() => setCopied(null), 2000);
  }, []);

  return (
    <TabGroup>
      <TabList className="flex gap-1 rounded-md bg-brand-2 p-1 w-fit">
        {["HTML Snippet", "manifest.json"].map((name) => (
          <Tab
            key={name}
            className={clsx(
              "rounded-md px-3 py-1.5 text-sm font-medium outline-none transition",
              "text-brand-11 hover:text-brand-12",
              "data-selected:bg-brand-3 data-selected:text-brand-12"
            )}
          >
            {name}
          </Tab>
        ))}
      </TabList>
      <TabPanels className="mt-3">
        <TabPanel className="relative">
          <Button
            plain
            className="absolute right-3 top-3 z-10"
            onClick={() => handleCopy(htmlSnippet, "html")}
          >
            {copied === "html" ? (
              <Check className="h-3.5 w-3.5 text-green-500" />
            ) : (
              <Copy className="h-3.5 w-3.5" />
            )}
          </Button>
          <pre className="overflow-x-auto rounded-md border border-brand-3 bg-brand-2 p-4 pr-12 text-xs text-brand-11">
            <code>{htmlSnippet}</code>
          </pre>
        </TabPanel>
        <TabPanel className="relative">
          <Button
            plain
            className="absolute right-3 top-3 z-10"
            onClick={() => handleCopy(manifestJson, "manifest")}
          >
            {copied === "manifest" ? (
              <Check className="h-3.5 w-3.5 text-green-500" />
            ) : (
              <Copy className="h-3.5 w-3.5" />
            )}
          </Button>
          <pre className="overflow-x-auto rounded-md border border-brand-3 bg-brand-2 p-4 pr-12 text-xs text-brand-11">
            <code>{manifestJson}</code>
          </pre>
        </TabPanel>
      </TabPanels>
    </TabGroup>
  );
}
