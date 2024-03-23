import { useMutation } from "@tanstack/react-query";
import axios from "axios";
import { v4 as uuidv4 } from "uuid";

export default function usePostIndividual() {
  const mutation = useMutation({
    mutationFn: async (variables: {
      collectionUrl: string;
      individualData: any;
    }) => {
      try {
        const response = await axios.post(
          `/api/collection/${variables.collectionUrl}/individuals/create`,
          {
            collectionUrl: variables.collectionUrl,
            individualData: { ...variables.individualData, id: uuidv4() },
          }
        );
        if (response.status === 200) {
          return response.data;
        } else {
          throw new Error("Invalid status code when creating individual data");
        }
      } catch (error: any) {
        throw new Error("Error creating individual data: " + error.message);
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
