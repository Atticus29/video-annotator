import { Button, IconButton, Snackbar } from "@mui/material";
import CustomError from "../CustomError";
import { FormattedMessage } from "react-intl";
import { useEffect, useState } from "react";
import { UseMutateFunction } from "@tanstack/react-query";
import CloseIcon from "@mui/icons-material/Close";
import { reduce } from "lodash-es";
import { calculateAllRequiredIntakeQuestionsHaveValues } from "../../utilities/composedFormSubmissionButtonUtils";
import { transformActualValueObjIntoIntakeQuestions } from "../../utilities/videoIntakeQuestionUtils";

const SaveOrUpdateButtonWithValidation: React.FC<{
  //   saveOrUpdateMethod: any;
  usePostOrUseUpdate: any;
  mutationData: {};
  //   queryData: { isPending: boolean; isError: boolean; error: any };
  //   transformationMethod: (actualValues: {}) => any;
  actualValues: {};
  invalidValues: {};
}> = ({
  usePostOrUseUpdate,
  mutationData,
  //   queryData,
  //   transformationMethod,
  actualValues,
  invalidValues,
}) => {
  const [allRequiredValid, setAllRequiredValid] = useState<boolean>(true);
  const [snackbarMessage, setSnackbarMessage] = useState<string>("");
  const [saveOrUpdateSuccessful, setSaveOrUpdateSuccessful] =
    useState<boolean>(false);
  const [saveOrUpdateUnsuccessful, setSaveOrUpdateUnsuccessful] =
    useState<boolean>(false);
  const { mutate, isPending, isError, error } = usePostOrUseUpdate();

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
    console.log("deleteMe handleFormSubmission called");
    mutate(mutationData, {
      onSuccess: (responseData: any) => {
        console.log("Mutation successful a1", responseData);
      },
      onError: (error: any) => {
        // Handle error
        console.error("Mutation error", error);
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
      return;
    }

    // the "finally" of it all
    setSnackbarMessage("");
  };

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
