"use client";

import { TabGroup, TabList, Tab, TabPanels, TabPanel } from "@headlessui/react";
import { OGPreview } from "@/components/og-preview";
import { FaviconGen } from "@/components/favicon-gen";
import { Text } from "@/components/ui/text";
import { Eye, ImageIcon } from "lucide-react";
import clsx from "clsx";

const tabs = [
  { name: "OG Preview", icon: Eye },
  { name: "Favicon Generator", icon: ImageIcon },
];

export default function Home() {
  return (
    <div className="mx-auto min-h-screen max-w-5xl border-x border-white/[0.08]">
      {/* Header row */}
      <header className="border-b border-white/[0.08] px-6 py-5 sm:px-8">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="flex h-8 w-8 items-center justify-center rounded-md border border-white/[0.08] bg-white/[0.03] font-mono text-sm font-semibold text-zinc-300">
              S
            </div>
            <span className="text-sm font-semibold tracking-tight text-white">
              SEO Toolkit
            </span>
          </div>
          <Text className="text-xs text-zinc-500">
            OG Preview &amp; Favicon Generator
          </Text>
        </div>
      </header>

      {/* Tab navigation row */}
      <TabGroup>
        <div className="border-b border-white/[0.08]">
          <TabList className="flex">
            {tabs.map((tab) => (
              <Tab
                key={tab.name}
                className={clsx(
                  "flex items-center gap-2 border-r border-white/[0.08] px-6 py-3 text-sm font-medium outline-none transition",
                  "text-zinc-500 hover:bg-white/[0.02] hover:text-zinc-300",
                  "data-selected:bg-white/[0.03] data-selected:text-white"
                )}
              >
                <tab.icon className="h-4 w-4" />
                {tab.name}
              </Tab>
            ))}
            {/* Empty cell to fill remaining space */}
            <div className="flex-1" />
          </TabList>
        </div>

        {/* Content area */}
        <TabPanels>
          <TabPanel>
            <OGPreview />
          </TabPanel>
          <TabPanel>
            <FaviconGen />
          </TabPanel>
        </TabPanels>
      </TabGroup>
    </div>
  );
}
