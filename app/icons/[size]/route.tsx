import { iconImage } from "@/components/brand/images";

/** PNG icons referenced by app/manifest.ts: /icons/192, /icons/512, /icons/maskable-512. */
const variants: Record<string, { px: number; maskable?: boolean }> = {
  "192": { px: 192 },
  "512": { px: 512 },
  "maskable-512": { px: 512, maskable: true },
};

export const dynamicParams = false;

export function generateStaticParams() {
  return Object.keys(variants).map((size) => ({ size }));
}

export async function GET(_req: Request, { params }: { params: Promise<{ size: string }> }) {
  const { size } = await params;
  const v = variants[size];
  if (!v) return new Response("Not found", { status: 404 });
  return iconImage(v.px, { maskable: v.maskable });
}
