import type { ReactNode } from "react";
import Footer from "./Footer";
import Header from "./Header";
import NetworkBanner from "./NetworkBanner";

export default function Layout({ children }: { children: ReactNode }) {
  return (
    <div className="flex min-h-dvh flex-col">
      <a
        href="#main"
        className="sr-only z-50 rounded-lg bg-accent-strong px-4 py-2 text-white focus:not-sr-only focus:fixed focus:left-4 focus:top-4"
      >
        Skip to content
      </a>
      <Header />
      <NetworkBanner />
      <main id="main" className="flex-1">
        {children}
      </main>
      <Footer />
    </div>
  );
}
