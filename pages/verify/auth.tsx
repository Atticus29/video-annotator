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
import VerifyEmailAddress from "../../components/VerifyEmailAddress";
import PasswordChange from "../password-change";

const VerifyEndpoint: React.FC = () => {
  const router: NextRouter = useRouter();
  const mode: string = router?.query?.mode?.toString() || "";
  return (
    <>
      {mode === "resetPassword" && <PasswordChange />}
      {/* @TODO fix */}
      {mode === "verifyEmail" && <VerifyEmailAddress />};
    </>
  );
};

export default VerifyEndpoint;
