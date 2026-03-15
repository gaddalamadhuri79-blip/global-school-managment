import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Star } from "lucide-react";
import type { StudentProfile } from "../../backend";
import { useGetStudentRatings } from "../../hooks/useQueries";

interface StudentRatingsSectionProps {
  student: StudentProfile;
}

export default function StudentRatingsSection({
  student,
}: StudentRatingsSectionProps) {
  const { data: ratings, isLoading } = useGetStudentRatings(student.id);

  if (isLoading) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>Parent Ratings</CardTitle>
          <CardDescription>Loading ratings...</CardDescription>
        </CardHeader>
      </Card>
    );
  }

  const sortedRatings = ratings
    ? [...ratings].sort((a, b) => Number(b.date) - Number(a.date))
    : [];

  return (
    <Card>
      <CardHeader>
        <CardTitle>Parent Ratings</CardTitle>
        <CardDescription>
          Ratings and reviews collected after payments
        </CardDescription>
      </CardHeader>
      <CardContent>
        {sortedRatings.length === 0 ? (
          <div className="text-center py-8 text-muted-foreground">
            No ratings recorded yet
          </div>
        ) : (
          <div className="space-y-4">
            {sortedRatings.map((rating, index) => {
              const date = new Date(Number(rating.date) / 1000000);
              return (
                // biome-ignore lint/suspicious/noArrayIndexKey: ratings don't have stable unique keys
                <div key={index} className="border rounded-lg p-4 space-y-2">
                  <div className="flex items-center justify-between">
                    <div className="flex gap-1">
                      {[1, 2, 3, 4, 5].map((star) => (
                        <Star
                          key={star}
                          className={`h-5 w-5 ${
                            star <= Number(rating.rating)
                              ? "fill-yellow-400 text-yellow-400"
                              : "text-gray-300"
                          }`}
                        />
                      ))}
                    </div>
                    <span className="text-sm text-muted-foreground">
                      {date.toLocaleDateString("en-IN")}{" "}
                      {date.toLocaleTimeString("en-IN", {
                        hour: "2-digit",
                        minute: "2-digit",
                      })}
                    </span>
                  </div>
                  {rating.review && (
                    <p className="text-sm text-muted-foreground mt-2">
                      {rating.review}
                    </p>
                  )}
                </div>
              );
            })}
          </div>
        )}
      </CardContent>
    </Card>
  );
}
