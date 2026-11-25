import type { NextConfig } from "next";

/**
 * Uygulama tamamen statik olarak dışa aktarılır (`next build` → `out/` klasörü).
 * Sunucu gerekmez: tüm veriler tarayıcıdaki IndexedDB'de tutulur.
 */
const nextConfig: NextConfig = {
  output: "export",
  trailingSlash: true,
  images: { unoptimized: true },
};

export default nextConfig;
