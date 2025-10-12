"use client"

import {
  Table, TableBody, 
  TableCaption, TableCell,
  TableHead, TableHeader, 
  TableRow,
} from "@/components/ui/table"
import { Button } from "@/components/ui/button"
import { useEffect, useState } from "react"
import { Loader2 } from "lucide-react"
import axios from "axios"

export default function DataList() {
  const [data, setData] = useState([])
  const [error, seterror] = useState<string>("")
  const [isLoading, setIsLoading] = useState<boolean>(false)

  function convertIntoLocalTime(ISO_Time: string) {
    const date = new Date(ISO_Time);
    return date.toLocaleString();
  }

  async function getData() {
    setIsLoading(true)
    try {
      const response: any = await axios.post('/api/data-logs')
      console.log(response.data);
      if (response.data.success || response.data.data.length > 0) {
        setData(response.data.data)
      } else {
        seterror(response.data.data.message || "Error !!")
      }
    } catch (error) {
      console.error("ImportLog Response Error :: ", error);
      seterror("ImportLog Response Error :: ")
    } finally {
      setIsLoading(false)
    }
  }

  useEffect(() => {
    getData()
  }, [])

  return (
    <div className="rounded-2xl border border-gray-200 shadow-sm overflow-hidden bg-white">

      {isLoading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
      {!!error && <h1 className="text-red-600">{error}</h1>}

      <Table>
        <TableCaption className="text-gray-600 text-sm py-4">
          Click On The Row for Error Details
        </TableCaption>

        <TableHeader>
          <TableRow className="bg-gray-50 hover:bg-gray-50">
            <TableHead className="w-[120px] text-gray-700 font-semibold">File Name</TableHead>
            <TableHead className="text-center w-[120px] text-gray-700 font-semibold">Import Date & Time</TableHead>
            <TableHead className="text-center text-gray-700 font-semibold">Total</TableHead>
            <TableHead className="text-center text-gray-700 font-semibold">New</TableHead>
            <TableHead className="text-center text-gray-700 font-semibold">Updated</TableHead>
            <TableHead className="text-center text-gray-700 font-semibold">Failed</TableHead>
          </TableRow>
        </TableHeader>

        <TableBody>
          {data.map((log: any) => (
            <TableRow
              key={log._id}
              className="hover:bg-gray-50 transition-colors"
            >
              <TableCell className="font-medium text-gray-900">
                #{log.fileName}
              </TableCell>
              <TableCell className="text-center text-gray-700">
                {convertIntoLocalTime(log.timestamp)}
              </TableCell>
              <TableCell className="text-center text-gray-700">
                {log.totalFetched}
              </TableCell>
              <TableCell className="text-center font-medium text-gray-900">
                {log.newJobs}
              </TableCell>
              <TableCell className="text-center font-medium text-gray-900">
                {log.updatedJobs}
              </TableCell>

              <TableCell className={(log.failedJobs.length != 0) ? "bg-red-900 text-center text-white" : "text-center text-gray-700"}>
                {log.failedJobs.length}
              </TableCell>

            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  )
}