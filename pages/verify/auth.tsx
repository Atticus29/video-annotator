import { useRouter, NextRouter } from "next/router";
import { useEffect, useState } from "react";
import useFirebaseAuth from "../../hooks/useFirebaseAuth";
import CustomError from "../../components/CustomError";
import { Typography } from "@mui/material";
import { FormattedMessage } from "react-intl";
import { useMutation } from "@tanstack/react-query";
import { useIntl, IntlShape } from "react-intl";
import useMutateUserRoles from "../../hooks/useUpdateUserRoles";
import usePostUserRole from "../../hooks/usePostUserRole";
import { Audit } from "../../types";

const VerifyEmailAddress: React.FC = () => {
  const { verifyEmail, authError, user, emailVerified } = useFirebaseAuth();
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
    const runAsyncVerifyEmail = async (
      oobCode: string,
      emailVerfied: boolean
    ) => {
      if (verifyCalled) {
        router.reload(); //email verification with firebase auth for some crazy reason seems to need a page reload.
      }
      if (user && !emailVerified && oobCode) {
        console.log("deleteMe user is: ");
        console.log(user);
        const result = await verifyEmail(oobCode);
        console.log("deleteMe result for verifyEmail is: ");
        console.log(result);
        const newAuditEntry: Audit = {
          previousState: "none",
          newState: "true",
          dateOfChange: Date(),
        };

        mutate(
          // { uid: uid, roles: { isAdmin: true } },
          {
            uid: user?.uid,
            role: {
              roleName: "isVerified",
              status: true,
              auditTrail: [newAuditEntry],
            },
          },
          {
            onSuccess: (responseData) => {
              console.log("deleteMe got here and responseData is: ");
              console.log(responseData);
              setVerifyCalled(true);
              // router.push("email-verification");
            },
            onError: (error) => {
              console.log("Mutation error: ", error);
            },
          }
        ); // @TODO deleteMe
      }
    };
    runAsyncVerifyEmail(oobCode, emailVerified); // @TODO decide whether this is even necessary
  }, [emailVerified, oobCode, user, verifyEmail, router, verifyCalled, mutate]); // @TODO decide how best to handle the asynchronicity having to do with getting the user

  return (
    <>
      {!emailVerified && (
        <Typography variant="h6" style={{ marginTop: 30 }}>
          <FormattedMessage
            id="EMAIL_VERIFYING"
            defaultMessage="Attempting to verify your email address..."
          />
        </Typography>
      )}
      {emailVerified && (
        <Typography variant="h6" style={{ marginTop: 30 }}>
          <FormattedMessage
            id="EMAIL_VERIFIED"
            defaultMessage="Congratulations! You email address has been varified."
          />
        </Typography>
      )}
      {verifyCalled && !emailVerified && <CustomError errorMsg={authError} />}
      {!user && (
        <CustomError
          errorMsg={intl.formatMessage({
            id: "USER_NOT_LOGGED_IN",
            defaultMessage:
              "We can't find the user data; make sure you're logged in.",
          })}
        />
      )}
    </>
  );
};

export default VerifyEmailAddress;
