"use client";

import { useState, useEffect } from "react";
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
        className="pointer-events-none absolute left-0 top-0 w-0 border-l border-brand-3"
        style={{ height: 4000, marginTop: -2000 }}
      />
      <div
        className="pointer-events-none absolute right-0 top-0 w-0 border-l border-brand-3"
        style={{ height: 4000, marginTop: -2000 }}
      />
    </>
  );
}

/** Full-width horizontal border pinned inside a relative parent */
function HLine({ className }: { className?: string }) {
  return (
    <div className={clsx("relative", className)}>
      <div
        className="pointer-events-none absolute left-0 h-0 border-t border-brand-3"
        style={{ width: 4000, marginLeft: -2000 }}
      />
    </div>
  );
}

export default function Home() {
  // If ?url= param is present on load, default to the OG Preview tab (index 0)
  const [selectedTab, setSelectedTab] = useState(0);
  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    if (params.get("url")) setSelectedTab(0);
  }, []);

  return (
    <div className="min-h-screen overflow-x-hidden">
      <div className="relative mx-auto max-w-5xl px-6">
        <GridLines />

        {/* Header */}
        <header className="py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2.5">
              <div className="flex h-7 w-7 items-center justify-center rounded-md bg-brand-8 text-xs font-bold">
                S
              </div>
              <span className="text-sm font-semibold tracking-tight text-brand-12">
                SEO Toolkit
              </span>
            </div>
            <span className="text-xs text-brand-10">
              OG Preview & Favicon Generator
            </span>
          </div>
        </header>

        <HLine />

        <TabGroup selectedIndex={selectedTab} onChange={setSelectedTab}>
          {/* Tab bar */}
          <TabList className="flex gap-0">
            {tabs.map((tab) => (
              <Tab
                key={tab.name}
                className={clsx(
                  "flex items-center gap-1.5 border-b-2 px-4 py-3 text-sm font-medium outline-none transition",
                  "border-transparent text-brand-10 hover:text-brand-11",
                  "data-selected:border-brand-9 data-selected:text-brand-12"
                )}
              >
                <tab.icon className="h-4 w-4" />
                {tab.name}
              </Tab>
            ))}
          </TabList>

          <HLine />

          {/* Content */}
          <TabPanels>
            <TabPanel>
              <OGPreview />
            </TabPanel>
            <TabPanel>
              <FaviconGen />
            </TabPanel>
          </TabPanels>
        </TabGroup>

        <HLine />

        <footer className="py-4 text-center text-xs text-brand-10">
          © {new Date().getFullYear()} Made by{" "}
          <a
            href="https://nathanschroeder.dev"
            target="_blank"
            rel="noopener noreferrer"
            className="text-brand-11 hover:text-brand-12 transition-colors"
          >
            Nathan
          </a>
        </footer>
      </div>
    </div>
  );
}
