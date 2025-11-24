"use client"

import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { ApiResponse } from "@/types/ApiResponse"
import axios from "axios"
import { useState } from "react"

export default function URLInputWithButton() {
    const [enteredURL, setEnteredURL] = useState("");
    const [newShortUrl, setNewShortUrl] = useState("");
    const [error, setError] = useState("");

    async function GenerateURLFunction() {
        setError("");
        setNewShortUrl("");

        try {
            const { data }: { data: ApiResponse } = await axios.post("/api/links", {
                redirectUrl: enteredURL,
            });

            if (data.success && data.urldetails) {
                setNewShortUrl(data.urldetails.shortUrl);
            } else {
                setError(data.message || "Unknown API error");
            }
        } catch (err) {
            if (axios.isAxiosError(err)) {
                const status = err.response?.status ?? "Unknown";
                const msg = err.response?.data?.message ?? "Unexpected error";

                setError(`Error ${status}: ${msg}`);
            } else {
                setError("Oops! Something went wrong.");
            }
        }
    }

    return (
        <div className="flex flex-col w-full items-center gap-5">
            <div className="flex w-full items-center gap-3 bg-white p-3 rounded-xl border shadow-sm">
                <Input
                    value={enteredURL}
                    onChange={(e) => setEnteredURL(e.target.value)}
                    type="text"
                    placeholder="Paste a long URL..."
                    className="h-11 rounded-xl border-zinc-300 focus-visible:ring-zinc-400"
                />

                <Button onClick={GenerateURLFunction} className="h-11 rounded-xl px-5">
                    Shorten
                </Button>
            </div>

            {newShortUrl && (
                <p className="text-green-600 font-medium">
                    Short URL:{" "}
                    <a
                        href={newShortUrl}
                        target="_blank"
                        className="underline text-blue-600"
                    >
                        {newShortUrl}
                    </a>
                </p>
            )}

            {error && <p className="text-red-600 font-medium">{error}</p>}
        </div>
    );
}
