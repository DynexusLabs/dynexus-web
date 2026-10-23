import { ArrowTopRightOnSquareIcon } from "@heroicons/react/24/outline";
import Link from "next/link";
import { Logo } from "@/components/brand/Logo";
import { DYNEXUS_ADDRESS, EXPLORER_ACCOUNT, NETWORK_LABEL } from "@/lib/config";
import { shortAddr } from "@/lib/format";
import { routes, site } from "@/lib/site";

const developerLinks = [
  { name: "GitHub", href: site.github },
  { name: "Forge contracts", href: site.repos.forge },
  { name: "Swap contracts", href: site.repos.swap },
  { name: "Core contracts", href: site.repos.core },
  { name: "Indexer", href: site.repos.indexer },
];

function External({ href, children }: { href: string; children: React.ReactNode }) {
  return (
    <a
      href={href}
      target="_blank"
      rel="noopener noreferrer"
      className="inline-flex items-center gap-1 text-sm text-muted transition-colors hover:text-fg"
    >
      {children}
      <ArrowTopRightOnSquareIcon className="h-3.5 w-3.5" aria-hidden="true" />
    </a>
  );
}

export default function Footer() {
  return (
    <footer className="mt-16 border-t border-line bg-surface/40">
      <div className="mx-auto grid max-w-6xl gap-10 px-4 py-12 sm:px-6 md:grid-cols-4">
        <div className="md:col-span-2">
          <Logo />
          <p className="mt-4 max-w-sm text-sm text-muted">{site.description}</p>
          {DYNEXUS_ADDRESS && (
            <p className="mt-4 text-xs text-subtle">
              Contracts on Aptos {NETWORK_LABEL}:{" "}
              <a
                href={EXPLORER_ACCOUNT(DYNEXUS_ADDRESS)}
                target="_blank"
                rel="noopener noreferrer"
                className="font-mono text-muted underline-offset-2 hover:text-fg hover:underline"
              >
                {shortAddr(DYNEXUS_ADDRESS)}
              </a>
            </p>
          )}
        </div>

        <nav aria-label="App">
          <h2 className="text-sm font-semibold text-fg">App</h2>
          <ul className="mt-4 space-y-2.5">
            {routes.map((r) => (
              <li key={r.href}>
                <Link href={r.href} className="text-sm text-muted transition-colors hover:text-fg">
                  {r.name}
                </Link>
              </li>
            ))}
          </ul>
        </nav>

        <nav aria-label="Developers">
          <h2 className="text-sm font-semibold text-fg">Developers</h2>
          <ul className="mt-4 space-y-2.5">
            {developerLinks.map((l) => (
              <li key={l.href}>
                <External href={l.href}>{l.name}</External>
              </li>
            ))}
          </ul>
        </nav>
      </div>

      <div className="border-t border-line">
        <div className="mx-auto flex max-w-6xl flex-col gap-2 px-4 py-5 text-xs text-subtle sm:flex-row sm:items-center sm:justify-between sm:px-6">
          <p>
            © {new Date().getFullYear()} {site.legalName}. Open source on GitHub.
          </p>
          <p>
            {NETWORK_LABEL} only · contracts are unaudited · not financial advice. Use at your own
            risk.
          </p>
        </div>
      </div>
    </footer>
  );
}
