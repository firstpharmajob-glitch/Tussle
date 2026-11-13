import type { NextConfig } from "next";
import { resolve } from "node:path";

const nextConfig: NextConfig = {
  turbopack: {
    root: resolve(process.cwd()),
  },
  async redirects() {
    return [
      {
        source: "/concepts/hold-chair.html",
        destination: "/concepts/simhasana.html",
        permanent: true,
      },
      {
        source: "/concepts/room-9sqm.html",
        destination: "/concepts/tussle-house.html",
        permanent: true,
      },
    ];
  },
};

export default nextConfig;
