import {
  Backdrop,
  CircularProgress,
  Dialog,
  DialogContent,
} from "@mui/material";
import { useState } from "react";
import { useQueryClient } from "react-query";
import IndividualIntake from "../components/IndividualIntake";
import useGetCollection from "../hooks/useGetCollection";

const Sandbox: React.FC = () => {
  const localUrlPathAsString: string = "ExampleCollection"; // @TODO undo hardcode
  const { data, isLoading, isError } = useGetCollection(localUrlPathAsString);
  console.log("deleteMe isLoading is: ");
  console.log(isLoading);

  const queryClient = useQueryClient();
  const [createIndividualDialogOpen, setCreateIndividualDialogOpen] =
    useState<boolean>(true);
  const handleCreateIndividualDialogClose = () => {
    setCreateIndividualDialogOpen(false);
    const queryKey = ["singleCollection", localUrlPathAsString];
    const queryCache = queryClient.getQueryCache();
    let queryState = queryCache.find(queryKey);
    if (queryState) {
      console.log(`Before Query with key ${queryKey} is in the cache.`);
    } else {
      console.log(`Before Query with key ${queryKey} is NOT in the cache.`);
    }
    queryClient.invalidateQueries();
    // queryClient.invalidateQueries({
    //   queryKey: queryKey,
    // });
    queryState = queryCache.find(queryKey);
    if (queryState) {
      console.log(`After Query with key ${queryKey} is in the cache.`);
    } else {
      console.log(`After Query with key ${queryKey} is NOT in the cache.`);
    }
  };

  return (
    <>
      <Backdrop
        sx={{ color: "#fff", zIndex: (theme) => theme.zIndex.drawer + 1 }}
        open={isLoading}
      >
        <CircularProgress color="inherit" />
      </Backdrop>
      {!isLoading && (
        <Dialog
          open={createIndividualDialogOpen}
          onClose={handleCreateIndividualDialogClose}
        >
          <DialogContent>
            <IndividualIntake
              collection={data}
              onCloseDialog={handleCreateIndividualDialogClose}
            ></IndividualIntake>
          </DialogContent>
        </Dialog>
      )}
    </>
  );
};

export default Sandbox;
