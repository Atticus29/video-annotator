import { useEffect, useState } from "react";
import SingleFormField from "../../components/SingleFormField";
import { FormFieldGroup, SingleFormField as SFFType } from "../../types";
import { isValidEmail } from "../../utilities/validators";
import { FormattedMessage } from "react-intl";
import { Button, Link, Paper } from "@mui/material";
import { get } from "lodash-es";
import { getAuth, sendPasswordResetEmail } from "firebase/auth";

const ForgotPassword: React.FC = () => {
  const [actualValues, setActualValues] = useState<{}>({});
  const [isInvalids, setIsInvalids] = useState<{}>({});
  const [allRequiredValid, setAllRequiredValid] = useState<boolean>(false);

  useEffect(() => {
    const email: string = get(actualValues, ["Email Address"]);
    if (isValidEmail(email)) {
      setAllRequiredValid(true);
    } else {
      setAllRequiredValid(false);
    }
  }, [actualValues]);

  const handlePasswordReset: () => void = () => {
    const email: string = get(actualValues, ["Email Address"]);
    const auth = getAuth();
    sendPasswordResetEmail(auth, email)
      .then(() => {
        console.log("deleteMe success?");
        // Password reset email sent!
        // ..
      })
      .catch((error) => {
        const errorCode = error.code;
        const errorMessage = error.message;
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
        <SingleFormField question={question} formFieldGroup={formFieldGroup} />
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
      {/* {(error || authError) && (
        <CustomError
          errorMsg={
            error ||
            authError ||
            intl.formatMessage({
              id: "GENERIC_ERROR",
              defaultMessage: "Unknown Error",
            })
          }
        />
      )} */}
    </Paper>
  );
};

export default ForgotPassword;
