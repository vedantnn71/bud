// @ts-check
import { env } from "./src/env/server.mjs";

export default {
  reactStrictMode: true,
  swcMinify: true,
  experimental: {
    appDir: true,
    transpilePackages: [
      "@beacon/db",
      "@beacon/ui",
      "@beacon/auth",
      "@beacon/basics",
    ],
    serverComponentsExternalPackages: [
      "prisma",
      "@prisma/client",
      "postcss",
      "tailwindcss",
      "autoprefixer",
    ],
  },
};
