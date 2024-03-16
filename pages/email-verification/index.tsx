import {
  Button,
  CircularProgress,
  IconButton,
  Paper,
  Snackbar,
  Typography,
} from "@mui/material";
import { FormattedMessage } from "react-intl";
import { sendEmailVerification } from "firebase/auth";
import useFirebaseAuth from "../../hooks/useFirebaseAuth";
import CustomError from "../../components/CustomError";
import { useState } from "react";
import CloseIcon from "@mui/icons-material/Close";

const EmailVerification: React.FC = () => {
  const { user } = useFirebaseAuth();
  const [showError, setShowError] = useState<boolean>(false);
  const [errorMsg, setErrorMsg] = useState<string>("");
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [snackbarMessage, setSnackbarMessage] = useState<string>("");
  const [openSnackbar, setOpenSnackbar] = useState<boolean>(false);

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

    // the "finally" of it all
    setSnackbarMessage("");
    setOpenSnackbar(false);
  };

  const handleVerificationEmailSendoff = async () => {
    setIsLoading(true);
    if (user) {
      try {
        await sendEmailVerification(user);
        setIsLoading(false);
        setSnackbarMessage("Verification email sent!");
        setOpenSnackbar(true);
        // @TODO flesh out more
      } catch (error: any) {
        setIsLoading(false);
        console.log("Error sending verification email: " + error.message);
        setErrorMsg("Error sending verification email: " + error.message);
        setSnackbarMessage(
          "Error sending verification email: " + error.message
        );
        setOpenSnackbar(true);
        setShowError(true);
      }
    }
  };

  return (
    <>
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
        <Typography
          variant="h4"
          style={{ textAlign: "center", marginBottom: 10 }}
        >
          <FormattedMessage
            id="VERIFY_EMAIL_ADDRESS"
            defaultMessage="Verify Your Email Address"
          />
        </Typography>
        <Typography
          variant="body1"
          component="div"
          sx={{ flexGrow: 1 }}
          style={{ marginBottom: 10 }}
        >
          <FormattedMessage id="EMAIL_VERIFICATION_DESCRIPTION" />
        </Typography>
        <Button variant="contained" onClick={handleVerificationEmailSendoff}>
          {isLoading && <CircularProgress color="inherit" />}
          {!isLoading && (
            <FormattedMessage
              id="SEND_VERIFICATION_EMAIL"
              defaultMessage="Send verification email"
            />
          )}
        </Button>
        {showError && <CustomError ignorePaper={true} errorMsg={errorMsg} />}
      </Paper>
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
    </>
  );
};

export default EmailVerification;
