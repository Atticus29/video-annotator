import { CircularProgress, Fab } from "@mui/material";
import { FormattedMessage } from "react-intl";
import NavigationIcon from "@mui/icons-material/Navigation";

const FloatingStickyButton: React.FC<{
  handleNavigateClick: () => void;
  buttonLoading: boolean;
}> = ({ handleNavigateClick, buttonLoading }) => {
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
          <>
            <NavigationIcon sx={{ mr: 1 }} />
            <FormattedMessage
              id="BACK_TO_MAIN_COLLECTION_PAGE"
              defaultMessage="Back to main collection page"
            />
          </>
        )}
      </Fab>
    </div>
  );
};

export default FloatingStickyButton;
