import { useEffect, useState } from "react";
import { FormFieldGroup, SingleFormField as SFFType } from "../../types";
import { FormattedMessage, IntlShape, useIntl } from "react-intl";
import { isValidPassword } from "../../utilities/validators";
import CustomError from "../../components/CustomError";
import {
  Backdrop,
  Button,
  CircularProgress,
  IconButton,
  Paper,
  Snackbar,
} from "@mui/material";
import SingleFormField from "../../components/SingleFormField";
import CloseIcon from "@mui/icons-material/Close";
import { get } from "lodash-es";

const PasswordChange: React.FC = () => {
  const [actualValues, setActualValues] = useState<{}>({});
  const [isInvalids, setIsInvalids] = useState<{}>({});
  const [loading, setLoading] = useState<boolean>(false);
  const [isError, setIsError] = useState<boolean>(false);
  const [errorMessage, setErrorMessage] = useState<string>("");
  const [snackbarMessage, setSnackbarMessage] = useState<string>("");
  const [openSnackbar, setOpenSnackbar] = useState<boolean>(false);
  const [allRequiredValid, setAllRequiredValid] = useState<boolean>(false);
  const intl: IntlShape = useIntl();

  useEffect(() => {
    const password: string = get(actualValues, ["Password"]);
    const confirmPassword: string = get(actualValues, ["Confirm Password"]);
    if (isValidPassword(password) && password === confirmPassword) {
      setAllRequiredValid(true);
    } else {
      setAllRequiredValid(false);
    }
  }, [actualValues]);
  const handlePasswordChange = () => {
    console.log("deleteMe handlePasswordChange entered");
    setLoading(true);
  };
  const handleSnackbarClose = (
    _event: React.SyntheticEvent | Event | null,
    reason?: string
  ) => {
    if (reason === "clickaway") {
      // in case you want this behavior to be different eventually
      setSnackbarMessage("");
      setOpenSnackbar(false);
      return;
    }

    setSnackbarMessage("");
    setOpenSnackbar(false);
  };
  const formFieldGroup: FormFieldGroup = {
    title: "password-change-form",
    setValues: setActualValues,
    actualValues: actualValues,
    isInvalids: isInvalids,
    setIsInvalids: setIsInvalids,
  };
  const passwordQuestion: SFFType = {
    type: "Text",
    label: "Password",
    language: "English",
    isRequired: true,
    invalidInputMessage: "PASSWORD_MUST_CONTAIN",
    validatorMethods: [isValidPassword],
    shouldBeCheckboxes: ["isRequired"],
  };
  const confirmPasswordQuestion: SFFType = {
    type: "Text",
    label: "Confirm Password",
    language: "English",
    isRequired: true,
    invalidInputMessage: "PASSWORD_MUST_CONTAIN",
    validatorMethods: [isValidPassword],
    shouldBeCheckboxes: ["isRequired"],
  };
  return (
    <>
      <Backdrop
        sx={{ color: "#fff", zIndex: (theme) => theme.zIndex.drawer + 1 }}
        open={loading}
      >
        <CircularProgress color="inherit" />
      </Backdrop>
      <Snackbar
        open={openSnackbar}
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
      <Paper
        elevation={8}
        style={{
          margin: "auto",
          marginTop: "10vh",
          paddingBottom: "10vh",
          paddingTop: "3vh",
          paddingLeft: "3vw",
          paddingRight: "3vw",
          maxWidth: 400,
        }}
      >
        <h1 data-testid="login-h1">
          <FormattedMessage
            id="RESET_YOUR_PASSWORD"
            defaultMessage="Reset your password"
          />
        </h1>
        <div>
          <SingleFormField
            question={passwordQuestion}
            formFieldGroup={formFieldGroup}
          />
        </div>
        <div>
          <SingleFormField
            question={confirmPasswordQuestion}
            formFieldGroup={formFieldGroup}
          />
        </div>
        <Button
          style={{ marginBottom: 10 }}
          data-testid={"submit-button"}
          variant="contained"
          disabled={!allRequiredValid}
          onClick={handlePasswordChange}
        >
          <FormattedMessage id="RESET" defaultMessage="Reset" />
        </Button>
        {isError && (
          <CustomError
            errorMsg={
              errorMessage ||
              intl.formatMessage({
                id: "GENERIC_ERROR",
                defaultMessage: "Unknown Error",
              })
            }
          />
        )}
      </Paper>
    </>
  );
};

export default PasswordChange;
