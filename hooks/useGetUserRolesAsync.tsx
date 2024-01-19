import { useQuery, useQueryClient } from "@tanstack/react-query";
import axios from "axios";
import { useEffect, useState } from "react";
import useGetUserRoles from "./useGetUserRoles";

export default function useGetUserRolesAsync(uid: string) {
  const [isLoading, setIsLoading] = useState(true);
  const [isError, setIsError] = useState(false);
  const [data, setData] = useState<any>(null);
  const [error, setError] = useState<any>(null);

  useEffect(() => {
    const useFetchData = async () => {
      try {
        // Set loading state to true while fetching data
        setIsLoading(true);

        console.log("deleteMe got here d1 and uid is: ");
        console.log(uid);

        // Fetch user roles based on uid

        // eslint-disable-next-line react-hooks/rules-of-hooks
        const result = useGetUserRoles(uid);

        // Set data and loading state based on the result
        setData(result);
        setIsError(false);
      } catch (error) {
        // Handle error and set isError to true
        setIsError(true);
        setError(error);
      } finally {
        // Set loading state to false after fetching is complete
        setIsLoading(false);
      }
    };

    // Call the fetchData function when uid changes
    useFetchData();
  }, [uid]); // useEffect dependency on uid

  // Return the state values
  return { isLoading, isError, data, error };
}
