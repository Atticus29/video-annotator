import React, { useState, useEffect } from "react";
import { useRouter, NextRouter } from "next/router";
import useFirebaseAuth from "../../hooks/useFirebaseAuth";
import { UserCredential } from "firebase/auth";
import RemoveRedEyeIcon from "@mui/icons-material/RemoveRedEye";
import InputAdornment from "@mui/material/InputAdornment";
import useOnEnter from "../../hooks/useOnEnter";
import { User } from "firebase/auth";

import { TextField, Paper, Button } from "@mui/material";
import { FormattedMessage, useIntl, IntlShape } from "react-intl";
import { sendEmailVerification } from "firebase/auth";
import Typography from "@mui/material/Typography";

import CustomError from "../../components/CustomError/index";
import {
  isValidEmail,
  isValidPassword,
  isValidUsername,
} from "../../utilities/validators";
import useMutateUserRoles from "../../hooks/useMutateUserRoles";
import { UserRoles } from "../../types";

const CreateAccount: React.FC<{ user?: User }> = ({ user = null }) => {
  //User is an optional prop only because it makes testing easier... it's optional because I can't feed props to Next.js route components.
  const intl: IntlShape = useIntl();
  const router: NextRouter = useRouter();

  const { auth, user: userFromHook } = useFirebaseAuth();
  user = user ? user : userFromHook; // again, the only time a user prop should be provided to this component is in the tests

  const { createUser, authError } = useFirebaseAuth();
  const [emailInvalid, setEmailInvalid] = useState<boolean>(false); // @TODO all of these useStates probably might could be cleaned up and combined
  const [passwordInvalid, setPasswordInvalid] = useState<boolean>(false);
  const [confirmPasswordInvalid, setConfirmPasswordInvalid] =
    useState<boolean>(false);
  const [email, setEmail] = useState<string>("");
  const [password, setPassword] = useState<string>("");
  const [confirmPassword, setConfirmPassword] = useState<string>("");
  const [userNameInvalid, setUserNameInvalid] = useState<boolean>(false);
  const [username, setUsername] = useState<string>("");
  const [allRequiredValid, setAllRequiredValid] = useState<boolean>(false);
  const [error, setError] = useState<string>("");
  const [passwordFieldType, setPasswordFieldType] =
    useState<string>("password");
  const [confirmPasswordFieldType, setConfirmPasswordFieldType] =
    useState<string>("password");

  const {
    mutate,
    isPending,
    error: mutateRolesError,
    isError,
  } = useMutateUserRoles();

  useOnEnter(() => {
    if (allRequiredValid) {
      handleAccountCreation();
    }
  });

  useEffect(() => {
    if (
      isValidEmail(email) &&
      isValidPassword(password) &&
      confirmPassword === password &&
      isValidUsername(username)
    ) {
      setAllRequiredValid(true);
    } else {
      setAllRequiredValid(false);
    }
  }, [
    emailInvalid,
    passwordInvalid,
    confirmPasswordInvalid,
    userNameInvalid,
    email,
    password,
    confirmPassword,
    username,
  ]);

  const handleEmailChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const currentEmail: string = event?.currentTarget?.value;
    setEmail(currentEmail);
    setEmailInvalid(!isValidEmail(currentEmail));
  };

  const handlePasswordChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const currentPassword: string = event?.currentTarget?.value;
    setPassword(currentPassword);
    setPasswordInvalid(!isValidPassword(currentPassword));
  };

  const handleConfirmPasswordChange = (
    event: React.ChangeEvent<HTMLInputElement>
  ) => {
    const currentConfirmPassword: string = event?.currentTarget?.value;
    setConfirmPassword(currentConfirmPassword);
    setConfirmPasswordInvalid(currentConfirmPassword !== password);
  };

  const handleUsernameChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const currentUsername = event?.currentTarget?.value;
    setUsername(currentUsername);
    setUserNameInvalid(!isValidUsername(currentUsername));
  };

  const handlePasswordVisibility = () => {
    if (passwordFieldType === "password") {
      setPasswordFieldType("text");
    } else {
      setPasswordFieldType("password");
    }
  };

  const handleConfirmPasswordVisibility = () => {
    if (confirmPasswordFieldType === "password") {
      setConfirmPasswordFieldType("text");
    } else {
      setConfirmPasswordFieldType("password");
    }
  };

  const handleAccountCreation = async () => {
    try {
      if (auth) {
        const userInfo: UserCredential = await createUser(
          auth,
          email,
          password
        );
        const userToken: string | null =
          (await userInfo?.user?.getIdToken()) || null;
        if (userToken) {
          const uid: string = userInfo?.user?.uid;

          mutate(
            // { uid: uid, roles: { isAdmin: true } },
            {
              uid: uid,
              roles: {
                hasPaid: false,
                hasAnnotatedEnough: false,
                isModerator: false,
              },
            },
            {
              onSuccess: (responseData) => {
                console.log("deleteMe got here and responseData is: ");
                console.log(responseData);
              },
              onError: (error) => {
                console.log("Mutation error: ", error);
              },
            }
          ); // @TODO deleteMe
          // mutate(auth.uid, {  });
          // @TODO handle the fact that the user gets redirected to the scenario wherein they can't be in account creation without being logged out
          // await sendEmailVerification(user);
          // router.push("email-verification"); // @TODO comment back in
        } else {
          router.push("error");
        }
      } else {
        router.push("error");
      }
    } catch (error: any) {
      setError(error?.message);
    }
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
      <h1>
        <FormattedMessage
          id={user ? "MUST_LOG_OUT_FIRST" : "CREATE_AN_ACCOUNT"}
          defaultMessage="Create an Account"
        />
      </h1>
      {!user && (
        <div>
          <div>
            <TextField
              fullWidth
              data-testid={"emailInput"}
              error={emailInvalid}
              variant="filled"
              label={
                <FormattedMessage
                  id="EMAIL_ADDRESS"
                  defaultMessage="Email Address"
                />
              }
              required
              helperText={
                emailInvalid
                  ? intl.formatMessage({
                      id: "MUST_BE_VALID_EMAIL",
                      defaultMessage: "Must be a valid email address",
                    })
                  : ""
              }
              style={{ marginBottom: 10, maxWidth: 400 }}
              onChange={handleEmailChange}
              value={email}
            ></TextField>
          </div>
          <div>
            <TextField
              type={passwordFieldType}
              fullWidth
              data-testid={"passwordInput"}
              error={passwordInvalid}
              variant="filled"
              label={
                <FormattedMessage id="PASSWORD" defaultMessage="Password" />
              }
              required
              helperText={
                passwordInvalid
                  ? intl.formatMessage({
                      id: "PASSWORD_MUST_CONTAIN",
                      defaultMessage:
                        "Password must be seven characters long and contain both letters and numbers",
                    })
                  : ""
              }
              onChange={handlePasswordChange}
              style={{ marginBottom: 10, maxWidth: 400 }}
              value={password}
              InputProps={{
                endAdornment: (
                  <InputAdornment
                    position="end"
                    onClick={handlePasswordVisibility}
                  >
                    <RemoveRedEyeIcon />
                  </InputAdornment>
                ),
              }}
            ></TextField>
          </div>
          <div>
            <TextField
              type={confirmPasswordFieldType}
              fullWidth
              data-testid={"confirmPasswordInput"}
              error={confirmPasswordInvalid}
              variant="filled"
              label={
                <FormattedMessage
                  id="CONFIRM_PASSWORD"
                  defaultMessage="Confirm Passsword"
                />
              }
              required
              helperText={
                confirmPasswordInvalid
                  ? intl.formatMessage({
                      id: "PASSWORDS_MUST_BE_IDENTICAL",
                      defaultMessage: "Passwords must be identical",
                    })
                  : ""
              }
              style={{ marginBottom: 10, maxWidth: 400 }}
              onChange={handleConfirmPasswordChange}
              value={confirmPassword}
              InputProps={{
                endAdornment: (
                  <InputAdornment
                    position="end"
                    onClick={handleConfirmPasswordVisibility}
                  >
                    <RemoveRedEyeIcon />
                  </InputAdornment>
                ),
              }}
            ></TextField>
          </div>
          <div>
            <TextField
              fullWidth
              data-testid={"usernameInput"}
              error={userNameInvalid}
              variant="filled"
              label={
                <FormattedMessage id="USERNAME" defaultMessage="Username" />
              }
              required
              helperText={
                userNameInvalid
                  ? intl.formatMessage({
                      id: "USERNAME_IS_REQUIRED",
                      defaultMessage: "Username is required",
                    })
                  : "" // @TODO already exists; try another username
              }
              style={{ marginBottom: 10, maxWidth: 400 }}
              onChange={handleUsernameChange}
              value={username}
            ></TextField>
          </div>
          <Button
            data-testid={"submit-button"}
            variant="contained"
            disabled={!allRequiredValid}
            onClick={handleAccountCreation}
          >
            <FormattedMessage
              id="CREATE_ACCOUNT"
              defaultMessage="Create Account"
            />
          </Button>
          {(error || authError) && (
            <CustomError errorMsg={error || authError} />
          )}
        </div>
      )}
      {user && (
        <Typography>
          <FormattedMessage
            id="CANNOTE_CREATE_ACCOUNT_WHILE_LOGGED_IN"
            defaultMessage="You are currently logged in. You cannot create a new account while you are logged in. Make sure that you log out first."
          />
        </Typography>
      )}
    </Paper>
  );
};

export default CreateAccount;
