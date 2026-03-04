"use client";

import { TabGroup, TabList, Tab, TabPanels, TabPanel } from "@headlessui/react";
import { OGPreview } from "@/components/og-preview";
import { FaviconGen } from "@/components/favicon-gen";
import { Eye, ImageIcon } from "lucide-react";
import clsx from "clsx";

const tabs = [
  { name: "OG Preview", icon: Eye },
  { name: "Favicon Generator", icon: ImageIcon },
];

export default function Home() {
  return (
    <div className="min-h-screen">
      {/* Header — full-width border lines, content centered */}
      <header className="border-b border-white/[0.08]">
        <div className="mx-auto flex max-w-5xl items-center justify-between px-6 py-4">
          <div className="flex items-center gap-2.5">
            <div className="flex h-7 w-7 items-center justify-center rounded-md bg-indigo-600 text-xs font-bold">
              S
            </div>
            <span className="text-sm font-semibold tracking-tight text-white">
              SEO Toolkit
            </span>
          </div>
          <span className="text-xs text-zinc-500">
            OG Preview & Favicon Generator
          </span>
        </div>
      </header>

      <TabGroup>
        {/* Tab bar — full-width border line */}
        <div className="border-b border-white/[0.08]">
          <div className="mx-auto max-w-5xl px-6">
            <TabList className="-mb-px flex gap-0">
              {tabs.map((tab) => (
                <Tab
                  key={tab.name}
                  className={clsx(
                    "flex items-center gap-1.5 border-b-2 px-4 py-3 text-sm font-medium outline-none transition",
                    "border-transparent text-zinc-500 hover:text-zinc-300",
                    "data-selected:border-indigo-500 data-selected:text-white"
                  )}
                >
                  <tab.icon className="h-4 w-4" />
                  {tab.name}
                </Tab>
              ))}
            </TabList>
          </div>
        </div>

        {/* Main content area — bordered sides that frame the content column */}
        <div className="relative">
          {/* Vertical side borders extending full height */}
          <div className="pointer-events-none absolute inset-0 mx-auto max-w-5xl border-x border-white/[0.06]" />

          <div className="mx-auto max-w-5xl px-6 py-8">
            <TabPanels>
              <TabPanel>
                <OGPreview />
              </TabPanel>
              <TabPanel>
                <FaviconGen />
              </TabPanel>
            </TabPanels>
          </div>
        </div>
      </TabGroup>
    </div>
  );
}
