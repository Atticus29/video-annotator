import { useMutation, useQueryClient } from "@tanstack/react-query";
import { SingleFormField } from "../types";
import axios from "axios";

export default function usePostCollectionEventIntakeQuestions() {
  const queryClient = useQueryClient();
  const mutation = useMutation({
    mutationFn: async (variables: {
      collectionUrl: string;
      collectionEventIntakeQuestions: SingleFormField[];
    }) => {
      try {
        const response = await axios.post(
          "/api/collection" +
            variables?.collectionUrl +
            "/eventIntakeQuestions/create",
          {
            eventIntakeQuestions: variables?.collectionEventIntakeQuestions,
            urlPath: variables?.collectionUrl,
          }
        );
        if (response.status === 200) {
          return response?.data;
        } else {
          throw new Error(
            "Invalid status code when creating collection event intake questions"
          );
        }
      } catch (error: any) {
        throw new Error(
          "Error creating collection event intake questions: " + error.message
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
