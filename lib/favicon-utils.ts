import type { FaviconSize } from "./og-types";
import { zipSync, strToU8 } from "fflate";

export const FAVICON_SIZES = [16, 32, 48, 64, 128, 192, 512] as const;

function canvasToBlob(canvas: HTMLCanvasElement): Promise<Blob> {
  return new Promise((resolve, reject) => {
    canvas.toBlob((blob) => {
      if (blob) resolve(blob);
      else reject(new Error("Failed to create blob"));
    }, "image/png");
  });
}

export async function generateFromImage(
  imageUrl: string
): Promise<FaviconSize[]> {
  const img = new Image();
  img.crossOrigin = "anonymous";

  await new Promise<void>((resolve, reject) => {
    img.onload = () => resolve();
    img.onerror = () => reject(new Error("Failed to load image"));
    img.src = imageUrl;
  });

  const results = await Promise.all(
    FAVICON_SIZES.map(async (size) => {
      const canvas = document.createElement("canvas");
      canvas.width = size;
      canvas.height = size;
      const ctx = canvas.getContext("2d")!;
      ctx.drawImage(img, 0, 0, size, size);
      const blob = await canvasToBlob(canvas);
      return { size, blob, url: URL.createObjectURL(blob) };
    })
  );

  return results;
}

export async function generateFromText(
  text: string,
  bg: string,
  fg: string
): Promise<FaviconSize[]> {
  const results = await Promise.all(
    FAVICON_SIZES.map(async (size) => {
      const canvas = document.createElement("canvas");
      canvas.width = size;
      canvas.height = size;
      const ctx = canvas.getContext("2d")!;

      ctx.fillStyle = bg;
      ctx.fillRect(0, 0, size, size);

      ctx.fillStyle = fg;
      ctx.font = `${size * 0.65}px sans-serif`;
      ctx.textAlign = "center";
      ctx.textBaseline = "middle";
      ctx.fillText(text, size / 2, size / 2);

      const blob = await canvasToBlob(canvas);
      return { size, blob, url: URL.createObjectURL(blob) };
    })
  );

  return results;
}

export async function generateFromColor(color: string): Promise<FaviconSize[]> {
  const results = await Promise.all(
    FAVICON_SIZES.map(async (size) => {
      const canvas = document.createElement("canvas");
      canvas.width = size;
      canvas.height = size;
      const ctx = canvas.getContext("2d")!;

      ctx.fillStyle = color;
      ctx.fillRect(0, 0, size, size);

      const blob = await canvasToBlob(canvas);
      return { size, blob, url: URL.createObjectURL(blob) };
    })
  );

  return results;
}

export function generateHtmlSnippet(appName: string): string {
  return `<link rel="icon" type="image/png" sizes="16x16" href="/favicon-16x16.png">
<link rel="icon" type="image/png" sizes="32x32" href="/favicon-32x32.png">
<link rel="icon" type="image/png" sizes="48x48" href="/favicon-48x48.png">
<link rel="icon" type="image/png" sizes="64x64" href="/favicon-64x64.png">
<link rel="icon" type="image/png" sizes="128x128" href="/favicon-128x128.png">
<link rel="apple-touch-icon" sizes="192x192" href="/favicon-192x192.png">
<link rel="icon" type="image/png" sizes="512x512" href="/favicon-512x512.png">
<link rel="manifest" href="/site.webmanifest">
<meta name="application-name" content="${appName}">`;
}

export function generateManifest(appName: string): string {
  return JSON.stringify(
    {
      name: appName,
      short_name: appName,
      icons: FAVICON_SIZES.map((size) => ({
        src: `/favicon-${size}x${size}.png`,
        sizes: `${size}x${size}`,
        type: "image/png",
      })),
      theme_color: "#ffffff",
      background_color: "#ffffff",
      display: "standalone",
    },
    null,
    2
  );
}

async function blobToUint8Array(blob: Blob): Promise<Uint8Array> {
  const buffer = await blob.arrayBuffer();
  return new Uint8Array(buffer);
}

export async function packageAsZip(
  favicons: FaviconSize[],
  appName: string
): Promise<Blob> {
  const files: Record<string, Uint8Array> = {};

  const pngArrays = await Promise.all(
    favicons.map(async (f) => ({
      name: `favicon-${f.size}x${f.size}.png`,
      data: await blobToUint8Array(f.blob),
    }))
  );

  for (const { name, data } of pngArrays) {
    files[name] = data;
  }

  files["site.webmanifest"] = strToU8(generateManifest(appName));
  files["favicon-snippet.html"] = strToU8(generateHtmlSnippet(appName));

  const zipped = zipSync(files, { level: 6 });
  return new Blob([zipped.buffer as ArrayBuffer], { type: "application/zip" });
}

export function downloadBlob(blob: Blob, filename: string) {
  const url = URL.createObjectURL(blob);
  const a = document.createElement("a");
  a.href = url;
  a.download = filename;
  document.body.appendChild(a);
  a.click();
  document.body.removeChild(a);
  URL.revokeObjectURL(url);
}
