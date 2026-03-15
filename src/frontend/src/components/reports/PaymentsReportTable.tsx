import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { formatINR } from "../../lib/moneyINR";
import type { PaymentReportRow } from "../../lib/reports";

interface PaymentsReportTableProps {
  rows: PaymentReportRow[];
  emptyMessage?: string;
}

export default function PaymentsReportTable({
  rows,
  emptyMessage = "No payments found for this period",
}: PaymentsReportTableProps) {
  if (rows.length === 0) {
    return (
      <div className="text-center py-8 text-muted-foreground">
        {emptyMessage}
      </div>
    );
  }

  return (
    <div className="border rounded-lg overflow-hidden">
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>Receipt No</TableHead>
            <TableHead>Parent Name</TableHead>
            <TableHead>Class</TableHead>
            <TableHead>Student Name</TableHead>
            <TableHead className="text-right">Amount Paid</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {rows.map((row, index) => (
            // biome-ignore lint/suspicious/noArrayIndexKey: report rows don't have stable unique keys
            <TableRow key={index}>
              <TableCell className="font-medium">{row.receiptNo}</TableCell>
              <TableCell>{row.parentName}</TableCell>
              <TableCell>{row.classLabel}</TableCell>
              <TableCell>{row.studentName}</TableCell>
              <TableCell className="text-right font-medium">
                {formatINR(row.amountPaid)}
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  );
}
