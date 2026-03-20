import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  /* config options here */
  devIndicators: {
    appIsrStatus: false, // Désactive l'indicateur de rendu statique
    buildActivity: false, // Désactive l'indicateur de build
  },
};

export default nextConfig;
