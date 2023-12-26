import axios from "axios";
import { useState } from "react";
import { useIntl, IntlShape } from "react-intl";
import { QueryFunctionContext, useQuery } from "react-query";

export default function useGetIndividuals(collectionUrl: string) {
  const [errorMsg, setErrorMsg] = useState<string>("");
  const { isLoading, isError, data } = useQuery(
    ["individualsFor", collectionUrl],
    async (context: QueryFunctionContext<[string, string]>) => {
      const [, collectionUrl] = context.queryKey;
      try {
        const response = await axios.get(
          "/api/collection/" + collectionUrl + "/individuals"
        );

        const returnVal: [] = response?.data?.individuals || [];
        return returnVal;
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
