import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Link } from "@tanstack/react-router";
import type { StudentProfile } from "../../backend";
import { getClassLabel } from "../../lib/studentClassOptions";
import StudentStatusBadge from "./StudentStatusBadge";

interface StudentSearchResultsProps {
  students: StudentProfile[];
}

export default function StudentSearchResults({
  students,
}: StudentSearchResultsProps) {
  return (
    <div className="space-y-2">
      {students.map((student) => (
        <Link
          key={student.id.toString()}
          to="/students/$studentId"
          params={{ studentId: student.id.toString() }}
          className="block"
        >
          <Card className="hover:shadow-md transition-shadow cursor-pointer">
            <CardContent className="p-4">
              <div className="flex items-center justify-between">
                <div className="flex-1">
                  <div className="flex items-center gap-2">
                    <h3 className="font-semibold">
                      {student.name} {student.surname}
                    </h3>
                    <StudentStatusBadge status={student.status} />
                  </div>
                  <div className="text-sm text-muted-foreground mt-1">
                    <span>Parent: {student.parentName}</span>
                    <span className="mx-2">•</span>
                    <span>Class: {getClassLabel(student.studentClass)}</span>
                  </div>
                  {(student.fatherPhoneNumber || student.motherPhoneNumber) && (
                    <div className="text-sm text-muted-foreground mt-1">
                      {student.fatherPhoneNumber && (
                        <span>Father: {student.fatherPhoneNumber}</span>
                      )}
                      {student.fatherPhoneNumber &&
                        student.motherPhoneNumber && (
                          <span className="mx-2">•</span>
                        )}
                      {student.motherPhoneNumber && (
                        <span>Mother: {student.motherPhoneNumber}</span>
                      )}
                    </div>
                  )}
                </div>
                <Button variant="ghost" size="sm">
                  View →
                </Button>
              </div>
            </CardContent>
          </Card>
        </Link>
      ))}
    </div>
  );
}
