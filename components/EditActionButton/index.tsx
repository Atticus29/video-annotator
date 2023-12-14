import { Tooltip } from "@mui/material";
import EditIcon from "@mui/icons-material/Edit";

import { useIntl, IntlShape } from "react-intl";
import { get } from "lodash-es";
import router from "next/router";

const EditActionButton: React.FC<{ props: { id: string | number } }> = (
  props
) => {
  const intl: IntlShape = useIntl();
  const handleEditClick = async () => {
    const url: string = get(props, ["urlTarget"], "");
    router.push(url);
  };
  return (
    <Tooltip title={intl.formatMessage({ id: "EDIT", defaultMessage: "Edit" })}>
      <EditIcon onClick={handleEditClick} />
    </Tooltip>
  );
};

export default EditActionButton;
