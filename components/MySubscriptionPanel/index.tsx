import InfoPanel from "../InfoPanel";
import InfoPanelBody from "../InfoPanel/InfoPanelBody";
import { FormattedMessage, useIntl, IntlShape } from "react-intl";
import { Button } from "@mui/material";
import useMonths from "../../hooks/useMonths";
import dayjs from "dayjs";

const MySubScriptionPanel: React.FC = () => {
  const intl: IntlShape = useIntl();
  const { months } = useMonths();
  const currentMonthDigit: number = dayjs().month();
  return (
    <InfoPanel
      titleId="MY_SUBSCRIPTION"
      titleDefault="My Subscription"
      key="my-subscription"
    >
      <InfoPanelBody
        bodyId="SUBSCRIPTION_STATUS_FOR"
        bodyDefault="Subscription Status for"
      >
        {" "}
        <em>
          {months[currentMonthDigit] ||
            intl.formatMessage({
              id: "UNKOWN_MONTH",
              defaultMessage: "Unknown month",
            })}
        </em>
        : Expired
        {/* @TODO make dymamic */}
      </InfoPanelBody>
      {/* @TODO make the activate button disable if subscription is active */}
      <Button disabled variant="contained" style={{ marginRight: "2vw" }}>
        {/* @TODO implement this */}
        <FormattedMessage id="ACTIVATE" defaultMessage="Activate" />
      </Button>
      {/* @TODO make the cancel button disable if subscription is inactive */}
      <Button disabled variant="contained">
        {/* @TODO implement this */}
        <FormattedMessage id="CANCEL" defaultMessage="Cancel" />
      </Button>
    </InfoPanel>
  );
};

export default MySubScriptionPanel;
