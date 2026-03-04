"use client";

import { useState, useCallback } from "react";
import { TabGroup, TabList, Tab, TabPanels, TabPanel } from "@headlessui/react";
import clsx from "clsx";
import { Copy, Check } from "lucide-react";
import { generateHtmlSnippet, generateManifest } from "@/lib/favicon-utils";
import { copyToClipboard } from "@/lib/clipboard";

function CodeBlock({ code, id }: { code: string; id: string }) {
  const [copied, setCopied] = useState(false);

  const handleCopy = useCallback(async () => {
    await copyToClipboard(code);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  }, [code]);

  return (
    <div className="relative">
      <button
        onClick={handleCopy}
        className="absolute right-3 top-3 z-10 rounded-md p-1.5 text-brand-10 hover:bg-brand-3 hover:text-brand-12 transition-colors"
      >
        {copied ? (
          <Check className="h-4 w-4 text-green-500" />
        ) : (
          <Copy className="h-4 w-4" />
        )}
      </button>
      <pre className="overflow-x-auto rounded-md border border-brand-3 bg-brand-2 p-4 pr-12 text-xs text-brand-11">
        <code>{code}</code>
      </pre>
    </div>
  );
}

export function CodeSnippets({ appName }: { appName: string }) {
  const htmlSnippet = generateHtmlSnippet(appName || "My App");
  const manifestJson = generateManifest(appName || "My App");

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
        <TabPanel>
          <CodeBlock code={htmlSnippet} id="html" />
        </TabPanel>
        <TabPanel>
          <CodeBlock code={manifestJson} id="manifest" />
        </TabPanel>
      </TabPanels>
    </TabGroup>
  );
}
