import { useMutation } from "@tanstack/react-query";
import { SingleFormField } from "../types";
import axios from "axios";

export default function usePostCollectionIndividualIntakeQuestions() {
  const mutation = useMutation({
    mutationFn: async (variables: {
      collectionUrl: string;
      collectionIndividualIntakeQuestions: SingleFormField[];
    }) => {
      try {
        const response = await axios.post(
          "/api/collection/" +
            variables?.collectionUrl +
            "/individualIntakeQuestion/create",
          {
            individualIntakeQuestions:
              variables?.collectionIndividualIntakeQuestions,
            urlPath: variables?.collectionUrl,
          }
        );
        if (response.status === 200) {
          return response?.data;
        } else {
          throw new Error(
            "Invalid status code when creating collection individual intake questions."
          );
        }
      } catch (error: any) {
        throw new Error(
          "got here a1 Error creating collection individual intake question: " +
            error.message
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
