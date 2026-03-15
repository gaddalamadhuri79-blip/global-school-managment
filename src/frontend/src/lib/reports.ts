import type { PaymentEntry, StudentProfile } from "../backend";
import { getClassLabel } from "./studentClassOptions";

export interface ReportPeriod {
  label: string;
  total: number;
  paymentCount: number;
}

export interface Report {
  periods: ReportPeriod[];
  totalCollected: number;
}

export interface PaymentReportRow {
  receiptNo: number;
  parentName: string;
  classLabel: string;
  studentName: string;
  amountPaid: number;
  date: Date;
}

export function getDailyReport(students: StudentProfile[]): Report {
  const dailyMap = new Map<string, { total: number; count: number }>();

  for (const student of students) {
    for (const payment of student.payments) {
      const date = new Date(Number(payment.date) / 1000000);
      const dateKey = date.toLocaleDateString("en-IN");
      const existing = dailyMap.get(dateKey) || { total: 0, count: 0 };
      dailyMap.set(dateKey, {
        total: existing.total + Number(payment.amount),
        count: existing.count + 1,
      });
    }
  }

  const periods: ReportPeriod[] = Array.from(dailyMap.entries())
    .map(([label, data]) => ({
      label,
      total: data.total,
      paymentCount: data.count,
    }))
    .sort((a, b) => {
      const dateA = new Date(a.label.split("/").reverse().join("-"));
      const dateB = new Date(b.label.split("/").reverse().join("-"));
      return dateB.getTime() - dateA.getTime();
    });

  const totalCollected = periods.reduce((sum, p) => sum + p.total, 0);
  return { periods, totalCollected };
}

export function getMonthlyReport(students: StudentProfile[]): Report {
  const monthlyMap = new Map<string, { total: number; count: number }>();

  for (const student of students) {
    for (const payment of student.payments) {
      const date = new Date(Number(payment.date) / 1000000);
      const monthKey = `${date.toLocaleString("en-IN", { month: "long" })} ${date.getFullYear()}`;
      const existing = monthlyMap.get(monthKey) || { total: 0, count: 0 };
      monthlyMap.set(monthKey, {
        total: existing.total + Number(payment.amount),
        count: existing.count + 1,
      });
    }
  }

  const periods: ReportPeriod[] = Array.from(monthlyMap.entries())
    .map(([label, data]) => ({
      label,
      total: data.total,
      paymentCount: data.count,
    }))
    .sort((a, b) => {
      const [monthA, yearA] = a.label.split(" ");
      const [monthB, yearB] = b.label.split(" ");
      const dateA = new Date(`${monthA} 1, ${yearA}`);
      const dateB = new Date(`${monthB} 1, ${yearB}`);
      return dateB.getTime() - dateA.getTime();
    });

  const totalCollected = periods.reduce((sum, p) => sum + p.total, 0);
  return { periods, totalCollected };
}

export function getYearlyReport(students: StudentProfile[]): Report {
  const yearlyMap = new Map<string, { total: number; count: number }>();

  for (const student of students) {
    for (const payment of student.payments) {
      const date = new Date(Number(payment.date) / 1000000);
      const yearKey = date.getFullYear().toString();
      const existing = yearlyMap.get(yearKey) || { total: 0, count: 0 };
      yearlyMap.set(yearKey, {
        total: existing.total + Number(payment.amount),
        count: existing.count + 1,
      });
    }
  }

  const periods: ReportPeriod[] = Array.from(yearlyMap.entries())
    .map(([label, data]) => ({
      label,
      total: data.total,
      paymentCount: data.count,
    }))
    .sort((a, b) => Number.parseInt(b.label) - Number.parseInt(a.label));

  const totalCollected = periods.reduce((sum, p) => sum + p.total, 0);
  return { periods, totalCollected };
}

export function getDailyPaymentRows(
  students: StudentProfile[],
  dateKey: string,
): PaymentReportRow[] {
  const rows: PaymentReportRow[] = [];

  for (const student of students) {
    for (const payment of student.payments) {
      const date = new Date(Number(payment.date) / 1000000);
      if (date.toLocaleDateString("en-IN") === dateKey) {
        rows.push({
          receiptNo: Number(payment.receiptNo),
          parentName: student.parentName,
          classLabel: getClassLabel(student.studentClass),
          studentName: `${student.name} ${student.surname}`,
          amountPaid: Number(payment.amount),
          date,
        });
      }
    }
  }

  return rows.sort((a, b) => a.receiptNo - b.receiptNo);
}

export function getMonthlyPaymentRows(
  students: StudentProfile[],
  monthKey: string,
): PaymentReportRow[] {
  const rows: PaymentReportRow[] = [];

  for (const student of students) {
    for (const payment of student.payments) {
      const date = new Date(Number(payment.date) / 1000000);
      const paymentMonthKey = `${date.toLocaleString("en-IN", { month: "long" })} ${date.getFullYear()}`;
      if (paymentMonthKey === monthKey) {
        rows.push({
          receiptNo: Number(payment.receiptNo),
          parentName: student.parentName,
          classLabel: getClassLabel(student.studentClass),
          studentName: `${student.name} ${student.surname}`,
          amountPaid: Number(payment.amount),
          date,
        });
      }
    }
  }

  return rows.sort((a, b) => a.receiptNo - b.receiptNo);
}

export function getYearlyPaymentRows(
  students: StudentProfile[],
  yearKey: string,
): PaymentReportRow[] {
  const rows: PaymentReportRow[] = [];

  for (const student of students) {
    for (const payment of student.payments) {
      const date = new Date(Number(payment.date) / 1000000);
      if (date.getFullYear().toString() === yearKey) {
        rows.push({
          receiptNo: Number(payment.receiptNo),
          parentName: student.parentName,
          classLabel: getClassLabel(student.studentClass),
          studentName: `${student.name} ${student.surname}`,
          amountPaid: Number(payment.amount),
          date,
        });
      }
    }
  }

  return rows.sort((a, b) => a.receiptNo - b.receiptNo);
}

export function getAllPaymentRows(
  students: StudentProfile[],
): PaymentReportRow[] {
  const rows: PaymentReportRow[] = [];

  for (const student of students) {
    for (const payment of student.payments) {
      const date = new Date(Number(payment.date) / 1000000);
      rows.push({
        receiptNo: Number(payment.receiptNo),
        parentName: student.parentName,
        classLabel: getClassLabel(student.studentClass),
        studentName: `${student.name} ${student.surname}`,
        amountPaid: Number(payment.amount),
        date,
      });
    }
  }

  return rows.sort((a, b) => a.receiptNo - b.receiptNo);
}
