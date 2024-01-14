import {
  QueryClient,
  useMutation,
  useQueryClient,
} from "@tanstack/react-query";
import axios from "axios";
import { SingleFormField } from "../types";

export default function useMutateIndividualIntakeQuestions() {
  const queryClient: QueryClient = useQueryClient();
  const mutation = useMutation({
    mutationFn: async (variables: {
      collectionUrl: string;
      updatedIndividualIntakeQuestions: SingleFormField[];
    }) => {
      try {
        const response = await axios.patch(
          "/api/collection/" +
            variables?.collectionUrl +
            "individualIntakeQuestions/update/" +
            {
              individualIntakeQuestions:
                variables?.updatedIndividualIntakeQuestions,
              urlPath: variables?.collectionUrl,
            }
        );
        if (response.status === 200) {
          return response?.data;
        } else {
          throw new Error(
            "Invalid status code when updating individual intake questions"
          );
        }
      } catch (error: any) {
        throw new Error(
          "Error updating individual intake questions: " + error.message
        );
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
