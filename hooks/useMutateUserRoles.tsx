import { useMutation, useQueryClient } from "@tanstack/react-query";
import axios from "axios";
import { UserRoles, UserWithRoles } from "../types";

export default function useMutateUserRoles() {
  const queryClient = useQueryClient();
  const mutation = useMutation({
    mutationFn: async (variables: {
      // urlPath: string,
      uid: string;
      roles: UserRoles;
    }) => {
      try {
        // const user: UserWithRoles = {
        //   uid: variables?.uid,
        //   roles: variables?.userRoles,
        // };
        const response = await axios.patch(
          "/api/users/" + variables?.uid + "/update",
          { uid: variables?.uid, roles: variables?.roles }
        );
        if (response.status === 200) {
          return response;
        } else {
          throw new Error("Invalid status code when update user roles");
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
