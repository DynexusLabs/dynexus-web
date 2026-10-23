# Dynexus Web

**Dynexus Web** is the frontend interface that allows users to interact with the Dynexus ecosystem. This web application provides seamless access to key features like governance, token swaps, liquidity pools, and token creation, all built on top of the Aptos blockchain and utilizing the Move programming language.

## Features

- **User-Friendly Interface**: Intuitive UI/UX design for easy navigation across different Dynexus protocols.
- **Governance Integration**: Allows users to participate in DYNA token governance, voting, and proposal management.
- **Token Swaps**: Interact with the Dynexus Swap AMM to seamlessly trade tokens within the ecosystem.
- **Liquidity Pools**: Provide liquidity and manage positions within supported pools.
- **Token Creation**: Use the Dynexus Forge integration to create custom fungible tokens within the ecosystem.
- **Real-time Data**: Live token pricing, liquidity pool stats, and governance updates.

## Getting started

```bash
bun install
cp .env.example .env.local   # fill in values
bun run dev -p 3100
```

| Variable                      | Purpose                                                                    |
| ----------------------------- | -------------------------------------------------------------------------- |
| `NEXT_PUBLIC_APTOS_NETWORK`   | `mainnet`, `testnet`, `devnet` or `local`                                  |
| `NEXT_PUBLIC_SITE_URL`        | Public origin for canonical URLs, Open Graph, sitemap (Netlify URL)        |
| `NEXT_PUBLIC_DYNEXUS_ADDRESS` | Account that published Forge, Swap and Core                                |
| `NEXT_PUBLIC_INDEXER_URL`     | dynexus-indexer API; empty falls back to on-chain view calls. Added to CSP |
| `NEXT_PUBLIC_APTOS_API_KEY`   | Optional Aptos Build key for higher rate limits                            |

All `NEXT_PUBLIC_*` values ship to the browser; never put secrets in them.

## Standards

### Web

- Metadata API: title template, canonical URLs, Open Graph and Twitter cards on every route
  (`lib/site.ts` → `pageMetadata`), `viewport` theme color, JSON-LD (`Organization`, `WebApplication`)
- Generated assets: `icon.svg`, `apple-icon`, `opengraph-image`, `twitter-image`, PWA
  `manifest.webmanifest` with 192/512/maskable icons, `robots.txt`, `sitemap.xml`
- Security headers (`next.config.mjs`): CSP, HSTS, `X-Frame-Options`, `nosniff`, `Referrer-Policy`,
  `Permissions-Policy`, COOP; `/.well-known/security.txt`
- Accessibility: skip link, focus rings, `aria-current` navigation, keyboard-dismissable menus,
  `prefers-reduced-motion`; `not-found`, `error` and `loading` states

### Web3 (Aptos)

- AIP-62 wallet standard via `@aptos-labs/wallet-adapter-react` (Petra, Nightly, OKX)
- App-wide wrong-network banner and network badge
- Account menu: copy address, open in explorer, disconnect
- Explorer links for transactions, accounts and the published contracts
- Exact bigint decimal handling for fungible assets, slippage and deadline on swaps
- Testnet and unaudited-contract disclaimer
