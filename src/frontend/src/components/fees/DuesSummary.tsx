import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import type { StudentProfile } from "../../backend";
import { computeStudentBalance, computeTotalPaid } from "../../lib/fees";
import { formatINR } from "../../lib/moneyINR";

interface DuesSummaryProps {
  student: StudentProfile;
}

export default function DuesSummary({ student }: DuesSummaryProps) {
  const totalFee = Number(student.totalFee);
  const amountPaid = computeTotalPaid(student);
  const balanceDue = computeStudentBalance(student);

  return (
    <Card>
      <CardHeader>
        <CardTitle>Fee Summary</CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="flex justify-between items-center pb-2 border-b">
          <span className="text-muted-foreground">Total Fee</span>
          <span className="text-lg font-semibold">{formatINR(totalFee)}</span>
        </div>
        <div className="flex justify-between items-center pb-2 border-b">
          <span className="text-muted-foreground">Amount Paid</span>
          <span className="text-lg font-semibold text-emerald-600">
            {formatINR(amountPaid)}
          </span>
        </div>
        <div className="flex justify-between items-center pt-2">
          <span className="font-medium">Balance Due</span>
          <span
            className={`text-xl font-bold ${balanceDue > 0 ? "text-amber-600" : "text-emerald-600"}`}
          >
            {formatINR(balanceDue)}
          </span>
        </div>
      </CardContent>
    </Card>
  );
}
