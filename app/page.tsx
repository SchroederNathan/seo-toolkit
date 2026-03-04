"use client";

import { TabGroup, TabList, Tab, TabPanels, TabPanel } from "@headlessui/react";
import { OGPreview } from "@/components/og-preview";
import { FaviconGen } from "@/components/favicon-gen";
import { Heading } from "@/components/ui/heading";
import { Text } from "@/components/ui/text";
import { Eye, ImageIcon } from "lucide-react";
import clsx from "clsx";

const tabs = [
  { name: "OG Preview", icon: Eye },
  { name: "Favicon Generator", icon: ImageIcon },
];

export default function Home() {
  return (
    <main className="mx-auto max-w-4xl px-4 py-8">
      <div className="mb-8 text-center">
        <Heading level={1}>SEO Toolkit</Heading>
        <Text className="mt-2">
          Preview social cards &amp; generate favicons — all in one place.
        </Text>
      </div>

      <TabGroup>
        <TabList className="mx-auto flex w-fit gap-1 rounded-lg bg-white/5 p-1">
          {tabs.map((tab) => (
            <Tab
              key={tab.name}
              className={clsx(
                "flex items-center gap-1.5 rounded-md px-3 py-1.5 text-sm font-medium outline-none transition",
                "text-zinc-400 hover:text-white",
                "data-selected:bg-white/10 data-selected:text-white"
              )}
            >
              <tab.icon className="h-4 w-4" />
              {tab.name}
            </Tab>
          ))}
        </TabList>

        <TabPanels className="mt-6">
          <TabPanel>
            <OGPreview />
          </TabPanel>
          <TabPanel>
            <FaviconGen />
          </TabPanel>
        </TabPanels>
      </TabGroup>
    </main>
  );
}
