import React from "react";
import { Paper, Alert } from "@mui/material";
import { FormattedMessage } from "react-intl";
import CloseIcon from "@mui/icons-material/Close";
import IconButton from "@mui/material/IconButton";
import Collapse from "@mui/material/Collapse";

const CustomError: React.FC<{
  statusMsg?: any;
  errorMsg?: any;
  ignoreHeader?: boolean | undefined;
  ignorePaper?: boolean | undefined;
  isDismissible?: boolean;
}> = ({
  statusMsg,
  errorMsg,
  ignoreHeader,
  ignorePaper,
  isDismissible = true,
}) => {
  const [open, setOpen] = React.useState(true);

  return (
    <>
      <Collapse in={open}>
        {ignorePaper && (
          <React.Fragment>
            {!ignoreHeader && (
              <h1>
                <FormattedMessage
                  id="404_ERROR"
                  defaultMessage="Whoops. Something didn't work."
                ></FormattedMessage>
              </h1>
            )}
            {errorMsg && (
              <Alert
                action={
                  isDismissible ? (
                    <IconButton
                      aria-label="close"
                      color="inherit"
                      size="small"
                      onClick={() => {
                        setOpen(false);
                      }}
                    >
                      <CloseIcon fontSize="inherit" />
                    </IconButton>
                  ) : (
                    ""
                  )
                }
                severity="error"
                style={{ textAlign: "center" }}
              >
                {errorMsg || errorMsg.message}
              </Alert>
            )}
            {!errorMsg && (
              <Alert
                action={
                  <IconButton
                    aria-label="close"
                    color="inherit"
                    size="small"
                    onClick={() => {
                      setOpen(false);
                    }}
                  >
                    <CloseIcon fontSize="inherit" />
                  </IconButton>
                }
                style={{ textAlign: "center" }}
                severity="error"
              >
                <FormattedMessage
                  id="GENERIC_ERROR"
                  defaultMessage="There was an error, but we don't have an error code for it."
                ></FormattedMessage>
              </Alert>
            )}
          </React.Fragment>
        )}
        {!(statusMsg == 404) &&
          !ignorePaper && ( // we let these get handled elsewhere because they shouldn't always show up as errors that an end user needs to be worried about
            <Paper
              elevation={8}
              style={{
                margin: "auto",
                marginTop: "10vh",
                paddingBottom: "10vh",
                paddingTop: "3vh",
                paddingLeft: "3vw",
                paddingRight: "3vw",
                maxWidth: 400,
              }}
            >
              <React.Fragment>
                {!ignoreHeader && (
                  <h1>
                    <FormattedMessage
                      id="404_ERROR"
                      defaultMessage="Whoops. Something didn't work."
                    ></FormattedMessage>
                  </h1>
                )}
                {errorMsg && (
                  <Alert
                    action={
                      <IconButton
                        aria-label="close"
                        color="inherit"
                        size="small"
                        onClick={() => {
                          setOpen(false);
                        }}
                      >
                        <CloseIcon fontSize="inherit" />
                      </IconButton>
                    }
                    severity="error"
                    style={{ textAlign: "center" }}
                  >
                    {errorMsg || errorMsg.message}
                  </Alert>
                )}
                {!errorMsg && (
                  <Alert
                    action={
                      <IconButton
                        aria-label="close"
                        color="inherit"
                        size="small"
                        onClick={() => {
                          setOpen(false);
                        }}
                      >
                        <CloseIcon fontSize="inherit" />
                      </IconButton>
                    }
                    style={{ textAlign: "center" }}
                    severity="error"
                  >
                    <FormattedMessage
                      id="GENERIC_ERROR"
                      defaultMessage="There was an error, but we don't have an error code for it."
                    ></FormattedMessage>
                  </Alert>
                )}
              </React.Fragment>
            </Paper>
          )}
      </Collapse>
    </>
  );
};

export default CustomError;
