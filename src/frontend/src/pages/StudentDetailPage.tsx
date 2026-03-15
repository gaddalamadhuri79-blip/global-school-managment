import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
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
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useNavigate, useParams } from "@tanstack/react-router";
import { Archive, ArrowLeft, Edit, Printer } from "lucide-react";
import { useState } from "react";
import { toast } from "sonner";
import DuesSummary from "../components/fees/DuesSummary";
import FeeEntrySection from "../components/fees/FeeEntrySection";
import ReceiptReprintDialog from "../components/fees/ReceiptReprintDialog";
import StudentRatingsSection from "../components/ratings/StudentRatingsSection";
import StudentForm from "../components/students/StudentForm";
import StudentStatusBadge from "../components/students/StudentStatusBadge";
import { useArchiveStudent, useGetStudent } from "../hooks/useQueries";
import { getClassLabel } from "../lib/studentClassOptions";

export default function StudentDetailPage() {
  const { studentId } = useParams({ from: "/students/$studentId" });
  const navigate = useNavigate();
  const { data: student, isLoading } = useGetStudent(BigInt(studentId));
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false);
  const [isReprintDialogOpen, setIsReprintDialogOpen] = useState(false);
  const [isArchiveDialogOpen, setIsArchiveDialogOpen] = useState(false);
  const archiveStudent = useArchiveStudent();

  const handleArchive = async () => {
    try {
      await archiveStudent.mutateAsync(BigInt(studentId));
      toast.success("Student archived successfully");
      navigate({ to: "/students" });
    } catch (error) {
      console.error("Archive error:", error);
      toast.error("Failed to archive student");
    }
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-[60vh]">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto mb-4" />
          <p className="text-muted-foreground">Loading student details...</p>
        </div>
      </div>
    );
  }

  if (!student) {
    return (
      <div className="text-center py-12">
        <p className="text-muted-foreground">Student not found</p>
        <Button onClick={() => navigate({ to: "/students" })} className="mt-4">
          Back to Students
        </Button>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center gap-4">
        <Button
          variant="ghost"
          size="sm"
          onClick={() => navigate({ to: "/students" })}
        >
          <ArrowLeft className="h-4 w-4 mr-2" />
          Back
        </Button>
        <img
          src="/assets/generated/global-school-logo.dim_512x512.png"
          alt="Global School"
          className="h-8 w-8 object-contain"
        />
      </div>

      <div className="flex items-start justify-between">
        <div>
          <div className="flex items-center gap-3">
            <h1 className="text-3xl font-bold tracking-tight">
              {student.name} {student.surname}
            </h1>
            <StudentStatusBadge status={student.status} />
          </div>
          <p className="text-muted-foreground mt-1">
            Student ID: {student.id.toString()}
          </p>
        </div>
        <div className="flex gap-2">
          <Button
            onClick={() => setIsReprintDialogOpen(true)}
            variant="outline"
            className="gap-2"
          >
            <Printer className="h-4 w-4" />
            Print Receipt
          </Button>
          <Button
            onClick={() => setIsEditDialogOpen(true)}
            variant="outline"
            className="gap-2"
          >
            <Edit className="h-4 w-4" />
            Edit Profile
          </Button>
          <Button
            onClick={() => setIsArchiveDialogOpen(true)}
            variant="destructive"
            className="gap-2"
          >
            <Archive className="h-4 w-4" />
            Archive Student
          </Button>
        </div>
      </div>

      <div className="grid gap-6 md:grid-cols-2">
        <Card>
          <CardHeader>
            <CardTitle>Student Information</CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            <div>
              <p className="text-sm text-muted-foreground">Full Name</p>
              <p className="font-medium">
                {student.name} {student.surname}
              </p>
            </div>
            <div>
              <p className="text-sm text-muted-foreground">Parent Name</p>
              <p className="font-medium">{student.parentName}</p>
            </div>
            <div>
              <p className="text-sm text-muted-foreground">
                Father Phone Number
              </p>
              <p className="font-medium">
                {student.fatherPhoneNumber || "Not provided"}
              </p>
            </div>
            <div>
              <p className="text-sm text-muted-foreground">
                Mother Phone Number
              </p>
              <p className="font-medium">
                {student.motherPhoneNumber || "Not provided"}
              </p>
            </div>
            <div>
              <p className="text-sm text-muted-foreground">Email</p>
              <p className="font-medium">{student.email || "Not provided"}</p>
            </div>
            <div>
              <p className="text-sm text-muted-foreground">Class</p>
              <p className="font-medium">
                {getClassLabel(student.studentClass)}
              </p>
            </div>
          </CardContent>
        </Card>

        <DuesSummary student={student} />
      </div>

      <Tabs defaultValue="payments" className="w-full">
        <TabsList className="grid w-full grid-cols-2">
          <TabsTrigger value="payments">Payment History</TabsTrigger>
          <TabsTrigger value="ratings">Ratings</TabsTrigger>
        </TabsList>
        <TabsContent value="payments" className="mt-6">
          <FeeEntrySection student={student} />
        </TabsContent>
        <TabsContent value="ratings" className="mt-6">
          <StudentRatingsSection student={student} />
        </TabsContent>
      </Tabs>

      <Dialog open={isEditDialogOpen} onOpenChange={setIsEditDialogOpen}>
        <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>Edit Student Profile</DialogTitle>
            <DialogDescription>
              Update student information and fee details
            </DialogDescription>
          </DialogHeader>
          <StudentForm
            student={student}
            onSuccess={() => setIsEditDialogOpen(false)}
          />
        </DialogContent>
      </Dialog>

      <ReceiptReprintDialog
        student={student}
        open={isReprintDialogOpen}
        onOpenChange={setIsReprintDialogOpen}
      />

      <AlertDialog
        open={isArchiveDialogOpen}
        onOpenChange={setIsArchiveDialogOpen}
      >
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Archive Student?</AlertDialogTitle>
            <AlertDialogDescription>
              This will archive {student.name} {student.surname} and remove them
              from active student lists. All payment history, receipts, and
              ratings will be preserved for reporting purposes. This action
              cannot be undone from the interface.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction
              onClick={handleArchive}
              disabled={archiveStudent.isPending}
              className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
            >
              {archiveStudent.isPending ? "Archiving..." : "Archive Student"}
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
}
