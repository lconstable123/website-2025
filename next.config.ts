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
