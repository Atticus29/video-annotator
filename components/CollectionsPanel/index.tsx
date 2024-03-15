import { Backdrop, CircularProgress } from "@mui/material";
import useFirebaseAuth from "../../hooks/useFirebaseAuth";
import useGetCollections from "../../hooks/useGetCollections";
import CustomError from "../CustomError";
import DataTable from "../DataTable";
import { useMemo } from "react";
import { map } from "lodash-es";
import { sanitizeString } from "../../utilities/textUtils";

const CollectionsPanel: React.FC<{
  collectionData?: {}[];
  titleId: string;
  tableTitle: string;
  colNamesToDisplay?: { [key: string]: any };
}> = ({ collectionData = [], titleId, tableTitle, colNamesToDisplay = {} }) => {
  const { user, authError } = useFirebaseAuth();
  const { isLoading, isError, data, errorMsg } = useGetCollections(
    user?.email || "public@example.com"
  );

  const collectionsMetadata: {}[] = useMemo(() => {
    const returnVal = map(
      data,
      (singleCollection) => singleCollection.metadata
    );
    console.log("deleteMe returnVal is: ");
    return map(data, (singleCollection) => singleCollection.metadata);
  }, [data]);

  return (
    <>
      {isLoading && <CircularProgress color="inherit" />}
      {(isError || authError) && (
        <CustomError errorMsg={errorMsg || authError} />
      )}
      {!isLoading && !isError && !authError && collectionsMetadata && (
        <DataTable
          tableTitleId={titleId}
          tableTitle={tableTitle}
          key={titleId}
          targetColNameForAction={"urlPath"}
          modificationMethodForAction={sanitizeString}
          targetColIdxForUrlPath={1} // 2 @TODO this is probably no longer needed?
          actionButtonsToDisplay={{ view: "View", edit: "Edit" }}
          data={
            collectionData?.length > 0 ? collectionData : collectionsMetadata
          }
          colNamesToDisplay={colNamesToDisplay}
        />
      )}
    </>
  );
};

export default CollectionsPanel;
