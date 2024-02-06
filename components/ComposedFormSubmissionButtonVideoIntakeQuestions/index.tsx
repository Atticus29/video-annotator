import { Button, IconButton, Snackbar } from "@mui/material";
import { useEffect, useState } from "react";
import { FormattedMessage, IntlShape, useIntl } from "react-intl";
import { UseMutateFunction, useQueryClient } from "@tanstack/react-query";

import { useMutation, UseMutationResult } from "@tanstack/react-query";
import { v4 as uuidv4 } from "uuid";
import { reduce, get } from "lodash-es";
import axios from "axios";

import { FormFieldGroup, SingleFormField, Collection } from "../../types";
import CustomError from "../CustomError";
import CloseIcon from "@mui/icons-material/Close";
import { calculateAllRequiredIntakeQuestionsHaveValues } from "../../utilities/composedFormSubmissionButtonUtils";
import useGetCollection from "../../hooks/useGetCollection";

const ComposedFormSubmissionButtonVideoIntakeQuestions: React.FC<{
  questionsOfConcern: SingleFormField[];
  formFieldGroupOfConcern: FormFieldGroup | undefined;
  collection?: Collection;
  collectionPath?: string;
  collectionPropToUpdate?: string;
  onCloseDialog?: () => void;
  updateMethod: UseMutateFunction<
    any,
    Error,
    {
      collectionUrl: string;
      collectionVideoIntakeQuestions: SingleFormField[];
    },
    unknown
  >;
}> = ({
  questionsOfConcern,
  formFieldGroupOfConcern,
  collection,
  collectionPath,
  collectionPropToUpdate,
  onCloseDialog,
  updateMethod,
}) => {
  const queryClient = useQueryClient();
  const { isLoading, isError, data } = useGetCollection(collectionPath || "");

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
    onSuccess: async (data) => {
      setSnackbarMessage(data?.message);
      setSaveSuccess(true);
      setSaveFail(false);
      // @TODO invalidate collection
      await queryClient.invalidateQueries();
      // await queryClient.refetchQueries();
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
      // console.log("deleteMe got here b1 and formFieldGroupOfConcern is: ");
      // console.log(formFieldGroupOfConcern);
      const totalInvalidCount: number = reduce(
        Object.values(formFieldGroupOfConcern?.isInvalids || []),
        (memo: any, entry: any) => {
          return Number(entry) + Number(memo);
        },
        0
      );
      // console.log("deleteMe totalInvalidCount is: ");
      // console.log(totalInvalidCount);
      // console.log("deleteMe questionsOfConcern is: ");
      // console.log(questionsOfConcern);
      setAllRequiredValid(
        totalInvalidCount < 1 &&
          calculateAllRequiredIntakeQuestionsHaveValues(
            questionsOfConcern,
            formFieldGroupOfConcern
          )
      );
    }
  }, [questionsOfConcern, formFieldGroupOfConcern, allRequiredValid]);

  const handleFormSubmission: () => void = async () => {
    if (localCollection && collectionPropToUpdate === "videos") {
      const currentVideos: {}[] = get(localCollection, ["videos"], []);
      const updatedVideos: any = [
        ...currentVideos,
        { ...formFieldGroupOfConcern?.actualValues, id: uuidv4() },
      ];
      const { _id, ...rest } = localCollection;

      updateMethod(
        {
          collectionUrl: collectionPath || "",
          collectionVideoIntakeQuestions: updatedVideos || [],
        },
        {
          onSuccess: (responseData) => {
            console.log("Mutation successful a1", responseData);
          },
          onError: (error) => {
            // Handle error
            console.error("Mutation error", error);
          },
        }
      );
      //   const updatedCollection = {
      //     ...rest,
      //     videos: updatedVideos,
      //   };
      //   updateCollectionMutation.mutate(updatedCollection); // @TODO there should be a simpler video update mutation that should happen here to avoid race conditions?
    }
    if (localCollection && collectionPropToUpdate === "individuals") {
      const currentIndividuals: {}[] = get(
        localCollection,
        ["individuals"],
        []
      );
      const updatedIndividuals: {}[] = [
        ...currentIndividuals,
        { ...formFieldGroupOfConcern?.actualValues, id: uuidv4() },
      ];
      const { _id, ...rest } = localCollection;
      const updatedCollection = {
        ...rest,
        individuals: updatedIndividuals,
      };
      updateCollectionMutation.mutate(updatedCollection); // @TODO there should be a simpler video update mutation that should happen here to avoid race conditions?

      queryClient.invalidateQueries({
        queryKey: ["individualsFor", collectionPath],
      });

      // await queryClient.refetchQueries();
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
        <FormattedMessage
          id="SAVE_AND_PREVIEW"
          defaultMessage="Save and Preview"
        />
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

export default ComposedFormSubmissionButtonVideoIntakeQuestions;
