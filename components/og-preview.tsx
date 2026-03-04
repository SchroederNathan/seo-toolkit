"use client";

import { useState, useCallback } from "react";
import type { OGData } from "@/lib/og-types";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { TwitterCard } from "@/components/twitter-card";
import { FacebookCard } from "@/components/facebook-card";
import { LinkedInCard } from "@/components/linkedin-card";
import { AuditScore } from "@/components/audit-score";
import { MetaTable } from "@/components/meta-table";
import { Search, Loader2, Globe } from "lucide-react";

const EXAMPLE_URLS = ["vercel.com", "github.com", "stripe.com", "linear.app"];

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
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Globe className="h-5 w-5" />
            Enter a URL to preview
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-3">
          <form onSubmit={handleSubmit} className="flex gap-2">
            <Input
              type="text"
              placeholder="https://example.com"
              value={url}
              onChange={(e) => setUrl(e.target.value)}
              className="flex-1"
            />
            <Button type="submit" disabled={loading || !url.trim()}>
              {loading ? (
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
              ) : (
                <Search className="mr-2 h-4 w-4" />
              )}
              Analyze
            </Button>
          </form>
          <div className="flex flex-wrap gap-2">
            <span className="text-sm text-muted-foreground">Try:</span>
            {EXAMPLE_URLS.map((ex) => (
              <Badge
                key={ex}
                variant="secondary"
                className="cursor-pointer hover:bg-accent"
                onClick={() => handleExample(ex)}
              >
                {ex}
              </Badge>
            ))}
          </div>
        </CardContent>
      </Card>

      {error && (
        <Card className="border-destructive">
          <CardContent className="pt-6">
            <p className="text-sm text-destructive">{error}</p>
          </CardContent>
        </Card>
      )}

      {loading && (
        <div className="flex items-center justify-center py-12">
          <Loader2 className="h-8 w-8 animate-spin text-muted-foreground" />
        </div>
      )}

      {data && (
        <div className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Platform Previews</CardTitle>
            </CardHeader>
            <CardContent>
              <Tabs defaultValue="all">
                <TabsList>
                  <TabsTrigger value="all">All</TabsTrigger>
                  <TabsTrigger value="twitter">Twitter</TabsTrigger>
                  <TabsTrigger value="facebook">Facebook</TabsTrigger>
                  <TabsTrigger value="linkedin">LinkedIn</TabsTrigger>
                </TabsList>

                <TabsContent value="all" className="mt-4 space-y-6">
                  <div>
                    <h3 className="mb-2 text-sm font-medium text-muted-foreground">
                      Twitter / X
                    </h3>
                    <TwitterCard data={data} />
                  </div>
                  <Separator />
                  <div>
                    <h3 className="mb-2 text-sm font-medium text-muted-foreground">
                      Facebook
                    </h3>
                    <FacebookCard data={data} />
                  </div>
                  <Separator />
                  <div>
                    <h3 className="mb-2 text-sm font-medium text-muted-foreground">
                      LinkedIn
                    </h3>
                    <LinkedInCard data={data} />
                  </div>
                </TabsContent>

                <TabsContent value="twitter" className="mt-4">
                  <TwitterCard data={data} />
                </TabsContent>

                <TabsContent value="facebook" className="mt-4">
                  <FacebookCard data={data} />
                </TabsContent>

                <TabsContent value="linkedin" className="mt-4">
                  <LinkedInCard data={data} />
                </TabsContent>
              </Tabs>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>OG Audit Score</CardTitle>
            </CardHeader>
            <CardContent>
              <AuditScore data={data} />
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Raw Meta Tags</CardTitle>
            </CardHeader>
            <CardContent>
              <MetaTable data={data} />
            </CardContent>
          </Card>
        </div>
      )}
    </div>
  );
}
