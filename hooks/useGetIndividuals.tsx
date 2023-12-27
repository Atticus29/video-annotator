import axios from "axios";
import { useState } from "react";
import { useIntl, IntlShape } from "react-intl";
import { QueryFunctionContext, useQuery } from "react-query";

export default function useGetIndividuals(collectionUrl: string) {
  console.log("deleteMe got here a1");
  console.log("deleteMe collectionUrl is: ");
  console.log(collectionUrl);
  const [errorMsg, setErrorMsg] = useState<string>("");
  const queryKey: [string, string] = ["individualsFor", collectionUrl];
  const { isLoading, isError, data } = useQuery(
    queryKey,
    async (context: QueryFunctionContext<[string, string]>) => {
      console.log("deleteMe got here a2");
      const [, collectionUrl] = context.queryKey;
      try {
        const response = await axios.get(
          "/api/collection/" + collectionUrl + "/individuals"
        );

        const returnVal: [] = response?.data?.individuals || [];
        console.log("deleteMe got here a3");
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
