import { useMutation, useQueryClient } from "@tanstack/react-query";
import {
  CollectionMetadata,
  Collection as CollectionData,
  SingleFormField,
} from "../types";
import axios from "axios";

export default function useUpdateCollectionVideoIntakeQuestions() {
  const queryClient = useQueryClient();
  const mutation = useMutation({
    mutationFn: async (variables: {
      collectionUrl: string;
      collectionVideoIntakeQuestions: SingleFormField[];
    }) => {
      try {
        const response = await axios.patch(
          "/api/collection/" +
            variables?.collectionUrl +
            "/videoIntakeQuestions/update",
          {
            videoIntakeQuestions: variables?.collectionVideoIntakeQuestions,
            urlPath: variables?.collectionUrl,
          }
        );
        if (response.status === 200) {
          return response?.data;
        } else {
          throw new Error(
            "Invalid status code when updating collection metadata"
          );
        }
      } catch (error: any) {
        throw new Error(
          "Error updating collection video intake questions. It's possible that the request and the existing data are identical."
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
