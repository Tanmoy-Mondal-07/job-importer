"use client"

import { ColumnDef } from "@tanstack/react-table"
import { Button } from "@/components/ui/button"
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuLabel, DropdownMenuSeparator, DropdownMenuTrigger } from "@/components/ui/dropdown-menu"
import { MoreHorizontal } from "lucide-react"
import { URI as UrlItem } from "@/types/URLResponse"
import axios from "axios"
import getDomain from "@/util/domainName"

export const columns: ColumnDef<UrlItem>[] = [
    {
        accessorKey: "redirectUrl",
        header: "Redirect URL",
        cell: ({ row }) => (
            <a
                href={row.original.redirectUrl}
                target="_blank"
                className="text-blue-600 underline"
            >
                {row.original.redirectUrl}
            </a>
        ),
    },
    {
        accessorKey: "shortUrl",
        header: "Short URL",
        cell: ({ row }) => {
            const domain = getDomain()
            return <span className="font-mono">{domain + row.original.shortUrl}</span>
        },
    },
    {
        accessorKey: "clickCount",
        header: "Clicks",
        cell: ({ row }) => <span>{row.original.clickCount}</span>,
    },

    // options 
    {
        id: "options",
        enableHiding: false,
        cell: ({ row }) => {
            const item = row.original

            return (
                <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                        <Button variant="ghost" className="h-8 w-8 p-0">
                            <MoreHorizontal />
                        </Button>
                    </DropdownMenuTrigger>

                    <DropdownMenuContent align="end">
                        <DropdownMenuLabel>Options </DropdownMenuLabel>

                        <DropdownMenuItem onClick={async () => {
                            try {
                                await axios.get(`/api/clickCount/${item.shortUrl}`)
                            } catch (error) {
                                console.log("count failed", error);
                            } finally {
                                window.open(item.redirectUrl, "_blank")
                            }
                        }}>
                            Go
                        </DropdownMenuItem>

                        <DropdownMenuItem
                            onClick={() => navigator.clipboard.writeText(getDomain() + item.shortUrl)}
                        >
                            Copy
                        </DropdownMenuItem>

                        <DropdownMenuSeparator />

                        <DropdownMenuItem
                            className="text-red-600"
                            onClick={async () => {
                                try {
                                    await axios.delete(`/api/links/${item.shortUrl}`)
                                    window.alert("Your short URL has been deleted successfuly");
                                } catch (error) {
                                    window.alert("error! failed to deleted the URL");
                                    console.log("count failed", error);
                                }
                            }}>
                            Delete
                        </DropdownMenuItem>
                    </DropdownMenuContent>
                </DropdownMenu>
            )
        },
    },
]