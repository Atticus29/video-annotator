import { useQuery } from "@tanstack/react-query";
import axios from "axios";

export default function useGetUserRoles(uid: string) {
  // const { isLoading, isError, data, error } = useQuery({
  const { data } = useQuery({
    queryKey: ["userRoles", uid],
    queryFn: async () => {
      try {
        const response = await axios.get("/api/users/" + uid);
        return response?.data;
      } catch (error: any) {
        console.log(error);
        throw new Error("Error fetching user roles: " + error.message);
      }
    },
  });

  // return { isLoading, isError, data, error };
  return { data };
}
