import axios from "axios";
import { useState } from "react";
import { QueryFunctionContext, useQuery } from "@tanstack/react-query";

export default function useGetIndividuals(collectionUrl: string) {
  const [errorMsg, setErrorMsg] = useState<string>("");
  const queryKey: [string, string] = ["individualsFor", collectionUrl];
  const { isLoading, isError, data } = useQuery({
    queryKey: queryKey,
    queryFn: async (context: QueryFunctionContext<[string, string]>) => {
      const [, collectionUrl] = context.queryKey;
      try {
        const response = await axios.get(
          "/api/collection/" + collectionUrl + "/individuals"
        );

        const individuals: [] = response?.data?.individuals || [];
        const noIndividuals: string = response?.data?.message;
        if (noIndividuals) setErrorMsg(noIndividuals);
        return individuals;
      } catch (e: any) {
        console.log("Error in getting a single collection is: ");
        console.log(e);
        setErrorMsg(e.message);
      }
    },
    staleTime: Infinity,
    enabled: true,
  });

  return { isLoading, isError, data, errorMsg };
}
