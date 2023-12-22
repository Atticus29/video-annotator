import axios from "axios";
import { useState } from "react";
import { useIntl, IntlShape } from "react-intl";
import { QueryFunctionContext, useQuery } from "react-query";

export default function useGetCollection(collectionUrl: string) {
  const [errorMsg, setErrorMsg] = useState<string>("");
  const { isLoading, isError, data } = useQuery(
    ["singleCollection", collectionUrl],
    async (context: QueryFunctionContext<[string, string]>) => {
      const [, localUrlPathAsString] = context.queryKey;
      try {
        const response = await axios.get("/api/collection/", {
          params: { urlPath: localUrlPathAsString },
        });
        return response?.data;
      } catch (e: any) {
        console.log("Error in getting a single collection is: ");
        console.log(e);
        setErrorMsg(e.message);
      }
    },
    {
      staleTime: 0,
    }
  );

  return { isLoading, isError, data, errorMsg };
}
