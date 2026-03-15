import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { useState } from "react";
import { toast } from "sonner";
import { PaymentMode, type StudentProfile } from "../../backend";
import { useAddPayment } from "../../hooks/useQueries";
import { useLogoAnimation } from "../../lib/LogoAnimationContext";
import { computeTotalPaid } from "../../lib/fees";
import { generateReceipt } from "../../lib/receiptPdf";
import { getClassLabel } from "../../lib/studentClassOptions";

interface PaymentFormProps {
  student: StudentProfile;
  onSuccess?: () => void;
}

const paymentModeOptions = [
  { value: PaymentMode.cash, label: "Cash" },
  { value: PaymentMode.bhim, label: "BHIM" },
  { value: PaymentMode.phonePe, label: "PhonePe" },
  { value: PaymentMode.googlePay, label: "Google Pay" },
];

export default function PaymentForm({ student, onSuccess }: PaymentFormProps) {
  const [amount, setAmount] = useState("");
  const [paymentMode, setPaymentMode] = useState<PaymentMode>(PaymentMode.cash);
  const addPayment = useAddPayment();
  const { triggerAnimation } = useLogoAnimation();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!amount.trim() || Number.isNaN(Number(amount)) || Number(amount) <= 0) {
      toast.error("Please enter a valid payment amount");
      return;
    }

    const paymentEntry = {
      date: BigInt(Date.now() * 1000000),
      amount: BigInt(amount),
      paymentMode,
      receiptNo: BigInt(0),
    };

    try {
      const receiptNo = await addPayment.mutateAsync({
        studentId: student.id,
        payment: paymentEntry,
      });

      // Calculate remaining balance after this payment
      const totalPaid = computeTotalPaid(student) + Number(amount);
      const remainingBalance = Number(student.totalFee) - totalPaid;

      generateReceipt({
        receiptNo: Number(receiptNo),
        studentName: `${student.name} ${student.surname}`,
        parentName: student.parentName,
        classLabel: getClassLabel(student.studentClass),
        totalFee: Number(student.totalFee),
        date: new Date(),
        amountPaid: Number(amount),
        paymentMode,
        remainingBalance,
      });

      toast.success("Payment recorded and receipt generated");
      triggerAnimation();
      setAmount("");
      onSuccess?.();
    } catch (error) {
      console.error("Error recording payment:", error);
      toast.error("Failed to record payment");
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div className="space-y-2">
        <Label htmlFor="amount">
          Amount <span className="text-destructive">*</span>
        </Label>
        <Input
          id="amount"
          type="number"
          value={amount}
          onChange={(e) => setAmount(e.target.value)}
          placeholder="Enter payment amount"
          min="0"
          step="1"
          required
        />
      </div>

      <div className="space-y-2">
        <Label htmlFor="paymentMode">
          Payment Mode <span className="text-destructive">*</span>
        </Label>
        <Select
          value={paymentMode}
          onValueChange={(value) => setPaymentMode(value as PaymentMode)}
        >
          <SelectTrigger id="paymentMode">
            <SelectValue placeholder="Select payment mode" />
          </SelectTrigger>
          <SelectContent>
            {paymentModeOptions.map((option) => (
              <SelectItem key={option.value} value={option.value}>
                {option.label}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>

      <div className="flex justify-end pt-4">
        <Button
          type="submit"
          disabled={addPayment.isPending}
          className="min-w-[120px]"
        >
          {addPayment.isPending ? "Recording..." : "Record Payment"}
        </Button>
      </div>
    </form>
  );
}
