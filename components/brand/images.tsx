import { ImageResponse } from "next/og";
import { site } from "@/lib/site";
import { logoDataUri } from "./logo-geometry";

/** Square app icon (tile + mark) for apple-touch and PWA manifest sizes. */
export function iconImage(px: number, { maskable = false } = {}) {
  // Maskable icons keep the mark inside the 80% safe zone and fill the canvas edge to edge.
  const mark = Math.round(px * (maskable ? 0.56 : 0.72));
  return new ImageResponse(
    <div
      style={{
        width: "100%",
        height: "100%",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        background: site.colors.bg,
      }}
    >
      {/* biome-ignore lint/performance/noImgElement: ImageResponse renders plain <img> */}
      <img src={logoDataUri()} width={mark} height={mark} alt="" />
    </div>,
    { width: px, height: px },
  );
}

/** 1200×630 social card shared by Open Graph and Twitter. */
export function socialImage() {
  return new ImageResponse(
    <div
      style={{
        width: "100%",
        height: "100%",
        display: "flex",
        flexDirection: "column",
        justifyContent: "space-between",
        padding: 72,
        color: "#eceef6",
        background: site.colors.bg,
        backgroundImage:
          "radial-gradient(900px 500px at 0% 0%, rgba(127,90,240,0.35), transparent 60%), radial-gradient(800px 450px at 100% 100%, rgba(0,217,255,0.22), transparent 60%)",
      }}
    >
      <div style={{ display: "flex", alignItems: "center", gap: 20 }}>
        {/* biome-ignore lint/performance/noImgElement: ImageResponse renders plain <img> */}
        <img src={logoDataUri()} width={72} height={72} alt="" />
        <div style={{ fontSize: 40, fontWeight: 600, letterSpacing: 8 }}>DYNEXUS</div>
      </div>
      <div style={{ display: "flex", flexDirection: "column", gap: 20 }}>
        <div style={{ fontSize: 76, fontWeight: 700, lineHeight: 1.05, letterSpacing: -2 }}>
          {site.tagline}
        </div>
        <div style={{ fontSize: 30, color: "#a0a3b8", maxWidth: 900 }}>
          Token factory · AMM with multi-hop routing · ve-governance
        </div>
      </div>
      <div style={{ display: "flex", gap: 14, fontSize: 24, color: "#a0a3b8" }}>
        {["Built with Move", "Open source", new URL(site.url).host].map((t) => (
          <div
            key={t}
            style={{
              display: "flex",
              border: "1px solid #34374d",
              borderRadius: 999,
              padding: "8px 20px",
            }}
          >
            {t}
          </div>
        ))}
      </div>
    </div>,
    { width: 1200, height: 630 },
  );
}
