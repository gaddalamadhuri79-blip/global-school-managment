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
  DialogTrigger,
} from "@/components/ui/dialog";
import { AlertTriangle, Calculator, CheckCircle2 } from "lucide-react";
import { useState } from "react";
import type { StudentProfile } from "../../backend";
import { computeStudentBalance, computeTotalPaid } from "../../lib/fees";
import { formatINR } from "../../lib/moneyINR";

interface FeeMathValidatorProps {
  students: StudentProfile[];
}

interface ValidationIssue {
  studentId: string;
  studentName: string;
  issue: string;
}

export default function FeeMathValidator({ students }: FeeMathValidatorProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [hasRun, setHasRun] = useState(false);
  const [issues, setIssues] = useState<ValidationIssue[]>([]);

  const runValidation = () => {
    const foundIssues: ValidationIssue[] = [];

    for (const student of students) {
      const totalFee = Number(student.totalFee);
      const amountPaid = computeTotalPaid(student);
      const balance = computeStudentBalance(student);

      const expectedBalance = totalFee - amountPaid;
      if (balance !== expectedBalance) {
        foundIssues.push({
          studentId: student.id.toString(),
          studentName: `${student.name} ${student.surname}`,
          issue: `Balance mismatch: Expected ${formatINR(expectedBalance)}, got ${formatINR(balance)}`,
        });
      }

      if (totalFee < 0) {
        foundIssues.push({
          studentId: student.id.toString(),
          studentName: `${student.name} ${student.surname}`,
          issue: `Negative total fee: ${formatINR(totalFee)}`,
        });
      }

      if (amountPaid < 0) {
        foundIssues.push({
          studentId: student.id.toString(),
          studentName: `${student.name} ${student.surname}`,
          issue: `Negative amount paid: ${formatINR(amountPaid)}`,
        });
      }
    }

    setIssues(foundIssues);
    setHasRun(true);
  };

  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DialogTrigger asChild>
        <Button variant="outline" className="gap-2">
          <Calculator className="h-4 w-4" />
          Validate Fee Math
        </Button>
      </DialogTrigger>
      <DialogContent className="max-w-2xl">
        <DialogHeader>
          <DialogTitle>Fee Calculation Validator</DialogTitle>
          <DialogDescription>
            Run validation checks to ensure all fee calculations are accurate
          </DialogDescription>
        </DialogHeader>

        <div className="max-h-[70vh] overflow-y-auto space-y-4 pr-1">
          {!hasRun ? (
            <Card>
              <CardContent className="pt-6">
                <div className="text-center space-y-4">
                  <Calculator className="h-12 w-12 mx-auto text-muted-foreground" />
                  <p className="text-muted-foreground">
                    Click the button below to validate fee calculations for all{" "}
                    {students.length} students
                  </p>
                  <Button onClick={runValidation} className="gap-2">
                    <Calculator className="h-4 w-4" />
                    Run Validation
                  </Button>
                </div>
              </CardContent>
            </Card>
          ) : issues.length === 0 ? (
            <Card className="border-emerald-200 bg-emerald-50 dark:bg-emerald-950">
              <CardHeader>
                <CardTitle className="flex items-center gap-2 text-emerald-700 dark:text-emerald-400">
                  <CheckCircle2 className="h-5 w-5" />
                  No Issues Found
                </CardTitle>
                <CardDescription>
                  All fee calculations are accurate. Total Fee − Amount Paid =
                  Balance Due for all students.
                </CardDescription>
              </CardHeader>
              <CardContent>
                <p className="text-sm text-emerald-600 dark:text-emerald-400">
                  Validated {students.length} student records successfully.
                </p>
              </CardContent>
            </Card>
          ) : (
            <Card className="border-amber-200 bg-amber-50 dark:bg-amber-950">
              <CardHeader>
                <CardTitle className="flex items-center gap-2 text-amber-700 dark:text-amber-400">
                  <AlertTriangle className="h-5 w-5" />
                  Issues Found
                </CardTitle>
                <CardDescription>
                  {issues.length} issue{issues.length !== 1 ? "s" : ""} detected
                  in fee calculations
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-2">
                  {issues.map((issue) => (
                    <div
                      key={issue.studentId}
                      className="p-3 bg-background rounded-md border text-sm"
                    >
                      <p className="font-medium">{issue.studentName}</p>
                      <p className="text-muted-foreground mt-1">
                        {issue.issue}
                      </p>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          )}

          {hasRun && (
            <Button
              onClick={runValidation}
              variant="outline"
              className="w-full"
            >
              Run Validation Again
            </Button>
          )}
        </div>
      </DialogContent>
    </Dialog>
  );
}
