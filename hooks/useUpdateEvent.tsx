import { useMutation } from "@tanstack/react-query";
import axios from "axios";
import { EventMetadata } from "../types";

export default function useUpdateEvent() {
  const mutation = useMutation({
    mutationFn: async (variables: {
      collectionUrl: string;
      videoId: string;
      eventId: string;
      updatedEventData: any;
      updatedEventMetadata: any; // the any allows this to be a subset of the EventMetadata interface
    }) => {
      try {
        const response = await axios.patch(
          `/api/collection/${variables.collectionUrl}/video/${variables.videoId}/events/${variables.eventId}/update`,
          {
            collectionUrl: variables.collectionUrl,
            videoId: variables.videoId,
            eventId: variables.eventId,
            updatedEventData: {
              ...variables.updatedEventData,
              ...variables.updatedEventMetadata,
            },
          }
        );
        if (response.status === 200) {
          return response.data;
        } else {
          throw new Error("Invalid status code when updating individual data");
        }
      } catch (error: any) {
        throw new Error("Error updating individual data: " + error.message);
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
