import type { Metadata } from "next";
import ClientHub from "./ClientHub";

// Password protection is done on the server by functions/_middleware.ts (Cloudflare Pages).
export const metadata: Metadata = {
  title: "Client Hub · VirtuallyAnything Timesheet",
  robots: { index: false, follow: false },
};

export default function ClientHubPage() {
  return <ClientHub />;
}
