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
import { Input } from "@/components/ui/input";
import { Link } from "@tanstack/react-router";
import { Search, UserPlus } from "lucide-react";
import { useState } from "react";
import StudentForm from "../components/students/StudentForm";
import StudentStatusBadge from "../components/students/StudentStatusBadge";
import { useGetAllStudents } from "../hooks/useQueries";
import { getClassLabel } from "../lib/studentClassOptions";

export default function StudentsPage() {
  const { data: allStudents = [], isLoading } = useGetAllStudents();
  const [isAddDialogOpen, setIsAddDialogOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");

  // Filter out archived students
  const students = allStudents.filter((s) => !s.isArchived);

  const filteredStudents = students.filter((student) => {
    const query = searchQuery.toLowerCase();
    return (
      student.name.toLowerCase().includes(query) ||
      student.surname.toLowerCase().includes(query) ||
      student.parentName.toLowerCase().includes(query)
    );
  });

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-[60vh]">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto mb-4" />
          <p className="text-muted-foreground">Loading students...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Students</h1>
          <p className="text-muted-foreground mt-1">
            Manage student records and admissions
          </p>
        </div>
        <Button onClick={() => setIsAddDialogOpen(true)} className="gap-2">
          <UserPlus className="h-4 w-4" />
          Add Student
        </Button>
      </div>

      <div className="relative">
        <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
        <Input
          placeholder="Search by name, surname, or parent name..."
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          className="pl-10"
        />
      </div>

      {filteredStudents.length === 0 ? (
        <Card>
          <CardContent className="flex flex-col items-center justify-center py-12">
            <p className="text-muted-foreground mb-4">
              {searchQuery
                ? "No students found matching your search"
                : "No students registered yet"}
            </p>
            {!searchQuery && (
              <Button
                onClick={() => setIsAddDialogOpen(true)}
                className="gap-2"
              >
                <UserPlus className="h-4 w-4" />
                Add First Student
              </Button>
            )}
          </CardContent>
        </Card>
      ) : (
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
          {filteredStudents.map((student) => (
            <Link
              key={student.id.toString()}
              to="/students/$studentId"
              params={{ studentId: student.id.toString() }}
            >
              <Card className="hover:shadow-lg transition-shadow cursor-pointer h-full">
                <CardHeader>
                  <div className="flex items-start justify-between">
                    <div className="flex-1">
                      <CardTitle className="text-lg">
                        {student.name} {student.surname}
                      </CardTitle>
                      <CardDescription className="mt-1">
                        Parent: {student.parentName}
                      </CardDescription>
                    </div>
                    <StudentStatusBadge status={student.status} />
                  </div>
                </CardHeader>
                <CardContent>
                  <div className="space-y-2 text-sm">
                    <div className="flex justify-between">
                      <span className="text-muted-foreground">Class:</span>
                      <span className="font-medium">
                        {getClassLabel(student.studentClass)}
                      </span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-muted-foreground">Student ID:</span>
                      <span className="font-medium">
                        {student.id.toString()}
                      </span>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </Link>
          ))}
        </div>
      )}

      <Dialog open={isAddDialogOpen} onOpenChange={setIsAddDialogOpen}>
        <DialogContent className="max-w-2xl">
          <DialogHeader>
            <DialogTitle>Add New Student</DialogTitle>
            <DialogDescription>
              Register a new student admission
            </DialogDescription>
          </DialogHeader>
          <div className="max-h-[70vh] overflow-y-auto pr-1">
            <StudentForm onSuccess={() => setIsAddDialogOpen(false)} />
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
}
