"use client";

import { useState, useCallback, useRef, useEffect } from "react";
import { TabGroup, TabList, Tab, TabPanels, TabPanel } from "@headlessui/react";
import clsx from "clsx";
import type { FaviconSize } from "@/lib/og-types";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Field, Label } from "@/components/ui/fieldset";
import { Subheading } from "@/components/ui/heading";
import { HLine } from "@/components/h-line";
import { FaviconPreview } from "@/components/favicon-preview";
import { CodeSnippets } from "@/components/code-snippets";
import {
  generateFromImage,
  generateFromText,
  generateFromColor,
  packageAsZip,
  downloadBlob,
} from "@/lib/favicon-utils";
import { Upload, Type, Palette, Download, Loader2, ImageIcon } from "lucide-react";

const modeTabs = [
  { name: "Upload", icon: Upload },
  { name: "Emoji/Text", icon: Type },
  { name: "Color", icon: Palette },
];

export function FaviconGen() {
  const [modeIndex, setModeIndex] = useState(1);
  const [favicons, setFavicons] = useState<FaviconSize[]>([]);
  const [appName, setAppName] = useState("My App");
  const [generating, setGenerating] = useState(false);

  const [emojiText, setEmojiText] = useState("🚀");
  const [emojiBg, setEmojiBg] = useState("#1e1e2e");
  const [emojiFg, setEmojiFg] = useState("#ffffff");

  const [solidColor, setSolidColor] = useState("#6366f1");

  const [imageUrl, setImageUrl] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const debounceRef = useRef<ReturnType<typeof setTimeout>>(null);

  const mode = modeIndex === 0 ? "upload" : modeIndex === 1 ? "emoji" : "color";

  useEffect(() => {
    if (mode === "emoji" && emojiText.trim()) {
      if (debounceRef.current) clearTimeout(debounceRef.current);
      debounceRef.current = setTimeout(async () => {
        setGenerating(true);
        try {
          const result = await generateFromText(emojiText, emojiBg, emojiFg);
          setFavicons(result);
        } finally {
          setGenerating(false);
        }
      }, 300);
    }
    return () => { if (debounceRef.current) clearTimeout(debounceRef.current); };
  }, [mode, emojiText, emojiBg, emojiFg]);

  useEffect(() => {
    if (mode === "color" && solidColor) {
      if (debounceRef.current) clearTimeout(debounceRef.current);
      debounceRef.current = setTimeout(async () => {
        setGenerating(true);
        try {
          const result = await generateFromColor(solidColor);
          setFavicons(result);
        } finally {
          setGenerating(false);
        }
      }, 300);
    }
    return () => { if (debounceRef.current) clearTimeout(debounceRef.current); };
  }, [mode, solidColor]);

  const handleFileChange = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    setImageUrl(URL.createObjectURL(file));
  }, []);

  const handleGenerateFromImage = useCallback(async () => {
    if (!imageUrl) return;
    setGenerating(true);
    try {
      const result = await generateFromImage(imageUrl);
      setFavicons(result);
    } finally {
      setGenerating(false);
    }
  }, [imageUrl]);

  const handleDownloadZip = useCallback(async () => {
    if (favicons.length === 0) return;
    const zip = await packageAsZip(favicons, appName || "My App");
    downloadBlob(zip, "favicons.zip");
  }, [favicons, appName]);

  const handleModeChange = useCallback((index: number) => {
    setModeIndex(index);
    setFavicons([]);
  }, []);

  return (
    <div>
      {/* Favicon Source */}
      <section className="py-6">
        <div className="mb-4 flex items-center gap-2">
          <ImageIcon className="h-5 w-5 text-brand-11" />
          <Subheading level={2}>Favicon Source</Subheading>
        </div>

        <TabGroup selectedIndex={modeIndex} onChange={handleModeChange}>
          <TabList className="flex gap-1 rounded-lg bg-brand-2 p-1 w-fit">
            {modeTabs.map((tab) => (
              <Tab
                key={tab.name}
                className={clsx(
                  "flex items-center gap-1.5 rounded-md px-3 py-1.5 text-sm font-medium outline-none transition",
                  "text-brand-11 hover:text-brand-12",
                  "data-selected:bg-brand-3 data-selected:text-brand-12"
                )}
              >
                <tab.icon className="h-3.5 w-3.5" />
                {tab.name}
              </Tab>
            ))}
          </TabList>

          <TabPanels className="mt-4">
            <TabPanel className="space-y-4">
              <Field>
                <Label>Select an image file</Label>
                <input
                  ref={fileInputRef}
                  type="file"
                  accept="image/*"
                  onChange={handleFileChange}
                  className="mt-2 block w-full text-sm text-brand-11 file:mr-4 file:rounded-lg file:border-0 file:bg-brand-3 file:px-4 file:py-2 file:text-sm file:font-medium file:text-brand-12 hover:file:bg-white/20"
                />
              </Field>
              {imageUrl && (
                <div className="flex items-center gap-4">
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img src={imageUrl} alt="Preview" className="h-16 w-16 rounded-lg border border-brand-3 object-cover" />
                  <Button onClick={handleGenerateFromImage} disabled={generating} color="indigo">
                    {generating ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : null}
                    Generate Favicons
                  </Button>
                </div>
              )}
            </TabPanel>

            <TabPanel className="space-y-4">
              <div className="grid gap-4 sm:grid-cols-3">
                <Field>
                  <Label>Emoji or Text</Label>
                  <Input value={emojiText} onChange={(e) => setEmojiText(e.target.value)} placeholder="🚀" maxLength={4} />
                </Field>
                <Field>
                  <Label>Background</Label>
                  <div className="mt-2 flex gap-2">
                    <input type="color" value={emojiBg} onChange={(e) => setEmojiBg(e.target.value)} className="h-9 w-12 cursor-pointer rounded border border-brand-3 bg-transparent p-1" />
                    <div className="flex-1">
                      <Input value={emojiBg} onChange={(e) => setEmojiBg(e.target.value)} className="font-mono text-sm" />
                    </div>
                  </div>
                </Field>
                <Field>
                  <Label>Text Color</Label>
                  <div className="mt-2 flex gap-2">
                    <input type="color" value={emojiFg} onChange={(e) => setEmojiFg(e.target.value)} className="h-9 w-12 cursor-pointer rounded border border-brand-3 bg-transparent p-1" />
                    <div className="flex-1">
                      <Input value={emojiFg} onChange={(e) => setEmojiFg(e.target.value)} className="font-mono text-sm" />
                    </div>
                  </div>
                </Field>
              </div>
            </TabPanel>

            <TabPanel className="space-y-4">
              <Field>
                <Label>Solid Color</Label>
                <div className="mt-2 flex gap-2">
                  <input type="color" value={solidColor} onChange={(e) => setSolidColor(e.target.value)} className="h-9 w-12 cursor-pointer rounded border border-brand-3 bg-transparent p-1" />
                  <div className="max-w-[200px]">
                    <Input value={solidColor} onChange={(e) => setSolidColor(e.target.value)} className="font-mono text-sm" />
                  </div>
                </div>
              </Field>
            </TabPanel>
          </TabPanels>
        </TabGroup>
      </section>

      {/* App Name */}
      <HLine />
      <section className="py-6">
        <Subheading level={2} className="mb-4">App Name</Subheading>
        <div className="max-w-sm">
          <Input value={appName} onChange={(e) => setAppName(e.target.value)} placeholder="My App" />
        </div>
      </section>

      {generating && (
        <div className="flex items-center justify-center py-8">
          <Loader2 className="h-8 w-8 animate-spin text-brand-10" />
        </div>
      )}

      {favicons.length > 0 && !generating && (
        <>
          {/* Preview */}
          <HLine />
          <section className="py-6">
            <div className="mb-4 flex items-center justify-between">
              <Subheading level={2}>Preview</Subheading>
              <Button onClick={handleDownloadZip} outline>
                <Download className="mr-2 h-4 w-4" />
                Download ZIP
              </Button>
            </div>
            <FaviconPreview favicons={favicons} />
          </section>

          {/* Code Snippets */}
          <HLine />
          <section className="py-6">
            <Subheading level={2} className="mb-4">Code Snippets</Subheading>
            <CodeSnippets appName={appName || "My App"} />
          </section>
        </>
      )}
    </div>
  );
}
