import { Tooltip } from "@mui/material";
import ViewIcon from "@mui/icons-material/Launch";

import { useIntl, IntlShape } from "react-intl";
import { get } from "lodash-es";
import { NextRouter, useRouter } from "next/router";

const ViewActionButton: React.FC<{
  props: { id: string | number; urlTarget?: string };
}> = (props) => {
  const intl: IntlShape = useIntl();
  const router: NextRouter = useRouter();
  const handleViewClick = async () => {
    const url: string = get(props, ["urlTarget"], "");
    router.push(url);
  };
  return (
    <Tooltip title={intl.formatMessage({ id: "VIEW", defaultMessage: "View" })}>
      <ViewIcon onClick={handleViewClick} />
    </Tooltip>
  );
};

export default ViewActionButton;
