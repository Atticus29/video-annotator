import { useMutation, useQueryClient } from "@tanstack/react-query";
import {
  CollectionMetadata,
  Collection as CollectionData,
  SingleFormField,
} from "../types";
import axios from "axios";

export default function usePostCollectionVideoIntakeQuestions() {
  const mutation = useMutation({
    mutationFn: async (variables: {
      collectionUrl: string;
      collectionVideoIntakeQuestions: SingleFormField[];
    }) => {
      try {
        const response = await axios.post(
          "/api/collection/" +
            variables?.collectionUrl +
            "/videoIntakeQuestions/create",
          {
            videoIntakeQuestions: variables?.collectionVideoIntakeQuestions,
            urlPath: variables?.collectionUrl,
          }
        );
        if (response.status === 200) {
          return response?.data;
        } else {
          throw new Error(
            "Invalid status code when creating collection video intake questions"
          );
        }
      } catch (error: any) {
        throw new Error(
          "Error creating collection video intake questions: " + error.message
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
