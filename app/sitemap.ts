import type { MetadataRoute } from "next";
import { routes, site } from "@/lib/site";

export default function sitemap(): MetadataRoute.Sitemap {
  return [{ href: "/" }, ...routes].map(({ href }) => ({
    url: `${site.url}${href === "/" ? "" : href}`,
    changeFrequency: "daily",
    priority: href === "/" ? 1 : 0.8,
  }));
}
