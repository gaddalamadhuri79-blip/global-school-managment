import { Alert, AlertDescription } from "@/components/ui/alert";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { AlertCircle } from "lucide-react";
import { useEffect, useState } from "react";
import { toast } from "sonner";
import {
  StudentClass,
  type StudentProfile,
  StudentStatus,
} from "../../backend";
import { useAddStudent, useUpdateStudent } from "../../hooks/useQueries";
import { useLogoAnimation } from "../../lib/LogoAnimationContext";
import { studentClassOptions } from "../../lib/studentClassOptions";

interface StudentFormProps {
  student?: StudentProfile;
  onSuccess?: () => void;
}

export default function StudentForm({ student, onSuccess }: StudentFormProps) {
  const [name, setName] = useState("");
  const [surname, setSurname] = useState("");
  const [parentName, setParentName] = useState("");
  const [fatherPhoneNumber, setFatherPhoneNumber] = useState("");
  const [motherPhoneNumber, setMotherPhoneNumber] = useState("");
  const [email, setEmail] = useState("");
  const [studentClass, setStudentClass] = useState<StudentClass>(
    StudentClass.nursery,
  );
  const [totalFee, setTotalFee] = useState("");
  const [phoneWarningOverride, setPhoneWarningOverride] = useState(false);

  const addStudent = useAddStudent();
  const updateStudent = useUpdateStudent();
  const { triggerAnimation } = useLogoAnimation();

  useEffect(() => {
    if (student) {
      setName(student.name);
      setSurname(student.surname);
      setParentName(student.parentName);
      setFatherPhoneNumber(student.fatherPhoneNumber || "");
      setMotherPhoneNumber(student.motherPhoneNumber || "");
      setEmail(student.email || "");
      setStudentClass(student.studentClass);
      setTotalFee(student.totalFee.toString());
      setPhoneWarningOverride(true);
    }
  }, [student]);

  const determineStatus = (): StudentStatus => {
    const hasAllRequiredFields =
      name.trim() &&
      surname.trim() &&
      parentName.trim() &&
      (fatherPhoneNumber.trim() || motherPhoneNumber.trim()) &&
      totalFee.trim() &&
      !Number.isNaN(Number(totalFee)) &&
      Number(totalFee) > 0;

    return hasAllRequiredFields
      ? StudentStatus.complete
      : StudentStatus.incompleteProfile;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!name.trim() || !surname.trim() || !parentName.trim()) {
      toast.error("Please fill in all required fields");
      return;
    }

    if (
      !fatherPhoneNumber.trim() &&
      !motherPhoneNumber.trim() &&
      !phoneWarningOverride
    ) {
      toast.error(
        'Please provide at least one phone number or click "leave ph no"',
      );
      return;
    }

    if (
      !totalFee.trim() ||
      Number.isNaN(Number(totalFee)) ||
      Number(totalFee) <= 0
    ) {
      toast.error("Please enter a valid total fee amount");
      return;
    }

    const profile: StudentProfile = {
      id: student?.id || BigInt(Date.now()),
      name: name.trim(),
      surname: surname.trim(),
      parentName: parentName.trim(),
      fatherPhoneNumber: fatherPhoneNumber.trim(),
      motherPhoneNumber: motherPhoneNumber.trim(),
      email: email.trim() || undefined,
      studentClass,
      totalFee: BigInt(totalFee),
      status: determineStatus(),
      payments: student?.payments || [],
      ratings: student?.ratings || [],
      isArchived: student?.isArchived || false,
    };

    try {
      if (student) {
        await updateStudent.mutateAsync(profile);
        toast.success("Student profile updated successfully");
      } else {
        await addStudent.mutateAsync(profile);
        toast.success("Student added successfully");
        triggerAnimation();
      }
      onSuccess?.();
    } catch (error) {
      console.error("Error saving student:", error);
      toast.error("Failed to save student profile");
    }
  };

  const showPhoneWarning =
    !student &&
    !fatherPhoneNumber.trim() &&
    !motherPhoneNumber.trim() &&
    !phoneWarningOverride;

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div className="grid grid-cols-2 gap-4">
        <div className="space-y-2">
          <Label htmlFor="name">
            First Name <span className="text-destructive">*</span>
          </Label>
          <Input
            id="name"
            value={name}
            onChange={(e) => setName(e.target.value)}
            placeholder="Enter first name"
            required
          />
        </div>

        <div className="space-y-2">
          <Label htmlFor="surname">
            Surname <span className="text-destructive">*</span>
          </Label>
          <Input
            id="surname"
            value={surname}
            onChange={(e) => setSurname(e.target.value)}
            placeholder="Enter surname"
            required
          />
        </div>
      </div>

      <div className="space-y-2">
        <Label htmlFor="parentName">
          Parent Name <span className="text-destructive">*</span>
        </Label>
        <Input
          id="parentName"
          value={parentName}
          onChange={(e) => setParentName(e.target.value)}
          placeholder="Enter parent name"
          required
        />
      </div>

      <div className="grid grid-cols-2 gap-4">
        <div className="space-y-2">
          <Label htmlFor="fatherPhoneNumber">Father Phone Number</Label>
          <Input
            id="fatherPhoneNumber"
            value={fatherPhoneNumber}
            onChange={(e) => setFatherPhoneNumber(e.target.value)}
            placeholder="Enter father's phone"
            type="tel"
          />
        </div>

        <div className="space-y-2">
          <Label htmlFor="motherPhoneNumber">Mother Phone Number</Label>
          <Input
            id="motherPhoneNumber"
            value={motherPhoneNumber}
            onChange={(e) => setMotherPhoneNumber(e.target.value)}
            placeholder="Enter mother's phone"
            type="tel"
          />
        </div>
      </div>

      {showPhoneWarning && (
        <Alert variant="destructive">
          <AlertCircle className="h-4 w-4" />
          <AlertDescription className="flex items-center justify-between">
            <span>At least one phone number is required</span>
            <Button
              type="button"
              variant="outline"
              size="sm"
              onClick={() => setPhoneWarningOverride(true)}
            >
              leave ph no
            </Button>
          </AlertDescription>
        </Alert>
      )}

      <div className="space-y-2">
        <Label htmlFor="email">Email (Optional)</Label>
        <Input
          id="email"
          type="email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          placeholder="Enter email address"
        />
      </div>

      <div className="space-y-2">
        <Label htmlFor="studentClass">
          Class <span className="text-destructive">*</span>
        </Label>
        <Select
          value={studentClass}
          onValueChange={(value) => setStudentClass(value as StudentClass)}
        >
          <SelectTrigger id="studentClass">
            <SelectValue placeholder="Select class" />
          </SelectTrigger>
          <SelectContent>
            {studentClassOptions.map((option) => (
              <SelectItem key={option.value} value={option.value}>
                {option.label}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>

      <div className="space-y-2">
        <Label htmlFor="totalFee">
          Total Fee (Academic Year) <span className="text-destructive">*</span>
        </Label>
        <Input
          id="totalFee"
          type="number"
          value={totalFee}
          onChange={(e) => setTotalFee(e.target.value)}
          placeholder="Enter total fee amount"
          min="0"
          step="1"
          required
        />
      </div>

      <div className="flex justify-end gap-2 pt-4">
        <Button
          type="submit"
          disabled={addStudent.isPending || updateStudent.isPending}
          className="min-w-[120px]"
        >
          {addStudent.isPending || updateStudent.isPending
            ? "Saving..."
            : student
              ? "Update Student"
              : "Add Student"}
        </Button>
      </div>
    </form>
  );
}
