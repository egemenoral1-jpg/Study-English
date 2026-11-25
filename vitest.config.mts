import { defineConfig } from "vitest/config";
import { fileURLToPath } from "node:url";

// Birim testleri: aralıklı tekrar algoritması, kural motoru, cevap kontrolü.
export default defineConfig({
  resolve: { alias: { "@": fileURLToPath(new URL("./src", import.meta.url)) } },
  test: { include: ["src/**/*.test.ts"], environment: "node" },
});
