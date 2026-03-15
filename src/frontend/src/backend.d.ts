import type { Principal } from "@icp-sdk/core/principal";
export interface Some<T> {
    __kind__: "Some";
    value: T;
}
export interface None {
    __kind__: "None";
}
export type Option<T> = Some<T> | None;
export interface StudentProfile {
    id: bigint;
    status: StudentStatus;
    payments: Array<PaymentEntry>;
    motherPhoneNumber: string;
    name: string;
    ratings: Array<ParentRating>;
    surname: string;
    isArchived: boolean;
    email?: string;
    totalFee: bigint;
    fatherPhoneNumber: string;
    studentClass: StudentClass;
    parentName: string;
}
export type Time = bigint;
export interface PaymentEntry {
    date: Time;
    paymentMode: PaymentMode;
    receiptNo: bigint;
    amount: bigint;
}
export interface ParentRating {
    review: string;
    date: Time;
    rating: bigint;
}
export interface UserProfile {
    name: string;
    role: string;
}
export enum PaymentMode {
    bhim = "bhim",
    cash = "cash",
    googlePay = "googlePay",
    phonePe = "phonePe"
}
export enum StudentClass {
    grade1 = "grade1",
    grade2 = "grade2",
    grade3 = "grade3",
    grade4 = "grade4",
    grade5 = "grade5",
    grade6 = "grade6",
    grade7 = "grade7",
    juniorKindergarten = "juniorKindergarten",
    nursery = "nursery",
    seniorKindergarten = "seniorKindergarten"
}
export enum StudentStatus {
    complete = "complete",
    incompleteProfile = "incompleteProfile"
}
export enum UserRole {
    admin = "admin",
    user = "user",
    guest = "guest"
}
export interface backendInterface {
    addParentRating(studentId: bigint, rating: bigint, review: string): Promise<void>;
    addPayment(studentId: bigint, payment: PaymentEntry): Promise<bigint>;
    addPendingStudent(profile: StudentProfile): Promise<void>;
    addStudent(profile: StudentProfile): Promise<void>;
    archiveStudent(studentId: bigint): Promise<void>;
    assignCallerUserRole(user: Principal, role: UserRole): Promise<void>;
    getAllPendingStudents(): Promise<Array<StudentProfile>>;
    getAllStudents(): Promise<Array<StudentProfile>>;
    getCallerUserProfile(): Promise<UserProfile | null>;
    getCallerUserRole(): Promise<UserRole>;
    getStudent(studentId: bigint): Promise<StudentProfile>;
    getStudentRatings(studentId: bigint): Promise<Array<ParentRating>>;
    getUserProfile(user: Principal): Promise<UserProfile | null>;
    isCallerAdmin(): Promise<boolean>;
    makeStudentDataPersistent(profileId: bigint): Promise<void>;
    saveCallerUserProfile(profile: UserProfile): Promise<void>;
    updatePendingStudent(profile: StudentProfile): Promise<void>;
}
