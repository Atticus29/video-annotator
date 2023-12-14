import { Tooltip } from "@mui/material";
import ViewIcon from "@mui/icons-material/Launch";

import { useIntl, IntlShape } from "react-intl";
import { get } from "lodash-es";
import router from "next/router";

const ViewCollectionActionButton: React.FC<{
  props: { id: string | number; urlTarget?: string };
}> = (props) => {
  const intl: IntlShape = useIntl();
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

export default ViewCollectionActionButton;
