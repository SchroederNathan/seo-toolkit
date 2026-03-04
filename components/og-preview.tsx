"use client";

import { useState, useCallback } from "react";
import { TabGroup, TabList, Tab, TabPanels, TabPanel } from "@headlessui/react";
import clsx from "clsx";
import type { OGData } from "@/lib/og-types";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Subheading } from "@/components/ui/heading";
import { Text } from "@/components/ui/text";
import { Divider } from "@/components/ui/divider";
import { TwitterCard } from "@/components/twitter-card";
import { FacebookCard } from "@/components/facebook-card";
import { LinkedInCard } from "@/components/linkedin-card";
import { AuditScore } from "@/components/audit-score";
import { MetaTable } from "@/components/meta-table";
import { Search, Loader2, Globe } from "lucide-react";

const EXAMPLE_URLS = ["vercel.com", "github.com", "stripe.com", "linear.app"];

const platformTabs = ["All", "Twitter", "Facebook", "LinkedIn"];

export function OGPreview() {
  const [url, setUrl] = useState("");
  const [data, setData] = useState<OGData | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const fetchOG = useCallback(async (targetUrl: string) => {
    if (!targetUrl.trim()) return;

    setLoading(true);
    setError(null);
    setData(null);

    try {
      const res = await fetch(
        `/api/og?url=${encodeURIComponent(targetUrl.trim())}`
      );
      const json = await res.json();

      if (!res.ok) {
        setError(json.error || "Failed to fetch OG data");
        return;
      }

      setData(json);
    } catch {
      setError("Network error. Please try again.");
    } finally {
      setLoading(false);
    }
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
    <div className="space-y-6">
      {/* URL Input Section */}
      <section className="rounded-lg border border-white/10 bg-white/2.5 p-6">
        <div className="mb-4 flex items-center gap-2">
          <Globe className="h-5 w-5 text-zinc-400" />
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
              <Loader2 className="mr-2 h-4 w-4 animate-spin" />
            ) : (
              <Search className="mr-2 h-4 w-4" />
            )}
            Analyze
          </Button>
        </form>
        <div className="mt-3 flex flex-wrap items-center gap-2">
          <Text className="text-sm">Try:</Text>
          {EXAMPLE_URLS.map((ex) => (
            <button key={ex} onClick={() => handleExample(ex)}>
              <Badge color="zinc" className="cursor-pointer">
                {ex}
              </Badge>
            </button>
          ))}
        </div>
      </section>

      {/* Error */}
      {error && (
        <section className="rounded-lg border border-red-500/30 bg-red-500/10 p-4">
          <Text className="text-sm text-red-400">{error}</Text>
        </section>
      )}

      {/* Loading */}
      {loading && (
        <div className="flex items-center justify-center py-12">
          <Loader2 className="h-8 w-8 animate-spin text-zinc-500" />
        </div>
      )}

      {/* Results */}
      {data && (
        <div className="space-y-6">
          {/* Platform Previews */}
          <section className="rounded-lg border border-white/10 bg-white/2.5 p-6">
            <Subheading level={2} className="mb-4">Platform Previews</Subheading>
            <TabGroup>
              <TabList className="flex gap-1 rounded-lg bg-white/5 p-1 w-fit">
                {platformTabs.map((name) => (
                  <Tab
                    key={name}
                    className={clsx(
                      "rounded-md px-3 py-1.5 text-sm font-medium outline-none transition",
                      "text-zinc-400 hover:text-white",
                      "data-selected:bg-white/10 data-selected:text-white"
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
                  <Divider soft />
                  <div>
                    <Text className="mb-2 text-sm">Facebook</Text>
                    <FacebookCard data={data} />
                  </div>
                  <Divider soft />
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
          <section className="rounded-lg border border-white/10 bg-white/2.5 p-6">
            <Subheading level={2} className="mb-4">OG Audit Score</Subheading>
            <AuditScore data={data} />
          </section>

          {/* Raw Meta Tags */}
          <section className="rounded-lg border border-white/10 bg-white/2.5 p-6">
            <Subheading level={2} className="mb-4">Raw Meta Tags</Subheading>
            <MetaTable data={data} />
          </section>
        </div>
      )}
    </div>
  );
}
