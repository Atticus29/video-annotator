import axios from "axios";
import { useIntl, IntlShape } from "react-intl";
import { QueryFunctionContext, useQuery } from "react-query";

export default function useGetCollection(collectionUrl: string) {
  const { isLoading, isError, data, error } = useQuery(
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
        // setLocalError(e?.message); // TODO decide
      }
    },
    {
      staleTime: 0,
    }
  );

  return { isLoading, isError, data, error };
}
