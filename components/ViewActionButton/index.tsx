import { Tooltip } from "@mui/material";
import ViewIcon from "@mui/icons-material/Launch";

import { useIntl, IntlShape } from "react-intl";
import { get } from "lodash-es";
import { NextRouter, useRouter } from "next/router";

const ViewActionButton: React.FC<{
  props: { id: string | number; urlTarget?: string };
}> = (props) => {
  console.log("deleteMe ViewActionButton entered");
  console.log("deleteMe props  in ViewActionButton are: ");
  console.log(props);
  const intl: IntlShape = useIntl();
  const router: NextRouter = useRouter();
  // @TODO add button click handler and possibly prevent propagation
  const handleViewClick = async () => {
    // console.log("deleteMe view clicked");
    // console.log("deleteMe urlTarget is: ");
    // console.log(props?.urlTarget);
    const url: string = get(props, ["urlTarget"], "");
    router.push(url);

    // console.log(get(props, ["id"]));
  };
  return (
    <Tooltip title={intl.formatMessage({ id: "VIEW", defaultMessage: "View" })}>
      <ViewIcon onClick={handleViewClick} />
    </Tooltip>
  );
};

export default ViewActionButton;
