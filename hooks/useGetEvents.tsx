import { useQuery } from "@tanstack/react-query";
import axios from "axios";

export default function useGetEvents(collectionUrl: string, videoId: string) {
  const { isLoading, isError, data, error } = useQuery({
    queryKey: ["eventsFor", collectionUrl, videoId],
    queryFn: async () => {
      try {
        const response = await axios.get(
          "/api/collection/" + collectionUrl + "/video/" + videoId + "/events"
        );
        return response?.data?.events;
      } catch (error: any) {
        console.log("Error in getting events from a video in the collection");
        console.log(error);
        throw new Error(error);
      }
    },
  });

  return { isLoading, isError, data, error };
}
