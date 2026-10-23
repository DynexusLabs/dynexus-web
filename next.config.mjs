/** @type {import('next').NextConfig} */
const nextConfig = {
  // Linting is done by Biome (`bun run lint`), not ESLint.
  eslint: { ignoreDuringBuilds: true },
};

export default nextConfig;
