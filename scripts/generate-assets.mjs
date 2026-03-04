/**
 * Generate OG image + favicons for the SEO Toolkit project.
 * Run: node scripts/generate-assets.mjs
 * Requires: npm install canvas (or use system canvas)
 */

import { createCanvas } from "@napi-rs/canvas";
import { writeFileSync, mkdirSync } from "fs";
import { join } from "path";

const PUBLIC = join(import.meta.dirname, "..", "public");
mkdirSync(PUBLIC, { recursive: true });

// Brand colors (oklch converted to approx hex for canvas)
const BG = "#1a1a1a"; // color-1
const BG2 = "#2a2a2a"; // color-2
const BORDER = "#3d3d3d"; // color-3
const TEXT_MUTED = "#999"; // color-10
const TEXT = "#e8e8e8"; // color-12
const ACCENT = "#818181"; // color-8

// ─── OG Image (1200x630) ────────────────────────────────────────────────────
function generateOGImage() {
  const w = 1200, h = 630;
  const canvas = createCanvas(w, h);
  const ctx = canvas.getContext("2d");

  // Background
  ctx.fillStyle = BG;
  ctx.fillRect(0, 0, w, h);

  // Grid lines (subtle)
  ctx.strokeStyle = BORDER;
  ctx.lineWidth = 1;

  // Vertical lines at content edges
  const leftEdge = 80, rightEdge = w - 80;
  ctx.beginPath();
  ctx.moveTo(leftEdge, 0); ctx.lineTo(leftEdge, h);
  ctx.moveTo(rightEdge, 0); ctx.lineTo(rightEdge, h);
  ctx.stroke();

  // Horizontal lines
  const topLine = 80, midLine = 200, botLine = h - 80;
  ctx.beginPath();
  ctx.moveTo(0, topLine); ctx.lineTo(w, topLine);
  ctx.moveTo(0, midLine); ctx.lineTo(w, midLine);
  ctx.moveTo(0, botLine); ctx.lineTo(w, botLine);
  ctx.stroke();

  // Logo mark
  ctx.fillStyle = ACCENT;
  const logoSize = 36;
  const logoX = leftEdge + 20, logoY = topLine + (midLine - topLine) / 2 - logoSize / 2;
  ctx.beginPath();
  ctx.roundRect(logoX, logoY, logoSize, logoSize, 6);
  ctx.fill();
  ctx.fillStyle = TEXT;
  ctx.font = "bold 18px sans-serif";
  ctx.textAlign = "center";
  ctx.textBaseline = "middle";
  ctx.fillText("S", logoX + logoSize / 2, logoY + logoSize / 2);

  // Header text
  ctx.fillStyle = TEXT;
  ctx.font = "600 20px sans-serif";
  ctx.textAlign = "left";
  ctx.textBaseline = "middle";
  ctx.fillText("SEO Toolkit", logoX + logoSize + 14, logoY + logoSize / 2);

  // Main title
  ctx.fillStyle = TEXT;
  ctx.font = "bold 56px sans-serif";
  ctx.textAlign = "left";
  ctx.textBaseline = "top";
  ctx.fillText("OG Preview &", leftEdge + 20, midLine + 40);
  ctx.fillText("Favicon Generator", leftEdge + 20, midLine + 110);

  // Subtitle
  ctx.fillStyle = TEXT_MUTED;
  ctx.font = "400 22px sans-serif";
  ctx.fillText("Preview social cards. Generate favicons. Free & instant.", leftEdge + 20, midLine + 190);

  // URL
  ctx.fillStyle = ACCENT;
  ctx.font = "500 16px sans-serif";
  ctx.fillText("seo-toolkit.vercel.app", leftEdge + 20, botLine + 20);

  // Author
  ctx.fillStyle = TEXT_MUTED;
  ctx.textAlign = "right";
  ctx.fillText("by Nathan Schroeder", rightEdge - 20, botLine + 20);

  const buffer = canvas.toBuffer("image/png");
  writeFileSync(join(PUBLIC, "og-image.png"), buffer);
  console.log("✓ og-image.png (1200×630)");
}

// ─── Favicons ────────────────────────────────────────────────────────────────
function generateFavicon(size) {
  const canvas = createCanvas(size, size);
  const ctx = canvas.getContext("2d");

  // Dark background
  ctx.fillStyle = BG;
  ctx.beginPath();
  ctx.roundRect(0, 0, size, size, size * 0.15);
  ctx.fill();

  // Border
  ctx.strokeStyle = BORDER;
  ctx.lineWidth = Math.max(1, size * 0.04);
  ctx.beginPath();
  ctx.roundRect(ctx.lineWidth / 2, ctx.lineWidth / 2, size - ctx.lineWidth, size - ctx.lineWidth, size * 0.15);
  ctx.stroke();

  // "S" letter
  ctx.fillStyle = TEXT;
  ctx.font = `bold ${size * 0.55}px sans-serif`;
  ctx.textAlign = "center";
  ctx.textBaseline = "middle";
  ctx.fillText("S", size / 2, size / 2 + size * 0.03);

  return canvas.toBuffer("image/png");
}

function generateICO() {
  // ICO with 16, 32, 48 sizes
  const sizes = [16, 32, 48];
  const pngs = sizes.map((s) => generateFavicon(s));

  const headerSize = 6;
  const dirSize = 16 * sizes.length;
  let offset = headerSize + dirSize;
  const totalSize = offset + pngs.reduce((s, p) => s + p.length, 0);
  const buffer = Buffer.alloc(totalSize);

  buffer.writeUInt16LE(0, 0); // reserved
  buffer.writeUInt16LE(1, 2); // type = ICO
  buffer.writeUInt16LE(sizes.length, 4);

  for (let i = 0; i < sizes.length; i++) {
    const dirOff = headerSize + i * 16;
    buffer.writeUInt8(sizes[i] >= 256 ? 0 : sizes[i], dirOff);
    buffer.writeUInt8(sizes[i] >= 256 ? 0 : sizes[i], dirOff + 1);
    buffer.writeUInt8(0, dirOff + 2);
    buffer.writeUInt8(0, dirOff + 3);
    buffer.writeUInt16LE(1, dirOff + 4);
    buffer.writeUInt16LE(32, dirOff + 6);
    buffer.writeUInt32LE(pngs[i].length, dirOff + 8);
    buffer.writeUInt32LE(offset, dirOff + 12);
    pngs[i].copy(buffer, offset);
    offset += pngs[i].length;
  }

  writeFileSync(join(PUBLIC, "favicon.ico"), buffer);
  console.log("✓ favicon.ico");
}

function generateManifest() {
  const manifest = {
    name: "SEO Toolkit",
    short_name: "SEO Toolkit",
    icons: [16, 32, 48, 64, 128, 192, 512].map((s) => ({
      src: `/favicon-${s}x${s}.png`,
      sizes: `${s}x${s}`,
      type: "image/png",
    })),
    theme_color: "#1a1a1a",
    background_color: "#1a1a1a",
    display: "standalone",
  };
  writeFileSync(join(PUBLIC, "site.webmanifest"), JSON.stringify(manifest, null, 2));
  console.log("✓ site.webmanifest");
}

// Run
generateOGImage();
for (const size of [16, 32, 48, 64, 128, 192, 512]) {
  const buf = generateFavicon(size);
  writeFileSync(join(PUBLIC, `favicon-${size}x${size}.png`), buf);
  console.log(`✓ favicon-${size}x${size}.png`);
}
generateICO();
generateManifest();
console.log("\nAll assets generated in public/");
