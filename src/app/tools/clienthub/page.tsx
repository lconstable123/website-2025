import type { Metadata } from "next";
import { preload } from "react-dom";
import ClientHub from "./ClientHub";

// Password protection is done on the server by functions/_middleware.ts (Cloudflare Pages).
export const metadata: Metadata = {
  title: "Client Hub · VirtuallyAnything",
  robots: { index: false, follow: false },
  icons: { icon: "/tools/hub-logo-v3.png", apple: "/tools/hub-logo-v3.png" },
  openGraph: {
    title: "Client Hub",
    description: "VirtuallyAnything",
    images: [{ url: "/tools/hub-og-v3.png", width: 1200, height: 630 }],
  },
  twitter: { card: "summary_large_image", images: ["/tools/hub-og-v3.png"] },
};

export default function ClientHubPage() {
  preload("/tools/hub-logo-v3.png", { as: "image" });
  return <ClientHub />;
}
