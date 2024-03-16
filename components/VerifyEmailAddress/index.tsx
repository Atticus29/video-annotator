import { useRouter, NextRouter } from "next/router";
import { useEffect, useState } from "react";
import useFirebaseAuth from "../../hooks/useFirebaseAuth";
import CustomError from "../../components/CustomError";
import { CircularProgress, Typography } from "@mui/material";
import { FormattedMessage } from "react-intl";
import { useIntl, IntlShape } from "react-intl";
import usePostUserRole from "../../hooks/usePostUserRole";
import { Audit } from "../../types";

const VerifyEmailAddress: React.FC = () => {
  const { verifyEmail, authError, user, emailVerified, loading } =
    useFirebaseAuth();
  const intl: IntlShape = useIntl();
  const router: NextRouter = useRouter();
  const oobCode: string = router?.query?.oobCode?.toString() || "";
  const [verifyCalled, setVerifyCalled] = useState<boolean>(false);
  const {
    mutate,
    isPending,
    error: postRoleError,
    isError,
  } = usePostUserRole();
  console.log("deleteMe user is: ");
  console.log(user);

  useEffect(() => {
    const runAsyncVerifyEmail = async (oobCode: string) => {
      if (verifyCalled) {
        router.reload(); //email verification with firebase auth for some crazy reason seems to need a page reload. @TODO test this
      }
      if (user && !emailVerified && oobCode) {
        await verifyEmail(oobCode);
        const newAuditEntry: Audit = {
          previousState: "none",
          newState: "true",
          dateOfChange: Date(),
        };

        mutate(
          {
            uid: user?.uid,
            role: {
              roleName: "isVerified",
              status: true,
              auditTrail: [newAuditEntry],
            },
          },
          {
            onSuccess: (_responseData) => {
              setVerifyCalled(true);
            },
            onError: (error) => {
              console.log("Mutation error: ", error);
            },
          }
        );
      }
    };
    runAsyncVerifyEmail(oobCode); // @TODO decide whether this is even necessary
  }, [emailVerified, oobCode, user, verifyEmail, router, verifyCalled, mutate]); // @TODO decide how best to handle the asynchronicity having to do with getting the user

  return (
    <>
      {(!emailVerified || loading || isPending) && (
        <Typography variant="h6" style={{ marginTop: 30 }}>
          <FormattedMessage
            id="EMAIL_VERIFYING"
            defaultMessage="Attempting to verify your email address..."
          />
          <CircularProgress color="inherit" />
        </Typography>
      )}
      {emailVerified && (
        <Typography variant="h6" style={{ marginTop: 30 }}>
          <FormattedMessage
            id="EMAIL_VERIFIED"
            defaultMessage="Congratulations! You email address has been verified."
          />
        </Typography>
      )}
      {verifyCalled && !emailVerified && !loading && (
        <CustomError errorMsg={authError} />
      )}
      {!user && !loading && (
        <CustomError
          errorMsg={intl.formatMessage({
            id: "USER_NOT_LOGGED_IN",
            defaultMessage:
              "We can't find the user data; make sure you're logged in.",
          })}
        />
      )}
      {isError && <CustomError errorMsg={postRoleError} />}
    </>
  );
};

export default VerifyEmailAddress;
