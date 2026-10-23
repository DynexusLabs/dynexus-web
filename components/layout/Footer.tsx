import Link from "next/link";
import { FaBookOpen, FaDiscord, FaGithub, FaTwitter } from "react-icons/fa";

const footerLinks = {
  product: [
    { name: "Pools", href: "/pools" },
    { name: "Governance", href: "/governance" },
    { name: "Analytics", href: "/analytics" },
    { name: "Docs", href: "/docs" },
  ],
  developers: [
    { name: "API Docs", href: "/docs/api" },
    { name: "SDK", href: "/docs/sdk" },
    { name: "GitHub", href: "https://github.com/dynexus" },
    { name: "Bug Bounty", href: "/bug-bounty" },
  ],
  community: [
    { name: "Discord", href: "https://discord.gg/dynexus" },
    { name: "Twitter", href: "https://twitter.com/dynexus" },
    { name: "Forum", href: "https://forum.dynexus.fi" },
    { name: "Blog", href: "/blog" },
  ],
  legal: [
    { name: "Terms", href: "/terms" },
    { name: "Privacy", href: "/privacy" },
    { name: "Security", href: "/security" },
    { name: "Brand Kit", href: "/brand" },
  ],
};

const socialLinks = [
  { name: "GitHub", icon: FaGithub, href: "https://github.com/dynexus" },
  { name: "Twitter", icon: FaTwitter, href: "https://twitter.com/dynexus" },
  { name: "Discord", icon: FaDiscord, href: "https://discord.gg/dynexus" },
  { name: "Docs", icon: FaBookOpen, href: "/docs" },
];

export function Footer() {
  return (
    <footer className="border-t border-border/40 bg-background/50 backdrop-blur-sm">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        {/* Main Footer Content */}
        <div className="py-16">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-6 gap-8 lg:gap-12">
            {/* Brand Section */}
            <div className="lg:col-span-2">
              <Link href="/" className="flex items-center space-x-2 mb-4">
                <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-gradient-to-r from-primary-500 to-cyan-400">
                  <span className="text-sm font-bold text-white">D</span>
                </div>
                <span className="text-xl font-bold gradient-text">Dynexus</span>
              </Link>
              <p className="text-muted-foreground text-sm max-w-xs mb-6">
                The next-generation DeFi platform built on Aptos, offering advanced liquidity
                solutions and yield optimization.
              </p>

              {/* Social Links */}
              <div className="flex space-x-4">
                {socialLinks.map((social) => (
                  <Link
                    key={social.name}
                    href={social.href}
                    className="p-2 rounded-lg glass-card border-primary/20 hover:border-primary/40 hover:bg-primary/5 transition-all duration-300 group"
                    aria-label={social.name}
                  >
                    <social.icon
                      size={18}
                      className="text-muted-foreground group-hover:text-primary transition-colors"
                    />
                  </Link>
                ))}
              </div>
            </div>

            {/* Product Links */}
            <div>
              <h3 className="font-semibold text-sm uppercase tracking-wider mb-4">Product</h3>
              <ul className="space-y-3">
                {footerLinks.product.map((link) => (
                  <li key={link.name}>
                    <Link
                      href={link.href}
                      className="text-sm text-muted-foreground hover:text-foreground transition-colors"
                    >
                      {link.name}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>

            {/* Developers Links */}
            <div>
              <h3 className="font-semibold text-sm uppercase tracking-wider mb-4">Developers</h3>
              <ul className="space-y-3">
                {footerLinks.developers.map((link) => (
                  <li key={link.name}>
                    <Link
                      href={link.href}
                      className="text-sm text-muted-foreground hover:text-foreground transition-colors"
                    >
                      {link.name}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>

            {/* Community Links */}
            <div>
              <h3 className="font-semibold text-sm uppercase tracking-wider mb-4">Community</h3>
              <ul className="space-y-3">
                {footerLinks.community.map((link) => (
                  <li key={link.name}>
                    <Link
                      href={link.href}
                      className="text-sm text-muted-foreground hover:text-foreground transition-colors"
                    >
                      {link.name}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>

            {/* Legal Links */}
            <div>
              <h3 className="font-semibold text-sm uppercase tracking-wider mb-4">Legal</h3>
              <ul className="space-y-3">
                {footerLinks.legal.map((link) => (
                  <li key={link.name}>
                    <Link
                      href={link.href}
                      className="text-sm text-muted-foreground hover:text-foreground transition-colors"
                    >
                      {link.name}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="py-6 border-t border-border/40">
          <div className="flex flex-col sm:flex-row justify-between items-center space-y-4 sm:space-y-0">
            <div className="text-sm text-muted-foreground">
              © 2025 SciFi Finance. All rights reserved.
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
}
