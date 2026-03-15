import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { useState } from "react";
import { PaymentMode, type StudentProfile } from "../../backend";
import { computeBalanceAfterPayment } from "../../lib/fees";
import { formatINR } from "../../lib/moneyINR";
import { generateReceipt } from "../../lib/receiptPdf";
import { getClassLabel } from "../../lib/studentClassOptions";

interface ReceiptReprintDialogProps {
  student: StudentProfile;
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

const paymentModeLabels: Record<PaymentMode, string> = {
  [PaymentMode.cash]: "Cash",
  [PaymentMode.bhim]: "BHIM",
  [PaymentMode.phonePe]: "PhonePe",
  [PaymentMode.googlePay]: "Google Pay",
};

export default function ReceiptReprintDialog({
  student,
  open,
  onOpenChange,
}: ReceiptReprintDialogProps) {
  const [selectedPaymentIndex, setSelectedPaymentIndex] = useState<string>("");

  const sortedPayments = [...student.payments].sort(
    (a, b) => Number(b.date) - Number(a.date),
  );

  const handlePrint = () => {
    if (!selectedPaymentIndex) return;

    const index = Number.parseInt(selectedPaymentIndex, 10);
    const payment = sortedPayments[index];
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

    onOpenChange(false);
    setSelectedPaymentIndex("");
  };

  if (sortedPayments.length === 0) {
    return (
      <Dialog open={open} onOpenChange={onOpenChange}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Print Receipt</DialogTitle>
            <DialogDescription>
              No payments found for this student
            </DialogDescription>
          </DialogHeader>
          <div className="text-center py-4 text-muted-foreground">
            This student has no payment history yet.
          </div>
        </DialogContent>
      </Dialog>
    );
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Print Receipt</DialogTitle>
          <DialogDescription>
            Select a payment to print its receipt
          </DialogDescription>
        </DialogHeader>
        <div className="space-y-4 py-4">
          <div className="space-y-2">
            <Label htmlFor="payment-select">Select Payment</Label>
            <Select
              value={selectedPaymentIndex}
              onValueChange={setSelectedPaymentIndex}
            >
              <SelectTrigger id="payment-select">
                <SelectValue placeholder="Choose a payment..." />
              </SelectTrigger>
              <SelectContent>
                {sortedPayments.map((payment, index) => {
                  const date = new Date(Number(payment.date) / 1000000);
                  return (
                    // biome-ignore lint/suspicious/noArrayIndexKey: payments don't have stable unique keys
                    <SelectItem key={index} value={String(index)}>
                      Receipt #{Number(payment.receiptNo)} -{" "}
                      {date.toLocaleDateString("en-IN")} -{" "}
                      {formatINR(Number(payment.amount))} (
                      {paymentModeLabels[payment.paymentMode]})
                    </SelectItem>
                  );
                })}
              </SelectContent>
            </Select>
          </div>
          <Button
            onClick={handlePrint}
            disabled={!selectedPaymentIndex}
            className="w-full"
          >
            Print Receipt
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
}
