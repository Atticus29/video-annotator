import { Tooltip } from "@mui/material";
import ViewIcon from "@mui/icons-material/Launch";

import { useIntl, IntlShape } from "react-intl";
import { get } from "lodash-es";

const ViewCollectionActionButton: React.FC<{
  props: { id: string | number };
}> = (props) => {
  const intl: IntlShape = useIntl();
  // @TODO add button click handler and possibly prevent propagation
  const handleViewClick = async () => {
    console.log("deleteMe view clicked");
    console.log("deleteMe id is: ");
    console.log(get(props, ["id"]));
  };
  return (
    <Tooltip title={intl.formatMessage({ id: "VIEW", defaultMessage: "View" })}>
      <ViewIcon onClick={handleViewClick} />
    </Tooltip>
  );
};

export default ViewCollectionActionButton;
