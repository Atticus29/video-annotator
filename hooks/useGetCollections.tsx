import axios from "axios";
import { useState } from "react";
import { useIntl, IntlShape } from "react-intl";
import { QueryFunctionContext, useQuery } from "@tanstack/react-query";

export default function useGetCollections(userEmail: string) {
  const [errorMsg, setErrorMsg] = useState<string>("");
  const { isLoading, isError, data } = useQuery({
    queryKey: ["allCollections", userEmail],
    queryFn: async () => {
      try {
        const response = await axios.get("/api/collections/", {
          params: { email: userEmail },
        });
        return response?.data;
      } catch (e: any) {
        console.log("Error in getting a single collection is: ");
        console.log(e);
        setErrorMsg(e.message);
      }
    },
  });

  return { isLoading, isError, data, errorMsg };
}
