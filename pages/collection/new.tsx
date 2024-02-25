import { useState } from "react";
import { Grid } from "@mui/material";
import CollectionDetailsEdit from "../../components/CollectionDetailsEdit";
import { Collection } from "../../types";
import { IntlShape, useIntl } from "react-intl";
import { NextRouter, useRouter } from "next/router";
import useFirebaseAuth from "../../hooks/useFirebaseAuth";
import UnsavedChangesPrompt from "../../components/UnsavedChangesPrompt";

const NewCollection: React.FC = () => {
  // const { user, authError } = useFirebaseAuth();
  // const [isCollectionDetailsInEditMode, setIsCollectionDetailsInEditMode] =
  //   useState<boolean>(false);

  return (
    <>
      <UnsavedChangesPrompt />
      <Grid container spacing={2} style={{ marginTop: "1vh" }}>
        <>
          <Grid item sm={12} md={12}>
            <CollectionDetailsEdit
              titleId="CREATE_COLLECTION"
              // setIsCollectionDetailsInEditMode={
              //   setIsCollectionDetailsInEditMode
              // }
              mode="create"
            />
          </Grid>
        </>
      </Grid>
    </>
  );
};

export default NewCollection;
