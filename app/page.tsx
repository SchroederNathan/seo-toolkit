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
    <div className="mx-auto min-h-screen max-w-6xl px-4 py-8">
      <div className="overflow-hidden rounded-xl border border-white/[0.06] bg-white/[0.06]">
        <div className="grid grid-cols-1 gap-px">
          {/* Header row */}
          <header className="bg-zinc-950 px-6 py-5 sm:px-8">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="flex h-8 w-8 items-center justify-center border border-white/[0.08] bg-white/[0.03] font-mono text-sm font-semibold text-zinc-300">
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

          {/* Tab navigation + content */}
          <TabGroup>
            <div className="bg-zinc-950">
              <TabList className="flex">
                {tabs.map((tab) => (
                  <Tab
                    key={tab.name}
                    className={clsx(
                      "flex items-center gap-2 px-6 py-3 text-sm font-medium outline-none transition",
                      "border-r border-white/[0.06]",
                      "text-zinc-500 hover:bg-white/[0.02] hover:text-zinc-300",
                      "data-selected:bg-white/[0.03] data-selected:text-white"
                    )}
                  >
                    <tab.icon className="h-4 w-4" />
                    {tab.name}
                  </Tab>
                ))}
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
      </div>
    </div>
  );
}
