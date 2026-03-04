export interface OGData {
  ogTitle?: string;
  ogDescription?: string;
  ogImage?: string;
  ogUrl?: string;
  ogSiteName?: string;
  ogType?: string;
  twitterCard?: string;
  twitterTitle?: string;
  twitterDescription?: string;
  twitterImage?: string;
  twitterSite?: string;
  twitterCreator?: string;
  title?: string;
  description?: string;
  canonical?: string;
  favicon?: string;
  resolvedUrl: string;
  fetchedAt: string;
}

export interface FaviconSize {
  size: number;
  blob: Blob;
  url: string;
}
