"use client";

import { ApiResponse } from "@/types/ApiResponse";
import axios, { AxiosError } from "axios";
import React from "react";

export default function Page({ params }: { params: Promise<{ code: string }> }) {
  const { code } = React.use(params);
  const [error, setError] = React.useState<string>("");
  const [loading, setLoading] = React.useState(true);
  const [data, setData] = React.useState<ApiResponse | null>(null);

  React.useEffect(() => {
    const fetchAndRedirect = async () => {
      try {
        if (code === "code" || !code) {
          setError("Error 404: `code` or `undefined` cannot be used as a route");
          setLoading(false);
          return;
        }

        const res = await axios.get<ApiResponse>(`/api/links/${code}`);
        setData(res.data);
        setLoading(false);
      } catch (err) {
        setLoading(false);

        if (axios.isAxiosError(err)) {
          const status = err.response?.status ?? "Unknown";
          const message = err.response?.data?.message ?? "Unexpected error";

          setError(`Error ${status}: ${message}`);
        } else {
          setError("Oops! Something went wrong.");
        }
      }
    };

    fetchAndRedirect();
  }, [code]);

  if (loading) return <h1 className="text-xl text-zinc-500">Loading...</h1>;

  if (error) return <h1 className="text-red-600 text-xl">{error}</h1>;

  if (!data) return null;

  return (
    <div className="p-10 space-y-3">
      <h1 className="text-2xl font-semibold">URL Details</h1>

      <div className="text-zinc-700">
        <p><b>Original URL:</b> {data.urldetails?.redirectUrl}</p>
        <p><b>Short URL:</b> {data.urldetails?.shortUrl}</p>
        <p><b>Clicks:</b> {data.urldetails?.clickCount}</p>
      </div>
    </div>
  );
}