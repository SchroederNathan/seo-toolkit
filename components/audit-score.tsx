"use client";

import type { OGData } from "@/lib/og-types";
import { Badge } from "@/components/ui/badge";

const AUDIT_FIELDS: { key: keyof OGData; label: string }[] = [
  { key: "ogTitle", label: "og:title" },
  { key: "ogDescription", label: "og:description" },
  { key: "ogImage", label: "og:image" },
  { key: "ogUrl", label: "og:url" },
  { key: "ogSiteName", label: "og:site_name" },
  { key: "ogType", label: "og:type" },
  { key: "twitterCard", label: "twitter:card" },
  { key: "twitterTitle", label: "twitter:title" },
  { key: "twitterDescription", label: "twitter:description" },
  { key: "twitterImage", label: "twitter:image" },
  { key: "title", label: "<title>" },
  { key: "description", label: "meta description" },
  { key: "canonical", label: "canonical" },
  { key: "favicon", label: "favicon" },
];

export function AuditScore({ data }: { data: OGData }) {
  const present = AUDIT_FIELDS.filter((f) => !!data[f.key]);
  const score = Math.round((present.length / AUDIT_FIELDS.length) * 100);

  const radius = 40;
  const circumference = 2 * Math.PI * radius;
  const offset = circumference - (score / 100) * circumference;

  const color =
    score >= 80
      ? "text-green-500"
      : score >= 50
        ? "text-yellow-500"
        : "text-red-500";

  const strokeColor =
    score >= 80 ? "#22c55e" : score >= 50 ? "#eab308" : "#ef4444";

  return (
    <div className="flex flex-col items-center gap-4">
      <div className="relative flex h-28 w-28 items-center justify-center">
        <svg className="-rotate-90" width="112" height="112" viewBox="0 0 112 112">
          <circle
            cx="56"
            cy="56"
            r={radius}
            fill="none"
            stroke="currentColor"
            strokeWidth="8"
            className="text-muted"
          />
          <circle
            cx="56"
            cy="56"
            r={radius}
            fill="none"
            stroke={strokeColor}
            strokeWidth="8"
            strokeDasharray={circumference}
            strokeDashoffset={offset}
            strokeLinecap="round"
          />
        </svg>
        <span className={`absolute text-2xl font-bold ${color}`}>
          {score}%
        </span>
      </div>

      <div className="flex flex-wrap justify-center gap-1.5">
        {AUDIT_FIELDS.map((field) => (
          <Badge
            key={field.key}
            variant={data[field.key] ? "default" : "secondary"}
            className="text-xs"
          >
            {data[field.key] ? "✓" : "✗"} {field.label}
          </Badge>
        ))}
      </div>
    </div>
  );
}
