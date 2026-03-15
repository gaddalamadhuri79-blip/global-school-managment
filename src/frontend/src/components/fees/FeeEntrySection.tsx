import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Plus } from "lucide-react";
import { useState } from "react";
import type { StudentProfile } from "../../backend";
import PaymentForm from "./PaymentForm";
import PaymentsTable from "./PaymentsTable";

interface FeeEntrySectionProps {
  student: StudentProfile;
}

export default function FeeEntrySection({ student }: FeeEntrySectionProps) {
  const [isAddPaymentOpen, setIsAddPaymentOpen] = useState(false);

  return (
    <Card>
      <CardHeader>
        <div className="flex items-center justify-between">
          <div>
            <CardTitle>Payment History</CardTitle>
            <CardDescription>Record and view all fee payments</CardDescription>
          </div>
          <Button onClick={() => setIsAddPaymentOpen(true)} className="gap-2">
            <Plus className="h-4 w-4" />
            Add Payment
          </Button>
        </div>
      </CardHeader>
      <CardContent>
        <PaymentsTable student={student} />
      </CardContent>

      <Dialog open={isAddPaymentOpen} onOpenChange={setIsAddPaymentOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Record Payment</DialogTitle>
            <DialogDescription>
              Enter payment details for {student.name} {student.surname}
            </DialogDescription>
          </DialogHeader>
          <PaymentForm
            student={student}
            onSuccess={() => setIsAddPaymentOpen(false)}
          />
        </DialogContent>
      </Dialog>
    </Card>
  );
}
