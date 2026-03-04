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
      <TabList className="grid w-fit grid-cols-2 gap-px bg-white/[0.06]">
        {["HTML Snippet", "manifest.json"].map((name) => (
          <Tab
            key={name}
            className={clsx(
              "bg-zinc-950 px-3 py-1.5 text-sm font-medium outline-none transition",
              "text-zinc-500 hover:text-zinc-300 hover:bg-zinc-900",
              "data-selected:bg-zinc-900 data-selected:text-white"
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
            className="absolute right-2 top-2"
            onClick={() => handleCopy(htmlSnippet, "html")}
          >
            {copied === "html" ? (
              <Check className="h-3.5 w-3.5 text-green-500" />
            ) : (
              <Copy className="h-3.5 w-3.5" />
            )}
          </Button>
          <pre className="overflow-x-auto border border-white/[0.06] bg-zinc-900/50 p-4 text-xs text-zinc-300">
            <code>{htmlSnippet}</code>
          </pre>
        </TabPanel>
        <TabPanel className="relative">
          <Button
            plain
            className="absolute right-2 top-2"
            onClick={() => handleCopy(manifestJson, "manifest")}
          >
            {copied === "manifest" ? (
              <Check className="h-3.5 w-3.5 text-green-500" />
            ) : (
              <Copy className="h-3.5 w-3.5" />
            )}
          </Button>
          <pre className="overflow-x-auto border border-white/[0.06] bg-zinc-900/50 p-4 text-xs text-zinc-300">
            <code>{manifestJson}</code>
          </pre>
        </TabPanel>
      </TabPanels>
    </TabGroup>
  );
}
