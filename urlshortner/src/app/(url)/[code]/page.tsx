"use client";

import { ApiResponse } from "@/types/ApiResponse";
import axios, { AxiosError } from "axios";
import React from "react";

export default function Page({ params }: { params: Promise<{ code: string }> }) {
    const { code } = React.use(params);
    const [error, setError] = React.useState("")

    React.useEffect(() => {
        const fetchAndRedirect = async () => {
            try {
                if (code !== "code") {
                    const { data }: { data: ApiResponse } = await axios.get(`/api/links/${code}`);
                    // console.log(data.urldetails?.redirectUrl);
                    try {
                        await axios.get(`/api/clickCount/${code}`)
                    } catch (error) {
                        console.log("count failed", error);
                    } finally {
                        if (data.urldetails?.redirectUrl) {
                            window.location.href = data.urldetails?.redirectUrl;
                        }
                    }
                } else setError("Error Code 404 , code itself isn't a route")
            } catch (error) {
                if (axios.isAxiosError(error)) {
                    console.log(error.status)
                    console.error(error.response);
                    setError(`Error Code ${error.status} , ${error.response?.data.message}`)
                } else {
                    setError('oops! something went wrong')
                    console.error(error);
                }
            }
        };
        fetchAndRedirect();
    }, [code]);

    return !!error && (<h1 className="text-red-600">{error}</h1>)
}