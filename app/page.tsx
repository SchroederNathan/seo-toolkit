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

/** Vertical lines on the content column edges — extend infinitely */
function GridLines() {
  return (
    <>
      <div
        className="pointer-events-none absolute left-0 top-0 w-0 border-l border-white/[0.06]"
        style={{ height: 4000, marginTop: -2000 }}
      />
      <div
        className="pointer-events-none absolute right-0 top-0 w-0 border-l border-white/[0.06]"
        style={{ height: 4000, marginTop: -2000 }}
      />
    </>
  );
}

/** Full-width horizontal border — must be inside a positioned parent, pinned with top/bottom */
function HLine({ className }: { className?: string }) {
  return (
    <div
      className={clsx("pointer-events-none absolute left-0 h-0 border-t border-white/[0.06]", className)}
      style={{ width: 4000, marginLeft: -2000 }}
    />
  );
}

export default function Home() {
  return (
    <div className="min-h-screen overflow-x-hidden">
      <div className="relative mx-auto max-w-5xl px-6">
        <GridLines />

        {/* Header */}
        <header className="relative py-4">
          <div className="flex items-center justify-between">
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
          {/* Border at the bottom of header */}
          <HLine className="bottom-0" />
        </header>

        <TabGroup>
          {/* Tab bar */}
          <div className="relative">
            <TabList className="flex gap-0">
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
            {/* Border at the bottom of tab bar */}
            <HLine className="bottom-0" />
          </div>

          {/* Content */}
          <TabPanels className="py-8">
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
  );
}
