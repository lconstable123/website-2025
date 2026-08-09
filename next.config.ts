/** @type {import('next').NextConfig} */
const nextConfig = {
  output: "export",
  // basePath: "/site2",
  // content: [
  //   "./app/**/*.{js,ts,jsx,tsx}",
  //   "./pages/**/*.{js,ts,jsx,tsx}",
  //   "./components/**/*.{js,ts,jsx,tsx}",
  // ],
  images: {
    unoptimized: true,
    remotePatterns: [
      {
        protocol: "https",
        hostname: "images.unsplash.com",
      },
      {
        protocol: "https",
        hostname: "www.lukeconstable.com",
      },
      {
        protocol: "https",
        hostname: "pub-545b5a9f7a3d4468946219f6d7837e3c.r2.dev",
      },
    ],
  },
  eslint: {
    ignoreDuringBuilds: true, // ⛔ disables build-time ESLint errors
  },
  // experimental: {
  //   serverActions: true,
  // },
  // theme: {
  //   extend: {
  //     fontFamily: {
  //       montserrat: ["var(--font-montserrat)", "sans-serif"],
  //       outfit: ["var(--font-outfit)", "sans-serif"],
  //     },
  //   },
  // },
};

module.exports = nextConfig;
