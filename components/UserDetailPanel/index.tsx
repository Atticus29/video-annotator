import InfoPanel from "../InfoPanel";
import InfoPanelBody from "../InfoPanel/InfoPanelBody";
import { FormattedMessage } from "react-intl";
import { Button } from "@mui/material";
import router from "next/router";

const UserDetailPanel: React.FC<{ displayName?: string; email: string }> = ({
  displayName,
  email,
}) => {
  const handlePasswordResetRedirect: () => void = () => {
    router.push("/forgot-password");
  };
  return (
    <InfoPanel
      titleId="USER_INFO"
      titleDefault="User Details"
      key="user-details"
    >
      {displayName && (
        <InfoPanelBody bodyId="USERNAME" bodyDefault="Username">
          {" : "}
          {displayName}
        </InfoPanelBody>
      )}
      <InfoPanelBody bodyId="EMAIL_ADDRESS" bodyDefault="Email Address">
        {" "}
        : {email}
      </InfoPanelBody>
      <Button variant="contained" onClick={handlePasswordResetRedirect}>
        <FormattedMessage id="RESET_PASSWORD" defaultMessage="Reset Password" />
      </Button>
    </InfoPanel>
  );
};

export default UserDetailPanel;
