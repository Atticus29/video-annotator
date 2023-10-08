import { Button, IconButton, Snackbar } from "@mui/material";
import { useEffect, useState } from "react";
import { FormattedMessage, IntlShape, useIntl } from "react-intl";
import { useQueryClient } from "react-query";

import {
  QueryFunctionContext,
  useMutation,
  UseMutationResult,
  useQuery,
} from "react-query";
import { map, filter, reduce, get } from "lodash-es";
import axios from "axios";

import { FormFieldGroup, SingleFormField, Collection } from "../../types";
import CustomError from "../Error";
import CloseIcon from "@mui/icons-material/Close";
import { calculateAllRequiredsHaveValues } from "../../utilities/composedFormSubmissionButtonUtils";

const ComposedFormSubmissionButton: React.FC<{
  questionsOfConcern: SingleFormField[];
  formFieldGroupOfConcern: FormFieldGroup | undefined;
  collection?: Collection;
  collectionPath?: string;
  collectionPropToUpdate?: string;
  onCloseDialog?: () => void;
}> = ({
  questionsOfConcern,
  formFieldGroupOfConcern,
  collection,
  collectionPath,
  collectionPropToUpdate,
  onCloseDialog,
}) => {
  const queryClient = useQueryClient();
  const { isLoading, isError, data } = useQuery(
    ["singleCollection", collectionPath],
    async (context: QueryFunctionContext<[string, any], any>) => {
      const [, collectionPath] = context.queryKey;
      try {
        const response = await axios.get("/api/collection/", {
          params: { urlPath: collectionPath },
        });
        return response?.data;
      } catch (e: any) {
        console.log("Error in getting a single collection is: ");
        console.log(e);
      }
    }
  );

  const intl: IntlShape = useIntl();
  const [allRequiredValid, setAllRequiredValid] = useState<boolean>(true);

  const [open, setOpen] = useState<boolean>(false);
  const [snackbarMessage, setSnackbarMessage] = useState<string>("");
  const [saveSucess, setSaveSuccess] = useState<boolean>(false);
  const [saveFail, setSaveFail] = useState<boolean>(false);
  const [localCollection, setLocalCollection] = useState<any>();
  useEffect(() => {
    setLocalCollection(collection ? collection : data);
  }, [collection, data]);
  const collectionUpdateFailMsg: string = intl.formatMessage({
    id: "COLLECTION_WAS_NOT_UPDATED",
    defaultMessage: "Collection was not updated: ",
  });
  const collectionUpdatedMsg: string = intl.formatMessage({
    id: "COLLECTION_UPDATED_SUCCESSFULLY",
    defaultMessage: "Collection was updated successfully.",
  });

  const handleSnackbarClose = (
    event: React.SyntheticEvent | Event | null,
    reason?: string
  ) => {
    if (reason === "clickaway") {
      // in case you want this behavior to be different eventually
      setSaveSuccess(false);
      setSaveFail(false);
      setSnackbarMessage("");
      return;
    }

    // the "finally" of it all
    setSaveSuccess(false);
    setSaveFail(false);
    setSnackbarMessage("");
  };

  const handleClose = () => {
    setOpen(false);
    console.log("deleteMe got here a1 and collectionPath is: ");
    console.log(collectionPath);
    console.log("deleteMe queryClient is: ");
    console.log(queryClient);
    // queryClient.invalidateQueries(["singleCollection", collectionPath]);
    // queryClient.invalidateQueries();
    console.log("deleteMe got here a2");
    if (onCloseDialog) onCloseDialog();
  };

  const updateCollectionMutation: UseMutationResult<any> = useMutation({
    // @TODO move this into a custom hook?
    mutationFn: async (updatedCollection) => {
      const response = await axios.patch(
        "/api/collection/update/" + get(updatedCollection, ["urlPath"]),
        {
          data: updatedCollection,
        }
      );
      return response?.data;
    },
    onSuccess: (data) => {
      // console.log("deleteMe got here and update was successful and data is: ");
      // console.log(data);
      setSnackbarMessage(data?.message);
      setSaveSuccess(true);
      setSaveFail(false);
      // @TODO invalidate collection
      handleClose();
      // router.push("/collection/" + data?.data?.urlPath);
    },
    onError: (error) => {
      setSnackbarMessage(
        get(
          error,
          ["response", "data", "message"],
          "Collection not updated due to unknown error."
        )
      );
      setSaveSuccess(false);
      setSaveFail(true);
      handleClose();
    },
  });

  useEffect(() => {
    if (formFieldGroupOfConcern) {
      const totalInvalidCount: number = reduce(
        Object.values(formFieldGroupOfConcern?.isInvalids || []),
        (memo: any, entry: any) => {
          return Number(entry) + Number(memo);
        },
        0
      );
      setAllRequiredValid(
        totalInvalidCount < 1 &&
          calculateAllRequiredsHaveValues(
            questionsOfConcern,
            formFieldGroupOfConcern
          )
      );
    }
  }, [questionsOfConcern, formFieldGroupOfConcern, allRequiredValid]);

  const handleFormSubmission: () => void = () => {
    // console.log("deleteMe handleFormSubmission entered");
    // console.log("deleteMe formFieldGroupOfConcern?.actualValues is: ");
    // console.log(formFieldGroupOfConcern?.actualValues);
    // console.log("deleteMe entire formFieldGroupOfConcern is: ");
    // console.log(formFieldGroupOfConcern);
    // console.log("deleteMe and collection is: ");
    // console.log(collection);
    if (localCollection && collectionPropToUpdate === "videos") {
      // console.log("deleteMe got here a1");
      const currentVideos: {}[] = get(localCollection, ["videos"], []);
      // console.log("deleteMe currentVideos are: ");
      // console.log(currentVideos);
      const updatedVideos: {}[] = [
        ...currentVideos,
        formFieldGroupOfConcern?.actualValues,
      ];
      const { _id, ...rest } = localCollection;
      const updatedCollection = {
        ...rest,
        videos: updatedVideos,
      };
      // console.log("deleteMe updatedCollection is: ");
      // console.log(updatedCollection);
      updateCollectionMutation.mutate(updatedCollection); // @TODO there should be a simpler video update mutation that should happen here to avoid race conditions?
      // @TODO invalidate collection
      // queryClient.invalidateQueries({
      //   queryKey: ["singleCollection", collectionPath],
      // });
    }
    // @TODO send this to the database. Use the `collection` variable... actually, depending on which intake this is, the db save MIGHT behave differently. I.e., is this a video save? An individual?
  };

  const error: string = "";

  return (
    <>
      <Button
        style={{ marginBottom: 10 }}
        data-testid={"submit-button"}
        variant="contained"
        disabled={!allRequiredValid}
        onClick={handleFormSubmission}
      >
        <FormattedMessage id="SUBMIT" defaultMessage="Submit" />
      </Button>
      {error && <CustomError errorMsg={error} />}
      <Snackbar
        open={saveSucess}
        onClose={handleSnackbarClose}
        autoHideDuration={6000}
        message={collectionUpdatedMsg}
        action={
          <IconButton
            size="small"
            aria-label="close"
            color="inherit"
            onClick={() => handleSnackbarClose(null, "clickaway")}
          >
            <CloseIcon fontSize="small" />
          </IconButton>
        }
      />
      <Snackbar
        open={saveFail}
        onClose={handleSnackbarClose}
        autoHideDuration={6000}
        message={collectionUpdateFailMsg + snackbarMessage}
        action={
          <IconButton
            size="small"
            aria-label="close"
            color="inherit"
            onClick={() => handleSnackbarClose(null, "clickaway")}
          >
            <CloseIcon fontSize="small" />
          </IconButton>
        }
      />
    </>
  );
};

export default ComposedFormSubmissionButton;
