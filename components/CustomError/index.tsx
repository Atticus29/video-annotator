import React from "react";
import { Paper, Alert } from "@mui/material";
import { FormattedMessage } from "react-intl";

const CustomError: React.FC<{
  statusMsg?: any;
  errorMsg?: any;
  ignoreHeader?: boolean | undefined;
  ignorePaper?: boolean | undefined;
}> = (props) => {
  return (
    <>
      {props.ignorePaper && (
        <React.Fragment>
          {!props?.ignoreHeader && (
            <h1>
              <FormattedMessage
                id="404_ERROR"
                defaultMessage="Whoops. Something didn't work."
              ></FormattedMessage>
            </h1>
          )}
          {props?.errorMsg && (
            <Alert severity="error" style={{ textAlign: "center" }}>
              {props.errorMsg || props.errorMsg.message}
            </Alert>
          )}
          {!props?.errorMsg && (
            <Alert style={{ textAlign: "center" }} severity="error">
              <FormattedMessage
                id="GENERIC_ERROR"
                defaultMessage="There was an error, but we don't have an error code for it."
              ></FormattedMessage>
            </Alert>
          )}
        </React.Fragment>
      )}
      {!(props.statusMsg == 404) &&
        !props.ignorePaper && ( // we let these get handled elsewhere because they shouldn't always show up as errors that an end user needs to be worried about
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
              {!props?.ignoreHeader && (
                <h1>
                  <FormattedMessage
                    id="404_ERROR"
                    defaultMessage="Whoops. Something didn't work."
                  ></FormattedMessage>
                </h1>
              )}
              {props?.errorMsg && (
                <Alert severity="error" style={{ textAlign: "center" }}>
                  {props.errorMsg || props.errorMsg.message}
                </Alert>
              )}
              {!props?.errorMsg && (
                <Alert style={{ textAlign: "center" }} severity="error">
                  <FormattedMessage
                    id="GENERIC_ERROR"
                    defaultMessage="There was an error, but we don't have an error code for it."
                  ></FormattedMessage>
                </Alert>
              )}
            </React.Fragment>
          </Paper>
        )}
    </>
  );
};

export default CustomError;
