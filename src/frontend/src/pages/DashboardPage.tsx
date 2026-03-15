import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Link } from "@tanstack/react-router";
import {
  AlertCircle,
  FileText,
  Search,
  TrendingUp,
  UserPlus,
  Users,
} from "lucide-react";
import { StudentStatus } from "../backend";
import { useGetAllStudents } from "../hooks/useQueries";
import { computeStudentBalance } from "../lib/fees";
import { formatINR } from "../lib/moneyINR";

export default function DashboardPage() {
  const { data: allStudents = [], isLoading } = useGetAllStudents();

  // Filter out archived students
  const students = allStudents.filter((s) => !s.isArchived);

  const totalStudents = students.length;
  const incompleteProfiles = students.filter(
    (s) => s.status === StudentStatus.incompleteProfile,
  ).length;
  const totalFeesCollected = students.reduce((sum, student) => {
    const paid = student.payments.reduce(
      (pSum, p) => pSum + Number(p.amount),
      0,
    );
    return sum + paid;
  }, 0);
  const totalOutstanding = students.reduce((sum, student) => {
    const balance = computeStudentBalance(student);
    return sum + balance;
  }, 0);

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-[60vh]">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto mb-4" />
          <p className="text-muted-foreground">Loading dashboard...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold tracking-tight">Dashboard</h1>
        <p className="text-muted-foreground mt-1">
          Quick overview and actions for Global School management
        </p>
      </div>

      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">
              Total Students
            </CardTitle>
            <Users className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{totalStudents}</div>
            <p className="text-xs text-muted-foreground mt-1">
              Enrolled students
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">
              Incomplete Profiles
            </CardTitle>
            <AlertCircle className="h-4 w-4 text-amber-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{incompleteProfiles}</div>
            <p className="text-xs text-muted-foreground mt-1">Need attention</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">
              Fees Collected
            </CardTitle>
            <TrendingUp className="h-4 w-4 text-emerald-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {formatINR(totalFeesCollected)}
            </div>
            <p className="text-xs text-muted-foreground mt-1">Total received</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">
              Outstanding Dues
            </CardTitle>
            <FileText className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {formatINR(totalOutstanding)}
            </div>
            <p className="text-xs text-muted-foreground mt-1">
              Pending payments
            </p>
          </CardContent>
        </Card>
      </div>

      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
        <Card className="hover:shadow-lg transition-shadow cursor-pointer">
          <Link to="/students">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <UserPlus className="h-5 w-5" />
                Add New Student
              </CardTitle>
              <CardDescription>
                Register a new student admission
              </CardDescription>
            </CardHeader>
          </Link>
        </Card>

        <Card className="hover:shadow-lg transition-shadow cursor-pointer">
          <Link to="/search">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Search className="h-5 w-5" />
                Search Students
              </CardTitle>
              <CardDescription>Find student records quickly</CardDescription>
            </CardHeader>
          </Link>
        </Card>

        <Card className="hover:shadow-lg transition-shadow cursor-pointer">
          <Link to="/reports">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <FileText className="h-5 w-5" />
                View Reports
              </CardTitle>
              <CardDescription>Fee collection reports</CardDescription>
            </CardHeader>
          </Link>
        </Card>
      </div>
    </div>
  );
}
