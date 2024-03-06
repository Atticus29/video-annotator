import { useEffect, useState } from "react";
import SingleFormField from "../../components/SingleFormField";
import { FormFieldGroup, SingleFormField as SFFType } from "../../types";
import { isValidEmail } from "../../utilities/validators";
import { FormattedMessage, IntlShape, useIntl } from "react-intl";
import {
  Backdrop,
  Button,
  CircularProgress,
  IconButton,
  Paper,
  Snackbar,
} from "@mui/material";
import { get } from "lodash-es";
import { getAuth, sendPasswordResetEmail } from "firebase/auth";
import CloseIcon from "@mui/icons-material/Close";
import CustomError from "../../components/CustomError";

const ForgotPassword: React.FC = () => {
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
    const email: string = get(actualValues, ["Email Address"]);
    if (isValidEmail(email)) {
      setAllRequiredValid(true);
    } else {
      setAllRequiredValid(false);
    }
  }, [actualValues]);

  const handleSnackbarClose = (
    event: React.SyntheticEvent | Event | null,
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
  const passwordResetMessage: string = intl.formatMessage({
    id: "PASSWORD_RESET_EMAIL_SENT",
    defaultMessage: "Password reset email sent!",
  });

  const errorResettingPasswordMessage: string = intl.formatMessage({
    id: "ERROR_RESETTING_PASSWORD",
    defaultMessage: "Error resetting password",
  });

  const handlePasswordReset: () => void = () => {
    setLoading(true);
    const email: string = get(actualValues, ["Email Address"]);
    const auth = getAuth();
    sendPasswordResetEmail(auth, email)
      .then(() => {
        setLoading(false);
        setSnackbarMessage(passwordResetMessage);
        setOpenSnackbar(true);
      })
      .catch((error) => {
        const errorMessage = error.message;
        setErrorMessage(errorMessage);
        setIsError(true);
        setLoading(false);
        setSnackbarMessage(errorResettingPasswordMessage + ": " + errorMessage);
        setOpenSnackbar(true);
        // ..
      });
  };
  const formFieldGroup: FormFieldGroup = {
    title: "forgotpassword-form",
    setValues: setActualValues,
    actualValues: actualValues,
    isInvalids: isInvalids,
    setIsInvalids: setIsInvalids,
  };
  const question: SFFType = {
    type: "Email",
    label: "Email Address",
    language: "English",
    isRequired: true,
    invalidInputMessage: "MUST_BE_VALID_EMAIL",
    validatorMethods: [isValidEmail],
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
            question={question}
            formFieldGroup={formFieldGroup}
          />
        </div>
        <Button
          style={{ marginBottom: 10 }}
          data-testid={"submit-button"}
          variant="contained"
          disabled={!allRequiredValid}
          onClick={handlePasswordReset}
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

export default ForgotPassword;
