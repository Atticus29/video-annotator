import { CircularProgress, Grid, Typography } from "@mui/material";

import { map } from "lodash-es";

import InfoPanel from "../InfoPanel";
import {
  capitalizeEachWord,
  convertCamelCaseToCapitalCase,
} from "../../utilities/textUtils";
import useGetCollection from "../../hooks/useGetCollection";
import CustomError from "../CustomError";
import { IntlShape, useIntl } from "react-intl";
import { useMemo } from "react";

const CollectionDetailsView: React.FC<{
  collectionUrl: string;
  showEditButton: boolean;
  setIsCollectionDetailsInEditMode?: (val: boolean) => void;
}> = ({ collectionUrl, showEditButton, setIsCollectionDetailsInEditMode }) => {
  const intl: IntlShape = useIntl();
  const {
    data: collection,
    isError,
    isLoading,
    errorMsg,
  } = useGetCollection(collectionUrl);
  const excludeFromDetailsList: string[] = useMemo(() => {
    return collection?.excludeFromDetailList;
  }, [collection]);

  return (
    <InfoPanel
      titleId="COLLECTION_DETAILS"
      titleDefault="Collection Details"
      textOverrides={{ textAlign: "center" }}
      styleOverrides={{ maxHeight: 1000 }}
      includeCornerEditButton={showEditButton}
      setEditButton={setIsCollectionDetailsInEditMode}
    >
      {!isLoading && !isError && (
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
      )}
      {isLoading && <CircularProgress color="inherit" />}
      {isError && (
        <CustomError
          errorMsg={
            errorMsg ||
            intl.formatMessage({
              id: "COLLECTION_NOT_FOUND",
              defaultMessage: "Collection not found",
            })
          }
        />
      )}
    </InfoPanel>
  );
};

export default CollectionDetailsView;
