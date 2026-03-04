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

/**
 * Infinite border lines that extend way beyond the container.
 * Placed on the content column edges so they run through header, tabs, content, everything.
 */
function GridLines() {
  return (
    <>
      {/* Left vertical line */}
      <div
        className="pointer-events-none absolute left-0 top-0 w-0 border-l border-white/[0.06]"
        style={{ height: 4000, marginTop: -2000 }}
      />
      {/* Right vertical line */}
      <div
        className="pointer-events-none absolute right-0 top-0 w-0 border-l border-white/[0.06]"
        style={{ height: 4000, marginTop: -2000 }}
      />
    </>
  );
}

/** Full-width horizontal border that bleeds past the container */
function HLine() {
  return (
    <div
      className="pointer-events-none absolute left-0 right-0 h-0 border-t border-white/[0.06]"
      style={{ width: 4000, marginLeft: -2000 }}
    />
  );
}

export default function Home() {
  return (
    <div className="min-h-screen overflow-x-hidden">
      {/* Content column — relative so GridLines attach here */}
      <div className="relative mx-auto max-w-5xl px-6">
        <GridLines />

        {/* Header */}
        <header className="relative flex items-center justify-between py-4">
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
          {/* Bottom border — extends full screen width */}
          <HLine />
          <div className="absolute bottom-0 left-0 right-0" />
        </header>

        <TabGroup>
          {/* Tab bar */}
          <div className="relative">
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
            {/* Bottom border of tab bar — full width */}
            <div className="absolute bottom-0">
              <HLine />
            </div>
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
