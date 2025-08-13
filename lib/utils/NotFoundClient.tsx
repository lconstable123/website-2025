"use client";

import { useSearchParams } from "next/navigation";

export default function NotFoundClient() {
  const searchParams = useSearchParams();
  const error = searchParams.get("error");

  return <div>{error ? `Error: ${error}` : "Page not found"}</div>;
}
