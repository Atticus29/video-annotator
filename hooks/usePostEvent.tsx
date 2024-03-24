import { useMutation } from "@tanstack/react-query";
import axios from "axios";
import { v4 as uuidv4 } from "uuid";
import { EventMetadata } from "../types";

export default function usePostEvent() {
  const mutation = useMutation({
    mutationFn: async (variables: {
      collectionUrl: string;
      videoId: string;
      eventData: any;
      eventMetadata: EventMetadata;
    }) => {
      try {
        const response = await axios.post(
          `/api/collection/${variables.collectionUrl}/video/${variables.videoId}/events/create`,
          {
            collectionUrl: variables.collectionUrl,
            videoId: variables.videoId,
            eventData: {
              ...variables.eventData,
              id: uuidv4(),
              ...variables.eventMetadata,
            },
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
