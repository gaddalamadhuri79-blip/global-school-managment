import { Badge } from "@/components/ui/badge";
import { AlertCircle, CheckCircle2 } from "lucide-react";
import { StudentStatus } from "../../backend";

interface StudentStatusBadgeProps {
  status: StudentStatus;
}

export default function StudentStatusBadge({
  status,
}: StudentStatusBadgeProps) {
  if (status === StudentStatus.complete) {
    return (
      <Badge
        variant="outline"
        className="gap-1 text-emerald-600 border-emerald-600"
      >
        <CheckCircle2 className="h-3 w-3" />
        Complete
      </Badge>
    );
  }

  return (
    <Badge variant="outline" className="gap-1 text-amber-600 border-amber-600">
      <AlertCircle className="h-3 w-3" />
      Incomplete Profile
    </Badge>
  );
}
