import type { PaymentEntry, StudentProfile } from "../backend";

export function computeTotalPaid(student: StudentProfile): number {
  return student.payments.reduce(
    (sum, payment) => sum + Number(payment.amount),
    0,
  );
}

export function computeStudentBalance(student: StudentProfile): number {
  const totalFee = Number(student.totalFee);
  const amountPaid = computeTotalPaid(student);
  return totalFee - amountPaid;
}

export function computeBalanceAfterPayment(
  student: StudentProfile,
  targetPayment: PaymentEntry,
): number {
  const totalFee = Number(student.totalFee);

  // Sort payments by date to compute balance at the time of target payment
  const sortedPayments = [...student.payments].sort(
    (a, b) => Number(a.date) - Number(b.date),
  );

  // Find the index of the target payment and sum all payments up to and including it
  let totalPaidUpToTarget = 0;
  for (const payment of sortedPayments) {
    totalPaidUpToTarget += Number(payment.amount);
    if (
      payment.date === targetPayment.date &&
      payment.amount === targetPayment.amount
    ) {
      break;
    }
  }

  return totalFee - totalPaidUpToTarget;
}
