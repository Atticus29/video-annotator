import { Grid, Typography } from "@mui/material";

import { map } from "lodash-es";

import { Collection } from "../../types";
import InfoPanel from "../InfoPanel";
import {
  capitalizeEachWord,
  convertCamelCaseToCapitalCase,
} from "../../utilities/textUtils";

const CollectionDetailsView: React.FC<{
  collection: Collection;
  showEditButton: boolean;
  setIsCollectionDetailsInEditMode?: (val: boolean) => void;
}> = ({ collection, showEditButton, setIsCollectionDetailsInEditMode }) => {
  const excludeFromDetailsList: string[] = collection.excludeFromDetailList;
  return (
    <InfoPanel
      titleId="COLLECTION_DETAILS"
      titleDefault="Collection Details"
      textOverrides={{ textAlign: "center" }}
      styleOverrides={{ maxHeight: 1000 }}
      includeCornerEditButton={showEditButton}
      setEditButton={setIsCollectionDetailsInEditMode}
    >
      <Grid container>
        {map(collection.metadata, (collectionEl, elKey) => {
          const showInView: boolean = !excludeFromDetailsList.includes(
            elKey.toString()
          );
          return (
            <Grid key={elKey} item lg={12} sm={12}>
              {showInView && (
                <Typography key={elKey}>
                  {convertCamelCaseToCapitalCase(elKey)} :{" "}
                  {capitalizeEachWord(collectionEl?.toString() || "No value")}
                </Typography>
              )}
            </Grid>
          );
        })}
      </Grid>
    </InfoPanel>
  );
};

export default CollectionDetailsView;
