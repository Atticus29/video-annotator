import { useMutation } from "@tanstack/react-query";
import axios from "axios";

export default function usePostVideo() {
  const mutation = useMutation({
    mutationFn: async (variables: {
      collectionUrl: string;
      videoData: any;
    }) => {
      try {
        const response = await axios.post(
          `/api/collection/${variables.collectionUrl}/videos/create`,
          {
            collectionUrl: variables.collectionUrl,
            videoData: variables.videoData,
          }
        );
        if (response.status === 200) {
          return response.data;
        } else {
          throw new Error("Invalid status code when creating video data");
        }
      } catch (error: any) {
        throw new Error("Error creating video data: " + error.message);
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
