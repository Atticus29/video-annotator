import { useMutation } from "@tanstack/react-query";
import { UserRole } from "../types";
import axios from "axios";

export default function useUpdateUserRole() {
  const mutation = useMutation({
    mutationFn: async (variables: { uid: string; role: UserRole }) => {
      try {
        const response = await axios.patch(
          "/api/users/" + variables?.uid + "/roles/update",
          { uid: variables?.uid, role: variables?.role }
        );
        if (response.status === 200) {
          return response;
        } else {
          throw new Error("Invalid status code when adding new role to user.");
        }
      } catch (error: any) {
        throw new Error("Error adding role to user: " + error.message);
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
