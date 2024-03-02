import { CircularProgress, Fab, Tooltip } from "@mui/material";
import { FormattedMessage, IntlShape, useIntl } from "react-intl";
import HomeIcon from "@mui/icons-material/Home";

const FloatingStickyButton: React.FC<{
  handleNavigateClick: () => void;
  buttonLoading: boolean;
}> = ({ handleNavigateClick, buttonLoading }) => {
  const intl: IntlShape = useIntl();
  return (
    <div
      style={{
        display: "flex",
        justifyContent: "flex-end",
        position: "sticky",
        zIndex: 1000,
        top: "22vh",
      }}
    >
      <Fab
        onClick={handleNavigateClick}
        variant="extended"
        style={{
          marginBottom: "1rem",
          marginTop: "1rem",
          marginRight: "1rem",
        }}
      >
        {buttonLoading && <CircularProgress color="inherit" />}
        {!buttonLoading && (
          <Tooltip // @TODO this is not currently working
            title={intl.formatMessage({
              id: "BACK_TO_MAIN_COLLECTION_PAGE",
              defaultMessage: "Back to main collection page",
            })}
          >
            <>
              <HomeIcon sx={{ mr: 1 }} />
              <FormattedMessage id="BACK" defaultMessage="Back" />
            </>
          </Tooltip>
        )}
      </Fab>
    </div>
  );
};

export default FloatingStickyButton;
