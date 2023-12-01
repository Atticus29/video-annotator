import axios from "axios";
import { QueryFunctionContext, useQuery } from "react-query";

export default function useGetVideo(collectionUrl: string, videoId: string) {
  const { isLoading, isError, data, error } = useQuery(
    ["singleVideo", collectionUrl, videoId],
    async () => {
      try {
        const response = await axios.get("/api/collection/video/", {
          params: { urlPath: collectionUrl, videoId: videoId },
        });
        return response?.data;
      } catch (e: any) {
        console.log("Error in getting a single video from a collection");
        console.log(e);
        throw new Error(e);
      }
    }
  );

  return { isLoading, isError, data, error };
}
