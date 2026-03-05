"use client";

import { useState, useCallback, useEffect } from "react";
import { TabGroup, TabList, Tab, TabPanels, TabPanel } from "@headlessui/react";
import clsx from "clsx";
import type { OGData } from "@/lib/og-types";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Subheading } from "@/components/ui/heading";
import { Text } from "@/components/ui/text";
import { HLine } from "@/components/h-line";
import { TwitterCard } from "@/components/twitter-card";
import { FacebookCard } from "@/components/facebook-card";
import { LinkedInCard } from "@/components/linkedin-card";
import { AuditScore } from "@/components/audit-score";
import { MetaTable } from "@/components/meta-table";
import { Search, Loader2, Globe, Link2, Check } from "lucide-react";

const EXAMPLE_URLS = ["vercel.com", "github.com", "stripe.com", "linear.app"];
const platformTabs = ["All", "Twitter", "Facebook", "LinkedIn"];

export function OGPreview() {
  const [url, setUrl] = useState("");
  const [data, setData] = useState<OGData | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [shareCopied, setShareCopied] = useState(false);

  const fetchOG = useCallback(async (targetUrl: string) => {
    if (!targetUrl.trim()) return;
    setLoading(true);
    setError(null);
    setData(null);
    try {
      const res = await fetch(`/api/og?url=${encodeURIComponent(targetUrl.trim())}`);
      const json = await res.json();
      if (!res.ok) {
        setError(json.error || "Failed to fetch OG data");
        // Clear URL param on error
        window.history.replaceState(null, "", window.location.pathname);
        return;
      }
      setData(json);
      // Sync the analyzed URL into the address bar for shareability
      const params = new URLSearchParams();
      params.set("url", targetUrl.trim());
      window.history.replaceState(null, "", `?${params.toString()}`);
    } catch {
      setError("Network error. Please try again.");
    } finally {
      setLoading(false);
    }
  }, []);

  // On mount: auto-analyze if ?url= param is present
  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    const preloadUrl = params.get("url");
    if (preloadUrl) {
      setUrl(preloadUrl);
      fetchOG(preloadUrl);
    }
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const handleShareCopy = useCallback(async () => {
    try {
      await navigator.clipboard.writeText(window.location.href);
    } catch {
      const input = document.createElement("input");
      input.value = window.location.href;
      document.body.appendChild(input);
      input.select();
      document.execCommand("copy");
      document.body.removeChild(input);
    }
    setShareCopied(true);
    setTimeout(() => setShareCopied(false), 2000);
  }, []);

  const handleSubmit = useCallback(
    (e: React.FormEvent) => {
      e.preventDefault();
      fetchOG(url);
    },
    [url, fetchOG]
  );

  const handleExample = useCallback(
    (exampleUrl: string) => {
      setUrl(exampleUrl);
      fetchOG(exampleUrl);
    },
    [fetchOG]
  );

  return (
    <div>
      {/* URL Input */}
      <section className="py-6">
        <div className="mb-4 flex items-center gap-2">
          <Globe className="h-5 w-5 text-brand-11" />
          <Subheading level={2}>Enter a URL to preview</Subheading>
        </div>
        <form onSubmit={handleSubmit} className="flex gap-2">
          <div className="flex-1">
            <Input
              type="url"
              placeholder="https://example.com"
              value={url}
              onChange={(e) => setUrl(e.target.value)}
            />
          </div>
          <Button type="submit" disabled={loading || !url.trim()} color="indigo">
            {loading ? (
              <Loader2 data-slot="icon" className="h-4 w-4 animate-spin" />
            ) : (
              <Search data-slot="icon" className="h-4 w-4" />
            )}
            Analyze
          </Button>
        </form>
        <div className="mt-3 flex flex-wrap items-center gap-2">
          <Text className="text-sm">Try:</Text>
          {EXAMPLE_URLS.map((ex) => (
            <button key={ex} onClick={() => handleExample(ex)}>
              <Badge color="zinc" className="cursor-pointer">{ex}</Badge>
            </button>
          ))}
        </div>
      </section>

      {/* Error */}
      {error && (
        <>
          <HLine />
          <section className="py-6">
            <div className="rounded-md border border-red-500/30 bg-red-500/10 p-4">
              <Text className="text-sm text-red-400">{error}</Text>
            </div>
          </section>
        </>
      )}

      {/* Loading */}
      {loading && (
        <div className="flex items-center justify-center py-12">
          <Loader2 className="h-8 w-8 animate-spin text-brand-10" />
        </div>
      )}

      {/* Results */}
      {data && (
        <>
          {/* Platform Previews */}
          <HLine />
          <section className="py-6">
            <Subheading level={2} className="mb-4">Platform Previews</Subheading>
            <TabGroup>
              <TabList className="flex gap-1 rounded-md bg-brand-2 p-1 w-fit">
                {platformTabs.map((name) => (
                  <Tab
                    key={name}
                    className={clsx(
                      "rounded-md px-3 py-1.5 text-sm font-medium outline-none transition",
                      "text-brand-11 hover:text-brand-12",
                      "data-selected:bg-brand-3 data-selected:text-brand-12"
                    )}
                  >
                    {name}
                  </Tab>
                ))}
              </TabList>
              <TabPanels className="mt-4">
                <TabPanel className="space-y-6">
                  <div>
                    <Text className="mb-2 text-sm">Twitter / X</Text>
                    <TwitterCard data={data} />
                  </div>
                  <div>
                    <Text className="mb-2 text-sm">Facebook</Text>
                    <FacebookCard data={data} />
                  </div>
                  <div>
                    <Text className="mb-2 text-sm">LinkedIn</Text>
                    <LinkedInCard data={data} />
                  </div>
                </TabPanel>
                <TabPanel>
                  <TwitterCard data={data} />
                </TabPanel>
                <TabPanel>
                  <FacebookCard data={data} />
                </TabPanel>
                <TabPanel>
                  <LinkedInCard data={data} />
                </TabPanel>
              </TabPanels>
            </TabGroup>
          </section>

          {/* Audit Score */}
          <HLine />
          <section className="py-6">
            <div className="mb-4 flex items-center justify-between">
              <Subheading level={2}>OG Audit Score</Subheading>
              {/* Share Analysis button */}
              <button
                onClick={handleShareCopy}
                className={clsx(
                  "inline-flex items-center gap-1.5 rounded-md px-3 py-1.5 text-xs font-medium transition-all",
                  shareCopied
                    ? "bg-emerald-500/15 text-emerald-400 border border-emerald-500/30"
                    : "bg-brand-3 text-brand-11 hover:bg-brand-4 hover:text-brand-12 border border-brand-5"
                )}
                title="Copy a link to this analysis"
              >
                {shareCopied ? (
                  <><Check className="h-3.5 w-3.5" /> Copied!</>
                ) : (
                  <><Link2 className="h-3.5 w-3.5" /> Share Analysis</>
                )}
              </button>
            </div>
            <AuditScore data={data} />
          </section>

          {/* Raw Meta Tags */}
          <HLine />
          <section className="py-6">
            <Subheading level={2} className="mb-4">Raw Meta Tags</Subheading>
            <MetaTable data={data} />
          </section>
        </>
      )}
    </div>
  );
}
