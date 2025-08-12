import React, { useEffect, useState } from "react";

function mockFetch(): Promise<string> {
  return new Promise((resolve) => {
    setTimeout(() => {
      resolve("Server data loaded!");
    }, 2000); // simulate 2 second server delay
  });
}

export default function FetchMockComponent() {
  const [data, setData] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchData() {
      const result = await mockFetch();
      setData(result);
      setLoading(false);
    }

    fetchData();
  }, []);

  if (loading) return <div>Loading...</div>;

  return <div>{data}</div>;
}

export const TestLoading = () => {
  return <div>LOADING</div>;
};
