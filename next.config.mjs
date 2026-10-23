const isDev = process.env.NODE_ENV !== "production";

/** Origin of the optional indexer API; it must be allowed in connect-src. */
const indexerOrigin = (() => {
  try {
    return process.env.NEXT_PUBLIC_INDEXER_URL
      ? new URL(process.env.NEXT_PUBLIC_INDEXER_URL).origin
      : "";
  } catch {
    return "";
  }
})();

// Static CSP without nonces keeps every page statically rendered (see Next.js CSP guide,
// "Without Nonces"). Fullnode, indexer GraphQL and faucet all live on *.aptoslabs.com.
const csp = [
  "default-src 'self'",
  `script-src 'self' 'unsafe-inline'${isDev ? " 'unsafe-eval'" : ""}`,
  "style-src 'self' 'unsafe-inline'",
  // Token logos are arbitrary creator-supplied URLs.
  "img-src 'self' data: blob: https:",
  "font-src 'self' data:",
  `connect-src 'self' https://*.aptoslabs.com ${indexerOrigin}${isDev ? " ws://localhost:* http://localhost:*" : ""}`,
  "frame-src 'self' https://*.aptosconnect.app",
  "object-src 'none'",
  "base-uri 'self'",
  "form-action 'self'",
  "frame-ancestors 'none'",
  ...(isDev ? [] : ["upgrade-insecure-requests"]),
]
  .join("; ")
  .replace(/\s{2,}/g, " ");

const securityHeaders = [
  { key: "Content-Security-Policy", value: csp },
  { key: "Strict-Transport-Security", value: "max-age=63072000" },
  { key: "X-Content-Type-Options", value: "nosniff" },
  { key: "X-Frame-Options", value: "DENY" },
  { key: "Referrer-Policy", value: "strict-origin-when-cross-origin" },
  // Wallets such as Aptos Connect open popups that must keep a handle to this window.
  { key: "Cross-Origin-Opener-Policy", value: "same-origin-allow-popups" },
  {
    key: "Permissions-Policy",
    value: "camera=(), microphone=(), geolocation=(), payment=(), usb=()",
  },
];

/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  poweredByHeader: false,
  async headers() {
    return [
      { source: "/:path*", headers: securityHeaders },
      {
        source: "/.well-known/security.txt",
        headers: [{ key: "Content-Type", value: "text/plain; charset=utf-8" }],
      },
    ];
  },
};

export default nextConfig;
