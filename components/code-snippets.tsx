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
      <TabList className="flex w-fit border border-white/[0.08] rounded-md">
        {["HTML Snippet", "manifest.json"].map((name, i) => (
          <Tab
            key={name}
            className={clsx(
              "px-3 py-1.5 text-sm font-medium outline-none transition",
              i === 0 && "border-r border-white/[0.08]",
              "text-zinc-500 hover:text-zinc-300 hover:bg-white/[0.03]",
              "data-selected:bg-white/[0.05] data-selected:text-white"
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
          <pre className="overflow-x-auto rounded-lg border border-white/[0.08] bg-zinc-900/50 p-4 text-xs text-zinc-300">
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
          <pre className="overflow-x-auto rounded-lg border border-white/[0.08] bg-zinc-900/50 p-4 text-xs text-zinc-300">
            <code>{manifestJson}</code>
          </pre>
        </TabPanel>
      </TabPanels>
    </TabGroup>
  );
}
