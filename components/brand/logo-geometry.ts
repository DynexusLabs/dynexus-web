/**
 * Hex-nexus mark on a 32×32 grid: a hexagon framing three nodes (Forge, Swap, Core)
 * joined at a central hub. Shared by <Logo>, app/icon.svg and the generated images.
 */
export const HEX = "16,2 28.12,9 28.12,23 16,30 3.88,23 3.88,9";
export const HUB = { x: 16, y: 16 };
export const NODES = [
  { x: 16, y: 8.5 },
  { x: 22.5, y: 19.75 },
  { x: 9.5, y: 19.75 },
] as const;

/** Standalone SVG markup for contexts that need a string (ImageResponse <img> data URI). */
export function logoSvg({ tile = false }: { tile?: boolean } = {}): string {
  const bg = tile ? `<rect width="32" height="32" rx="7" fill="#0a0b14"/>` : "";
  const mark = tile ? ` transform="translate(3.2 3.2) scale(0.8)"` : "";
  const lines = NODES.map(
    (n) =>
      `<line x1="${HUB.x}" y1="${HUB.y}" x2="${n.x}" y2="${n.y}" stroke="url(#g)" stroke-width="1.6" stroke-linecap="round"/>`,
  ).join("");
  const nodes = NODES.map((n) => `<circle cx="${n.x}" cy="${n.y}" r="2.3" fill="url(#g)"/>`).join(
    "",
  );
  return `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 32 32"><title>Dynexus</title><defs><linearGradient id="g" x1="0" y1="0" x2="32" y2="32" gradientUnits="userSpaceOnUse"><stop stop-color="#7f5af0"/><stop offset="1" stop-color="#00d9ff"/></linearGradient></defs>${bg}<g${mark}><polygon points="${HEX}" fill="none" stroke="url(#g)" stroke-width="2" stroke-linejoin="round"/>${lines}${nodes}<circle cx="${HUB.x}" cy="${HUB.y}" r="2.8" fill="#fff"/></g></svg>`;
}

export const logoDataUri = (opts?: { tile?: boolean }) =>
  `data:image/svg+xml;base64,${Buffer.from(logoSvg(opts)).toString("base64")}`;
