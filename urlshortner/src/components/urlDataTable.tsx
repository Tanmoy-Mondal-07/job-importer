"use client"

import * as React from "react"
import {
    SortingState,
    useReactTable,
    getCoreRowModel,
    getSortedRowModel,
    getFilteredRowModel,
    getPaginationRowModel,
} from "@tanstack/react-table"

import { Input } from "@/components/ui/input"
import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from "@/components/ui/table"

import { columns } from "./columns"
import { URI } from "@/types/URLResponse"
import axios, { AxiosError } from "axios"

export default function DataTableUrl() {
    const [sorting, setSorting] = React.useState<SortingState>([])
    const [filter, setFilter] = React.useState<string>("")
    const [urlList, setUrlList] = React.useState<URI[]>([])
    const [error, setError] = React.useState<string>("")

    React.useEffect(() => {
        const fetchData = async () => {
            try {
                const response = await axios.get('/api/links');
                setUrlList(response.data.urllist);
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

        fetchData();
    }, []);


    const table = useReactTable({
        data: urlList,
        columns,
        state: {
            sorting,
            globalFilter: filter,
        },
        onSortingChange: setSorting,
        onGlobalFilterChange: setFilter,
        getCoreRowModel: getCoreRowModel(),
        getSortedRowModel: getSortedRowModel(),
        getFilteredRowModel: getFilteredRowModel(),
        getPaginationRowModel: getPaginationRowModel(),
    })

    return (
        < div className="w-full" >
            <div className="flex items-center py-4 gap-2">
                <Input
                    placeholder="Search URLs..."
                    value={filter}
                    onChange={(e) => setFilter(e.target.value)}
                    className="max-w-sm"
                />
            </div>

            <div className="overflow-hidden rounded-md border">
                <Table>
                    <TableHeader>
                        {table.getHeaderGroups().map((headerGroup) => (
                            <TableRow key={headerGroup.id}>
                                {headerGroup.headers.map((header) => (
                                    <TableHead key={header.id}>
                                        {header.isPlaceholder ? null : header.column.columnDef.header instanceof Function
                                            ? header.column.columnDef.header(header.getContext())
                                            : header.column.columnDef.header}
                                    </TableHead>
                                ))}
                            </TableRow>
                        ))}
                    </TableHeader>

                    <TableBody>
                        {table.getRowModel().rows.length ? (
                            table.getRowModel().rows.map((row) => (
                                <TableRow key={row.id}>
                                    {row.getVisibleCells().map((cell) => (
                                        <TableCell key={cell.id}>
                                            {typeof cell.column.columnDef.cell === "function"
                                                ? cell.column.columnDef.cell(cell.getContext())
                                                : cell.column.columnDef.cell}

                                        </TableCell>
                                    ))}
                                </TableRow>
                            ))
                        ) : (
                            <TableRow>
                                <TableCell colSpan={columns.length} className="text-center py-10">
                                    {error ? error : "No results"}
                                </TableCell>
                            </TableRow>
                        )}
                    </TableBody>
                </Table>
            </div>
        </div>
    )
}