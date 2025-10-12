import {
    Table,
    TableBody,
    TableCaption,
    TableCell,
    TableFooter,
    TableHead,
    TableHeader,
    TableRow,
} from "@/components/ui/table"
import { Button } from "./ui/button"
import { Badge } from "./ui/badge"

const invoices = [
    {
        invoice: "INV001",
        paymentStatus: "Paid",
        totalAmount: "$250.00",
        paymentMethod: "Credit Card",
    },
    {
        invoice: "INV002",
        paymentStatus: "Pending",
        totalAmount: "$150.00",
        paymentMethod: "PayPal",
    },
    {
        invoice: "INV003",
        paymentStatus: "Unpaid",
        totalAmount: "$350.00",
        paymentMethod: "Bank Transfer",
    },
    {
        invoice: "INV004",
        paymentStatus: "Paid",
        totalAmount: "$450.00",
        paymentMethod: "Credit Card",
    },
    {
        invoice: "INV005",
        paymentStatus: "Paid",
        totalAmount: "$550.00",
        paymentMethod: "PayPal",
    },
    {
        invoice: "INV006",
        paymentStatus: "Pending",
        totalAmount: "$200.00",
        paymentMethod: "Bank Transfer",
    },
    {
        invoice: "INV007",
        paymentStatus: "Unpaid",
        totalAmount: "$300.00",
        paymentMethod: "Credit Card",
    },
]

export function DataList() {
    return (
        <div className="rounded-2xl border border-gray-200 shadow-sm overflow-hidden bg-white">
            <Table>
                <TableCaption className="text-gray-500 text-sm py-4">
                    A summary of your recent invoices
                </TableCaption>

                <TableHeader>
                    <TableRow className="bg-gray-50 hover:bg-gray-50">
                        <TableHead className="w-[120px] text-gray-700 font-semibold">Invoice</TableHead>
                        <TableHead className="text-gray-700 font-semibold">Status</TableHead>
                        <TableHead className="text-gray-700 font-semibold">Method</TableHead>
                        <TableHead className="text-right text-gray-700 font-semibold">Amount</TableHead>
                    </TableRow>
                </TableHeader>

                <TableBody>
                    {invoices.map((invoice) => (
                        <TableRow
                            key={invoice.invoice}
                            className="hover:bg-gray-50 transition-colors"
                        >
                            <TableCell className="font-medium text-gray-900">
                                #{invoice.invoice}
                            </TableCell>
                            <TableCell>
                                <Badge
                                    variant={
                                        invoice.paymentStatus === "Paid"
                                            ? "default"
                                            : invoice.paymentStatus === "Pending"
                                                ? "secondary"
                                                : "destructive"
                                    }
                                >
                                    {invoice.paymentStatus}
                                </Badge>
                            </TableCell>
                            <TableCell className="text-gray-700">
                                {invoice.paymentMethod}
                            </TableCell>
                            <TableCell className="text-right font-medium text-gray-900">
                                ₹{invoice.totalAmount}
                            </TableCell>
                        </TableRow>
                    ))}
                </TableBody>

                <TableFooter>
                    <TableRow className="bg-gray-50">
                        <TableCell colSpan={4} className="text-right py-4">
                            <div className="flex justify-between items-center">
                                <Button variant="outline" size="sm">
                                    Previous
                                </Button>
                                <Button size="sm">Next</Button>
                            </div>
                        </TableCell>
                    </TableRow>
                </TableFooter>
            </Table>
        </div>
    )
}