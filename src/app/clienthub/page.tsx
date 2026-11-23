import type { Metadata } from "next";
import ClientHub from "./ClientHub";

// The Virtually Anything badge (same artwork as virtuallyanything.xyz/icon.svg).
const VA_ICON =
  '<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 512 512"><rect width="512" height="512" fill="#264653"/>' +
  '<circle cx="392" cy="128" r="22" fill="#f2e8cf" opacity="0.9"/><ellipse cx="256" cy="420" rx="190" ry="44" fill="#2a9d8f"/>' +
  '<rect x="186" y="176" width="140" height="236" rx="70" fill="#e76f51"/><circle cx="230" cy="250" r="12" fill="#264653"/>' +
  '<circle cx="282" cy="250" r="12" fill="#264653"/><path d="M232 292 q24 20 48 0" stroke="#264653" stroke-width="9" fill="none" stroke-linecap="round"/></svg>';

// Password protection is done on the server by functions/_middleware.ts (Cloudflare Pages).
export const metadata: Metadata = {
  title: "Client Hub · Virtually Anything",
  robots: { index: false, follow: false },
  icons: { icon: { url: "data:image/svg+xml," + encodeURIComponent(VA_ICON), type: "image/svg+xml" } },
};

export const viewport = { themeColor: "#000000" };

export default function ClientHubPage() {
  return <ClientHub />;
}
