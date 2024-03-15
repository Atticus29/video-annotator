import { useRouter, NextRouter } from "next/router";
import VerifyEmailAddress from "../../components/VerifyEmailAddress";
import PasswordChange from "../password-change";

const VerifyEndpoint: React.FC = () => {
  const router: NextRouter = useRouter();
  const mode: string = router?.query?.mode?.toString() || "";
  return (
    <>
      {mode === "resetPassword" && <PasswordChange />}
      {/* @TODO fix */}
      {mode === "verifyEmail" && <VerifyEmailAddress />}
    </>
  );
};

export default VerifyEndpoint;
