import { useMutation, useQueryClient } from "@tanstack/react-query";
import {
  CollectionMetadata,
  Collection as CollectionData,
  SingleFormField,
} from "../types";
import axios from "axios";

export default function usePostCollectionVideoIntakeQuestions() {
  const queryClient = useQueryClient();
  const mutation = useMutation({
    mutationFn: async (variables: {
      collectionUrl: string;
      collectionVideoIntakeQuestions: SingleFormField[];
    }) => {
      try {
        const response = await axios.post(
          "/api/collection/" +
            variables?.collectionUrl +
            "/videoIntakeQuestions/create", // @TODO still have to make this endpoint
          {
            videoIntakeQuestions: variables?.collectionVideoIntakeQuestions,
            urlPath: variables?.collectionUrl,
          }
        );
        if (response.status === 200) {
          return response?.data;
        } else {
          console.log("deleteMe failing response is: ");
          console.log(response);
          throw new Error(
            "Invalid status code when updating collection video intake questions"
          );
        }
      } catch (error: any) {
        throw new Error(
          "Error updating collection video intake questions: " + error.message
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
