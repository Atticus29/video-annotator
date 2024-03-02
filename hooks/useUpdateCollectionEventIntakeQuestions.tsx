import { useMutation } from "@tanstack/react-query";
import { SingleFormField } from "../types";
import axios from "axios";

export default function useUpdateCollectionEventIntakeQuestions() {
  const mutation = useMutation({
    mutationFn: async (variables: {
      collectionUrl: string;
      collectionEventIntakeQuestions: SingleFormField[];
    }) => {
      try {
        const response = await axios.patch(
          "/api/collection/" +
            variables?.collectionUrl +
            "/eventIntakeQuestions/update",
          {
            eventIntakeQuestions: variables?.collectionEventIntakeQuestions,
            urlPath: variables?.collectionUrl,
          }
        );
        if (response.status === 200) {
          return response?.data;
        }
      } catch (error: any) {
        throw new Error(
          "Error updating collection event intake questions: " + error.message
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
