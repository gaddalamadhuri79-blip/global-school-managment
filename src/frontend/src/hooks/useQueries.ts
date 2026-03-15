import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import type {
  ParentRating,
  PaymentEntry,
  StudentProfile,
  UserProfile,
} from "../backend";
import { useActor } from "./useActor";

export function useGetCallerUserProfile() {
  const { actor, isFetching: actorFetching } = useActor();

  const query = useQuery<UserProfile | null>({
    queryKey: ["currentUserProfile"],
    queryFn: async () => {
      if (!actor) throw new Error("Actor not available");
      return actor.getCallerUserProfile();
    },
    enabled: !!actor && !actorFetching,
    retry: false,
  });

  return {
    ...query,
    isLoading: actorFetching || query.isLoading,
    isFetched: !!actor && query.isFetched,
  };
}

export function useSaveCallerUserProfile() {
  const { actor } = useActor();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (profile: UserProfile) => {
      if (!actor) throw new Error("Actor not available");
      return actor.saveCallerUserProfile(profile);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["currentUserProfile"] });
    },
  });
}

export function useGetAllStudents() {
  const { actor, isFetching } = useActor();

  return useQuery<StudentProfile[]>({
    queryKey: ["students"],
    queryFn: async () => {
      if (!actor) return [];
      return actor.getAllStudents();
    },
    enabled: !!actor && !isFetching,
  });
}

export function useGetStudent(studentId: bigint) {
  const { actor, isFetching } = useActor();

  return useQuery<StudentProfile>({
    queryKey: ["student", studentId.toString()],
    queryFn: async () => {
      if (!actor) throw new Error("Actor not available");
      return actor.getStudent(studentId);
    },
    enabled: !!actor && !isFetching,
  });
}

export function useAddStudent() {
  const { actor } = useActor();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (profile: StudentProfile) => {
      if (!actor) throw new Error("Actor not available");
      return actor.addStudent(profile);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["students"] });
    },
  });
}

export function useUpdateStudent() {
  const { actor } = useActor();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (profile: StudentProfile) => {
      if (!actor) throw new Error("Actor not available");
      return actor.addStudent(profile);
    },
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({ queryKey: ["students"] });
      queryClient.invalidateQueries({
        queryKey: ["student", variables.id.toString()],
      });
    },
  });
}

export function useAddPayment() {
  const { actor } = useActor();
  const queryClient = useQueryClient();

  return useMutation<
    bigint,
    Error,
    { studentId: bigint; payment: PaymentEntry }
  >({
    mutationFn: async ({ studentId, payment }) => {
      if (!actor) throw new Error("Actor not available");
      return actor.addPayment(studentId, payment);
    },
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({ queryKey: ["students"] });
      queryClient.invalidateQueries({
        queryKey: ["student", variables.studentId.toString()],
      });
    },
  });
}

export function useAddParentRating() {
  const { actor } = useActor();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({
      studentId,
      rating,
      review,
    }: {
      studentId: bigint;
      rating: bigint;
      review: string;
    }) => {
      if (!actor) throw new Error("Actor not available");
      return actor.addParentRating(studentId, rating, review);
    },
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({
        queryKey: ["student", variables.studentId.toString()],
      });
      queryClient.invalidateQueries({
        queryKey: ["studentRatings", variables.studentId.toString()],
      });
    },
  });
}

export function useGetStudentRatings(studentId: bigint) {
  const { actor, isFetching } = useActor();

  return useQuery<ParentRating[]>({
    queryKey: ["studentRatings", studentId.toString()],
    queryFn: async () => {
      if (!actor) throw new Error("Actor not available");
      return actor.getStudentRatings(studentId);
    },
    enabled: !!actor && !isFetching,
  });
}

export function useArchiveStudent() {
  const { actor } = useActor();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (studentId: bigint) => {
      if (!actor) throw new Error("Actor not available");
      return actor.archiveStudent(studentId);
    },
    onSuccess: (_, studentId) => {
      queryClient.invalidateQueries({ queryKey: ["students"] });
      queryClient.invalidateQueries({
        queryKey: ["student", studentId.toString()],
      });
    },
  });
}
