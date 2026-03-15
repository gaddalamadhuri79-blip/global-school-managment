import { Button } from "@/components/ui/button";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Printer } from "lucide-react";
import { PaymentMode, type StudentProfile } from "../../backend";
import { computeBalanceAfterPayment } from "../../lib/fees";
import { formatINR } from "../../lib/moneyINR";
import { generateReceipt } from "../../lib/receiptPdf";
import { getClassLabel } from "../../lib/studentClassOptions";

interface PaymentsTableProps {
  student: StudentProfile;
}

const paymentModeLabels: Record<PaymentMode, string> = {
  [PaymentMode.cash]: "Cash",
  [PaymentMode.bhim]: "BHIM",
  [PaymentMode.phonePe]: "PhonePe",
  [PaymentMode.googlePay]: "Google Pay",
};

export default function PaymentsTable({ student }: PaymentsTableProps) {
  const sortedPayments = [...student.payments].sort(
    (a, b) => Number(b.date) - Number(a.date),
  );

  if (sortedPayments.length === 0) {
    return (
      <div className="text-center py-8 text-muted-foreground">
        No payments recorded yet
      </div>
    );
  }

  const handlePrintReceipt = (paymentIndex: number) => {
    const payment = sortedPayments[paymentIndex];
    const remainingBalance = computeBalanceAfterPayment(student, payment);
    const paymentDate = new Date(Number(payment.date) / 1000000);

    generateReceipt({
      receiptNo: Number(payment.receiptNo),
      studentName: `${student.name} ${student.surname}`,
      parentName: student.parentName,
      classLabel: getClassLabel(student.studentClass),
      totalFee: Number(student.totalFee),
      date: paymentDate,
      amountPaid: Number(payment.amount),
      paymentMode: payment.paymentMode,
      remainingBalance,
    });
  };

  return (
    <Table>
      <TableHeader>
        <TableRow>
          <TableHead>Receipt No</TableHead>
          <TableHead>Date</TableHead>
          <TableHead>Payment Mode</TableHead>
          <TableHead className="text-right">Amount</TableHead>
          <TableHead className="text-right">Actions</TableHead>
        </TableRow>
      </TableHeader>
      <TableBody>
        {sortedPayments.map((payment, index) => {
          const date = new Date(Number(payment.date) / 1000000);
          return (
            // biome-ignore lint/suspicious/noArrayIndexKey: payments don't have stable unique keys
            <TableRow key={index}>
              <TableCell className="font-medium">
                {Number(payment.receiptNo)}
              </TableCell>
              <TableCell>{date.toLocaleDateString("en-IN")}</TableCell>
              <TableCell>{paymentModeLabels[payment.paymentMode]}</TableCell>
              <TableCell className="text-right font-medium">
                {formatINR(Number(payment.amount))}
              </TableCell>
              <TableCell className="text-right">
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => handlePrintReceipt(index)}
                  className="gap-1"
                >
                  <Printer className="h-3 w-3" />
                  Print
                </Button>
              </TableCell>
            </TableRow>
          );
        })}
      </TableBody>
    </Table>
  );
}
