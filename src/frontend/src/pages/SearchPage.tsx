import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Search } from "lucide-react";
import { useMemo, useState } from "react";
import StudentSearchResults from "../components/students/StudentSearchResults";
import { useDebouncedValue } from "../hooks/useDebouncedValue";
import { useGetAllStudents } from "../hooks/useQueries";

export default function SearchPage() {
  const { data: allStudents = [], isLoading } = useGetAllStudents();
  const [searchQuery, setSearchQuery] = useState("");
  const debouncedQuery = useDebouncedValue(searchQuery, 300);

  // Filter out archived students
  const students = allStudents.filter((s) => !s.isArchived);

  const searchResults = useMemo(() => {
    if (!debouncedQuery.trim()) return [];

    const query = debouncedQuery.toLowerCase();
    return students.filter(
      (student) =>
        student.name.toLowerCase().includes(query) ||
        student.surname.toLowerCase().includes(query) ||
        student.parentName.toLowerCase().includes(query),
    );
  }, [students, debouncedQuery]);

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold tracking-tight">Search Students</h1>
        <p className="text-muted-foreground mt-1">
          Find student records by name or parent name
        </p>
      </div>

      <div className="relative">
        <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
        <Input
          placeholder="Search by student name, surname, or parent name..."
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          className="pl-10 text-lg py-6"
          autoFocus
        />
      </div>

      {isLoading ? (
        <div className="flex items-center justify-center py-12">
          <div className="text-center">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto mb-4" />
            <p className="text-muted-foreground">Loading students...</p>
          </div>
        </div>
      ) : !searchQuery.trim() ? (
        <Card>
          <CardContent className="flex flex-col items-center justify-center py-12">
            <Search className="h-12 w-12 text-muted-foreground mb-4" />
            <p className="text-muted-foreground">
              Start typing to search for students
            </p>
          </CardContent>
        </Card>
      ) : searchResults.length === 0 ? (
        <Card>
          <CardContent className="flex flex-col items-center justify-center py-12">
            <p className="text-muted-foreground">
              No students found matching "{searchQuery}"
            </p>
          </CardContent>
        </Card>
      ) : (
        <StudentSearchResults students={searchResults} />
      )}
    </div>
  );
}
