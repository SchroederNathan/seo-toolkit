"use client";

import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import { OGPreview } from "@/components/og-preview";
import { FaviconGen } from "@/components/favicon-gen";
import { Eye, ImageIcon } from "lucide-react";

export default function Home() {
  return (
    <main className="mx-auto max-w-4xl px-4 py-8">
      <div className="mb-8 text-center">
        <h1 className="text-3xl font-bold tracking-tight">OG Toolkit</h1>
        <p className="mt-2 text-muted-foreground">
          Preview social cards &amp; generate favicons — all in one place.
        </p>
      </div>

      <Tabs defaultValue="og-preview">
        <TabsList className="mx-auto w-fit">
          <TabsTrigger value="og-preview">
            <Eye className="mr-1.5 h-4 w-4" />
            OG Preview
          </TabsTrigger>
          <TabsTrigger value="favicon-gen">
            <ImageIcon className="mr-1.5 h-4 w-4" />
            Favicon Generator
          </TabsTrigger>
        </TabsList>

        <TabsContent value="og-preview" className="mt-6">
          <OGPreview />
        </TabsContent>

        <TabsContent value="favicon-gen" className="mt-6">
          <FaviconGen />
        </TabsContent>
      </Tabs>
    </main>
  );
}
