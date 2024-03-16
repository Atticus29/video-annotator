import { useMutation } from "@tanstack/react-query";
import axios from "axios";
import { UserRole } from "../types";

export default function useUpdateUserRoles() {
  const mutation = useMutation({
    mutationFn: async (variables: { uid: string; roles: UserRole[] }) => {
      try {
        const response = await axios.patch(
          "/api/users/" + variables?.uid + "/update",
          { uid: variables?.uid, roles: variables?.roles }
        );
        if (response.status === 200) {
          return response;
        } else {
          throw new Error("Invalid status code when updating user roles");
        }
      } catch (error: any) {
        throw new Error("Error updating user roles: " + error.message);
      }
    },
  });

  return {
    mutate: mutation.mutate,
    isPending: mutation.isPending,
    error: mutation.error,
    isError: mutation.isError,
  };
}
