/** Brand and site-wide constants shared by metadata, header, footer and generated images. */

const GITHUB_ORG = "https://github.com/DynexusLabs";

export const site = {
  name: "Dynexus",
  legalName: "Dynexus Labs",
  tagline: "Forge, trade and govern on Aptos",
  description:
    "Dynexus is an Aptos DeFi suite: launch fungible assets with Forge, trade on a constant-product AMM with multi-hop routing, and steer emissions with vote-escrowed DYNA governance.",
  url: (process.env.NEXT_PUBLIC_SITE_URL || "https://dynexus.netlify.app").replace(/\/$/, ""),
  keywords: [
    "Aptos",
    "Move",
    "DeFi",
    "AMM",
    "DEX",
    "token factory",
    "fungible asset",
    "ve-tokenomics",
    "governance",
    "liquidity pools",
  ],
  github: GITHUB_ORG,
  repos: {
    forge: `${GITHUB_ORG}/dynexus-forge`,
    swap: `${GITHUB_ORG}/dynexus-swap`,
    core: `${GITHUB_ORG}/dynexus-core`,
    web: `${GITHUB_ORG}/dynexus-web`,
    indexer: `${GITHUB_ORG}/dynexus-indexer`,
  },
  colors: {
    bg: "#0a0b14",
    violet: "#7f5af0",
    cyan: "#00d9ff",
  },
} as const;

export const routes = [
  { name: "Swap", href: "/swap", desc: "Trade any pair, routed through DYNA when needed" },
  { name: "Pools", href: "/pools", desc: "Provide liquidity and earn swap fees" },
  { name: "Tokens", href: "/tokens", desc: "Browse every asset forged on Dynexus" },
  { name: "Create", href: "/create-token", desc: "Launch a fungible asset in one transaction" },
  { name: "Governance", href: "/governance", desc: "Lock DYNA, vote on gauges, earn bribes" },
] as const;

const socialImage = { url: "/opengraph-image", width: 1200, height: 630, alt: site.name };

/**
 * Full per-route metadata. Next.js merges `openGraph`/`twitter` shallowly, so a route that
 * sets them must restate site name, card type and image or it loses the root values.
 */
export function pageMetadata({
  title,
  description,
  path,
}: {
  title: string;
  description: string;
  path: string;
}) {
  const full = `${title} · ${site.name}`;
  return {
    title,
    description,
    alternates: { canonical: path },
    openGraph: {
      type: "website" as const,
      siteName: site.name,
      locale: "en_US",
      url: path,
      title: full,
      description,
      images: [socialImage],
    },
    twitter: {
      card: "summary_large_image" as const,
      title: full,
      description,
      images: [socialImage],
    },
  };
}
