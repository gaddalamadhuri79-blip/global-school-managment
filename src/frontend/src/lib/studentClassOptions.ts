import { StudentClass } from "../backend";

export const studentClassOptions: { value: StudentClass; label: string }[] = [
  { value: StudentClass.nursery, label: "Nursery" },
  {
    value: StudentClass.juniorKindergarten,
    label: "LKG (Junior Kindergarten)",
  },
  {
    value: StudentClass.seniorKindergarten,
    label: "UKG (Senior Kindergarten)",
  },
  { value: StudentClass.grade1, label: "Grade 1" },
  { value: StudentClass.grade2, label: "Grade 2" },
  { value: StudentClass.grade3, label: "Grade 3" },
  { value: StudentClass.grade4, label: "Grade 4" },
  { value: StudentClass.grade5, label: "Grade 5" },
  { value: StudentClass.grade6, label: "Grade 6" },
  { value: StudentClass.grade7, label: "Grade 7" },
];

export function getClassLabel(studentClass: StudentClass): string {
  const option = studentClassOptions.find((opt) => opt.value === studentClass);
  return option?.label || String(studentClass);
}
