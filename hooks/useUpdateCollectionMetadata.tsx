import { useMutation, useQueryClient } from "@tanstack/react-query";
import { CollectionMetadata, Collection as CollectionData } from "../types";
import axios from "axios";

export default function useUpdateCollectionMetadata() {
  const queryClient = useQueryClient();
  const mutation = useMutation({
    mutationFn: async (variables: {
      collectionUrl: string;
      updatedCollectionMetadata: CollectionMetadata;
    }) => {
      try {
        const response = await axios.patch(
          "/api/collection/" + variables?.collectionUrl + "/metadata/update",
          {
            metadata: variables?.updatedCollectionMetadata,
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
        throw new Error("Error updating collection metadata: " + error.message);
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
