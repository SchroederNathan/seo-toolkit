"use client";

import { useState, useCallback, useRef, useEffect } from "react";
import type { FaviconSize } from "@/lib/og-types";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import { Separator } from "@/components/ui/separator";
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

export function FaviconGen() {
  const [mode, setMode] = useState("emoji");
  const [favicons, setFavicons] = useState<FaviconSize[]>([]);
  const [appName, setAppName] = useState("My App");
  const [generating, setGenerating] = useState(false);

  // Emoji/Text mode
  const [emojiText, setEmojiText] = useState("🚀");
  const [emojiBg, setEmojiBg] = useState("#1e1e2e");
  const [emojiFg, setEmojiFg] = useState("#ffffff");

  // Color mode
  const [solidColor, setSolidColor] = useState("#6366f1");

  // Upload mode
  const [imageUrl, setImageUrl] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  // Debounce timer ref
  const debounceRef = useRef<ReturnType<typeof setTimeout>>(null);

  // Auto-generate for emoji and color modes
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
    return () => {
      if (debounceRef.current) clearTimeout(debounceRef.current);
    };
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
    return () => {
      if (debounceRef.current) clearTimeout(debounceRef.current);
    };
  }, [mode, solidColor]);

  const handleFileChange = useCallback(
    (e: React.ChangeEvent<HTMLInputElement>) => {
      const file = e.target.files?.[0];
      if (!file) return;

      const url = URL.createObjectURL(file);
      setImageUrl(url);
    },
    []
  );

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

  const handleModeChange = useCallback((value: string) => {
    setMode(value);
    setFavicons([]);
  }, []);

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <ImageIcon className="h-5 w-5" />
            Favicon Source
          </CardTitle>
        </CardHeader>
        <CardContent>
          <Tabs value={mode} onValueChange={handleModeChange}>
            <TabsList>
              <TabsTrigger value="upload">
                <Upload className="mr-1.5 h-3.5 w-3.5" />
                Upload
              </TabsTrigger>
              <TabsTrigger value="emoji">
                <Type className="mr-1.5 h-3.5 w-3.5" />
                Emoji/Text
              </TabsTrigger>
              <TabsTrigger value="color">
                <Palette className="mr-1.5 h-3.5 w-3.5" />
                Color
              </TabsTrigger>
            </TabsList>

            <TabsContent value="upload" className="mt-4 space-y-4">
              <div className="space-y-2">
                <Label>Select an image file</Label>
                <Input
                  ref={fileInputRef}
                  type="file"
                  accept="image/*"
                  onChange={handleFileChange}
                />
              </div>
              {imageUrl && (
                <div className="flex items-center gap-4">
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img
                    src={imageUrl}
                    alt="Preview"
                    className="h-16 w-16 rounded-lg border object-cover"
                  />
                  <Button
                    onClick={handleGenerateFromImage}
                    disabled={generating}
                  >
                    {generating ? (
                      <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    ) : null}
                    Generate Favicons
                  </Button>
                </div>
              )}
            </TabsContent>

            <TabsContent value="emoji" className="mt-4 space-y-4">
              <div className="grid gap-4 sm:grid-cols-3">
                <div className="space-y-2">
                  <Label>Emoji or Text</Label>
                  <Input
                    value={emojiText}
                    onChange={(e) => setEmojiText(e.target.value)}
                    placeholder="🚀"
                    maxLength={4}
                  />
                </div>
                <div className="space-y-2">
                  <Label>Background</Label>
                  <div className="flex gap-2">
                    <Input
                      type="color"
                      value={emojiBg}
                      onChange={(e) => setEmojiBg(e.target.value)}
                      className="h-9 w-12 cursor-pointer p-1"
                    />
                    <Input
                      value={emojiBg}
                      onChange={(e) => setEmojiBg(e.target.value)}
                      className="flex-1 font-mono text-sm"
                    />
                  </div>
                </div>
                <div className="space-y-2">
                  <Label>Text Color</Label>
                  <div className="flex gap-2">
                    <Input
                      type="color"
                      value={emojiFg}
                      onChange={(e) => setEmojiFg(e.target.value)}
                      className="h-9 w-12 cursor-pointer p-1"
                    />
                    <Input
                      value={emojiFg}
                      onChange={(e) => setEmojiFg(e.target.value)}
                      className="flex-1 font-mono text-sm"
                    />
                  </div>
                </div>
              </div>
            </TabsContent>

            <TabsContent value="color" className="mt-4 space-y-4">
              <div className="space-y-2">
                <Label>Solid Color</Label>
                <div className="flex gap-2">
                  <Input
                    type="color"
                    value={solidColor}
                    onChange={(e) => setSolidColor(e.target.value)}
                    className="h-9 w-12 cursor-pointer p-1"
                  />
                  <Input
                    value={solidColor}
                    onChange={(e) => setSolidColor(e.target.value)}
                    className="max-w-[200px] font-mono text-sm"
                  />
                </div>
              </div>
            </TabsContent>
          </Tabs>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>App Name</CardTitle>
        </CardHeader>
        <CardContent>
          <Input
            value={appName}
            onChange={(e) => setAppName(e.target.value)}
            placeholder="My App"
            className="max-w-sm"
          />
        </CardContent>
      </Card>

      {generating && (
        <div className="flex items-center justify-center py-8">
          <Loader2 className="h-8 w-8 animate-spin text-muted-foreground" />
        </div>
      )}

      {favicons.length > 0 && !generating && (
        <>
          <Card>
            <CardHeader className="flex flex-row items-center justify-between">
              <CardTitle>Preview</CardTitle>
              <Button onClick={handleDownloadZip} variant="secondary" size="sm">
                <Download className="mr-2 h-4 w-4" />
                Download ZIP
              </Button>
            </CardHeader>
            <CardContent>
              <FaviconPreview favicons={favicons} />
            </CardContent>
          </Card>

          <Separator />

          <Card>
            <CardHeader>
              <CardTitle>Code Snippets</CardTitle>
            </CardHeader>
            <CardContent>
              <CodeSnippets appName={appName || "My App"} />
            </CardContent>
          </Card>
        </>
      )}
    </div>
  );
}
