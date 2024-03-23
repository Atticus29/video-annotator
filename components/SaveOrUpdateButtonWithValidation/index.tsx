import {
  Button,
  CircularProgress,
  Dialog,
  DialogContent,
  IconButton,
  Snackbar,
} from "@mui/material";
import CustomError from "../CustomError";
import { useEffect, useState } from "react";
import { useQueryClient } from "@tanstack/react-query";
import CloseIcon from "@mui/icons-material/Close";
import { reduce } from "lodash-es";
import { calculateAllRequiredIntakeQuestionsHaveValues } from "../../utilities/saveOrUpdateButtonWithValidationUtils";
import { transformActualValueObjIntoIntakeQuestions } from "../../utilities/intakeQuestionUtils";
import useOnEnter from "../../hooks/useOnEnter";

const SaveOrUpdateButtonWithValidation: React.FC<{
  buttonTitle: string;
  successMsg: string;
  failMsg: string;
  usePostOrUseUpdate: any;
  mutationData: {};
  actualValues: {};
  invalidValues: {};
  setParentStateOnSuccess?: (input: boolean) => void;
  setParentStateOnFailure?: (input: boolean) => void;
  queryKeysToInvalidate?: string[][];
  disabled?: boolean;
}> = ({
  buttonTitle,
  successMsg,
  failMsg,
  usePostOrUseUpdate,
  mutationData,
  actualValues,
  invalidValues,
  setParentStateOnSuccess,
  setParentStateOnFailure,
  queryKeysToInvalidate,
  disabled = false,
}) => {
  const queryClient = useQueryClient();
  const [allRequiredValid, setAllRequiredValid] = useState<boolean>(true);
  const [snackbarMessage, setSnackbarMessage] = useState<string>("");
  const [saveOrUpdateSuccessful, setSaveOrUpdateSuccessful] =
    useState<boolean>(false);
  const [saveOrUpdateUnsuccessful, setSaveOrUpdateUnsuccessful] =
    useState<boolean>(false);
  const { mutate, isPending, isError, error } = usePostOrUseUpdate();
  const [showErrorDialog, setShowErrorDialog] = useState<boolean>(false);
  const handleCloseErrorDialog: () => void = () => {
    setShowErrorDialog(false);
  };

  useOnEnter(() => {
    if (allRequiredValid) {
      handleFormSubmission();
    }
  });

  useEffect(() => {
    if (isError) {
      setShowErrorDialog(true);
    } else {
      setShowErrorDialog(false);
    }
  }, [isError]);

  useEffect(() => {
    if (invalidValues) {
      const totalInvalidCount: number = reduce(
        Object.values(invalidValues || []),
        (memo: any, entry: any) => {
          return Number(entry) + Number(memo);
        },
        0
      );
      setAllRequiredValid(
        totalInvalidCount < 1 &&
          calculateAllRequiredIntakeQuestionsHaveValues(
            transformActualValueObjIntoIntakeQuestions(actualValues),
            actualValues
          )
      );
    }
  }, [actualValues, invalidValues]);

  const handleFormSubmission: () => void = async () => {
    mutate(mutationData, {
      onSuccess: (responseData: any) => {
        if (queryKeysToInvalidate) {
          queryKeysToInvalidate.forEach((currentQueryKey) => {
            queryClient.invalidateQueries({
              queryKey: currentQueryKey,
            });
          });
        }
        console.log("Mutation successful: ", responseData);
        setSaveOrUpdateSuccessful(true);
        setSnackbarMessage(successMsg);
        if (setParentStateOnSuccess) setParentStateOnSuccess(true);
      },
      onError: (error: any) => {
        console.error("Mutation error", error);
        setSaveOrUpdateUnsuccessful(true);
        setSnackbarMessage(failMsg);
        if (setParentStateOnFailure) setParentStateOnFailure(true);
      },
    });
  };

  const handleSnackbarClose = (
    _event: React.SyntheticEvent | Event | null,
    reason?: string
  ) => {
    if (reason === "clickaway") {
      // in case you want this behavior to be different eventually
      setSnackbarMessage("");
      setSaveOrUpdateSuccessful(false);
      setSaveOrUpdateUnsuccessful(false);
      return;
    }

    setSnackbarMessage("");
    setSaveOrUpdateSuccessful(false);
    setSaveOrUpdateUnsuccessful(false);
  };

  return (
    <>
      <Button
        style={{ marginBottom: 10 }}
        data-testid={"submit-button"}
        variant="contained"
        disabled={!allRequiredValid || disabled}
        onClick={handleFormSubmission}
      >
        {isPending && <CircularProgress color="inherit" />}
        {!isPending && buttonTitle}
      </Button>
      <Dialog open={showErrorDialog} onClose={handleCloseErrorDialog}>
        <DialogContent style={{ marginTop: 0 }}>
          <CustomError ignorePaper={true} errorMsg={error?.message} />
        </DialogContent>
      </Dialog>
      <Snackbar
        open={saveOrUpdateSuccessful || saveOrUpdateUnsuccessful}
        onClose={handleSnackbarClose}
        autoHideDuration={6000}
        message={snackbarMessage}
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

export default SaveOrUpdateButtonWithValidation;
