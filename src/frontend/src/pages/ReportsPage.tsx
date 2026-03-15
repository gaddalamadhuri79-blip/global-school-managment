import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useState } from "react";
import FeeMathValidator from "../components/admin/FeeMathValidator";
import PaymentsReportTable from "../components/reports/PaymentsReportTable";
import { useGetAllStudents } from "../hooks/useQueries";
import { formatINR } from "../lib/moneyINR";
import {
  type ReportPeriod,
  getDailyPaymentRows,
  getDailyReport,
  getMonthlyPaymentRows,
  getMonthlyReport,
  getYearlyPaymentRows,
  getYearlyReport,
} from "../lib/reports";

export default function ReportsPage() {
  const { data: allStudents = [], isLoading } = useGetAllStudents();
  const [activeTab, setActiveTab] = useState<"daily" | "monthly" | "yearly">(
    "monthly",
  );

  const students = allStudents.filter((s) => !s.isArchived);

  const dailyReport = getDailyReport(students);
  const monthlyReport = getMonthlyReport(students);
  const yearlyReport = getYearlyReport(students);

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-[60vh]">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto mb-4" />
          <p className="text-muted-foreground">Loading reports...</p>
        </div>
      </div>
    );
  }

  const renderPeriodAccordion = (
    periods: ReportPeriod[],
    totalCollected: number,
    type: "daily" | "monthly" | "yearly",
    getRows: (label: string) => ReturnType<typeof getDailyPaymentRows>,
  ) => {
    if (periods.length === 0) {
      return (
        <div className="text-center py-12 text-muted-foreground">
          No payment data available for this period
        </div>
      );
    }

    return (
      <div className="space-y-4">
        <Card className="bg-primary/5">
          <CardContent className="p-6">
            <div className="text-center">
              <p className="text-sm text-muted-foreground mb-1">
                Total Collected
              </p>
              <p className="text-3xl font-bold text-primary">
                {formatINR(totalCollected)}
              </p>
            </div>
          </CardContent>
        </Card>

        <Accordion type="single" collapsible className="space-y-2">
          {periods.map((period, index) => (
            <AccordionItem
              key={period.label}
              value={`${type}-${index}`}
              className="border rounded-lg"
            >
              <AccordionTrigger className="px-4 hover:no-underline">
                <div className="flex items-center justify-between w-full pr-4">
                  <div className="text-left">
                    <p className="font-medium">{period.label}</p>
                    <p className="text-sm text-muted-foreground">
                      {period.paymentCount} payment
                      {period.paymentCount !== 1 ? "s" : ""}
                    </p>
                  </div>
                  <p className="text-lg font-semibold">
                    {formatINR(period.total)}
                  </p>
                </div>
              </AccordionTrigger>
              <AccordionContent className="px-4 pb-4">
                <PaymentsReportTable rows={getRows(period.label)} />
              </AccordionContent>
            </AccordionItem>
          ))}
        </Accordion>
      </div>
    );
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          <img
            src="/assets/generated/global-school-logo.dim_512x512.png"
            alt="Global School"
            className="h-10 w-10 object-contain"
          />
          <div>
            <h1 className="text-3xl font-bold tracking-tight">
              Fee Collection Reports
            </h1>
            <p className="text-muted-foreground mt-1">
              View daily, monthly, and yearly fee collection history
            </p>
          </div>
        </div>
        <FeeMathValidator students={students} />
      </div>

      <Tabs
        value={activeTab}
        onValueChange={(v) => setActiveTab(v as "daily" | "monthly" | "yearly")}
      >
        <TabsList className="grid w-full max-w-md grid-cols-3">
          <TabsTrigger value="daily">Daily</TabsTrigger>
          <TabsTrigger value="monthly">Monthly</TabsTrigger>
          <TabsTrigger value="yearly">Yearly</TabsTrigger>
        </TabsList>

        <TabsContent value="daily" className="mt-6">
          <Card>
            <CardHeader>
              <CardTitle>Daily Collection Report</CardTitle>
              <CardDescription>
                Fee collection breakdown by day with individual payment details
              </CardDescription>
            </CardHeader>
            <CardContent>
              {renderPeriodAccordion(
                dailyReport.periods,
                dailyReport.totalCollected,
                "daily",
                (label) => getDailyPaymentRows(students, label),
              )}
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="monthly" className="mt-6">
          <Card>
            <CardHeader>
              <CardTitle>Monthly Collection Report</CardTitle>
              <CardDescription>
                Fee collection breakdown by month with individual payment
                details
              </CardDescription>
            </CardHeader>
            <CardContent>
              {renderPeriodAccordion(
                monthlyReport.periods,
                monthlyReport.totalCollected,
                "monthly",
                (label) => getMonthlyPaymentRows(students, label),
              )}
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="yearly" className="mt-6">
          <Card>
            <CardHeader>
              <CardTitle>Yearly Collection Report</CardTitle>
              <CardDescription>
                Fee collection breakdown by year with individual payment details
              </CardDescription>
            </CardHeader>
            <CardContent>
              {renderPeriodAccordion(
                yearlyReport.periods,
                yearlyReport.totalCollected,
                "yearly",
                (label) => getYearlyPaymentRows(students, label),
              )}
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}
