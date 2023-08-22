import React, { useEffect, useRef } from "react";
import {
  Button,
  Fab,
  Grid,
  IconButton,
  Paper,
  Typography,
} from "@mui/material";
import { Tooltip } from "@mui/material";
// import EditIcon from "@mui/icons-material/Edit";
import EditRoundedIcon from "@mui/icons-material/EditRounded";

import { FormattedMessage } from "react-intl";

const InfoPanel: React.FC<{
  titleId: string;
  titleDefault: string;
  styleOverrides?: {};
  textOverrides?: {};
  includeCornerEditButton?: boolean;
  setEditButton?: (val: boolean) => void;
  ref?: any;
  setInfoPanelHeight?: (inputHeigth: number) => void;
  children?: React.ReactNode;
}> = ({
  titleId,
  titleDefault,
  styleOverrides = {},
  textOverrides = {},
  includeCornerEditButton = false,
  setEditButton = () => {},
  setInfoPanelHeight,
  children,
}) => {
  const isEditable: boolean = includeCornerEditButton && Boolean(setEditButton);
  const infoPanelRef: any = useRef(null);

  const handleEditClick: () => void = () => {
    setEditButton(true);
  };

  // const divRef = useRef(null);

  useEffect(() => {
    console.log("deleteMe divRef is: ");
    console.log(infoPanelRef);
    const infoPanelHeight: number = infoPanelRef?.current?.clientHeight;
    console.log("deleteMe infoPanelHeight is: ");
    console.log(infoPanelHeight);
    if (setInfoPanelHeight) setInfoPanelHeight(infoPanelHeight);
    // divRef.current.style.maxHeight = "100px";
  }, [infoPanelRef, setInfoPanelHeight]);

  return (
    <div ref={infoPanelRef}>
      <Paper
        elevation={8}
        style={{
          margin: "auto",
          paddingBottom: "3vh",
          paddingTop: "3vh",
          paddingLeft: "3vw",
          paddingRight: "3vw",
        }}
      >
        <>
          {isEditable && (
            <Grid container justifyContent="flex-end" alignItems="flex-end">
              <Grid item>
                {/* <IconButton
                color="primary"
                aria-label="edit collection"
                onClick={handleEditClick}
              > */}
                <Fab
                  color="primary"
                  aria-label="edit collection"
                  onClick={handleEditClick}
                >
                  <EditRoundedIcon />
                </Fab>
                {/* </IconButton> */}
              </Grid>
            </Grid>
          )}
          <Typography
            variant="h5"
            style={{ marginBottom: "2vh", ...textOverrides }}
          >
            <FormattedMessage id={titleId} defaultMessage={titleDefault} />
          </Typography>
          <div style={{ maxHeight: 200, overflow: "auto", ...styleOverrides }}>
            {children}
          </div>
        </>
      </Paper>
    </div>
  );
};

export default InfoPanel;
