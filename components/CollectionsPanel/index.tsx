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
    const returnVal = map(data, (singleCollection) => {
      return {
        ...singleCollection.metadata,
        collectionName: singleCollection.metadata.name, // because Collection Name is in colNamesToDisplay but there is no key matching the camel case version of the that in the collectiond data, we have to create one
        actions: "stand in",
      };
    });

    return returnVal;
  }, [data]);

  const tableData: {}[] =
    collectionData?.length > 0 ? collectionData : collectionsMetadata;
  // console.log("deleteMe tableData is: ");
  // console.log(tableData);
  // console.log("deleteMe colNamesToDisplay is: ");
  // console.log(colNamesToDisplay);

  return (
    <>
      {isLoading && <CircularProgress color="inherit" />}
      {(isError || authError) && (
        <CustomError errorMsg={errorMsg || authError} />
      )}
      {!isLoading && !isError && !authError && collectionsMetadata && (
        <DataTable
          key={titleId}
          tableTitleId={titleId}
          tableTitle={tableTitle}
          data={tableData}
          colNamesToDisplay={colNamesToDisplay}
          actionButtonsToDisplay={{ view: "View" }}
          targetColNameForAction={"urlPath"}
          modificationMethodForAction={sanitizeString}
          targetColIdxForUrlPath={1} // 2 @TODO this is probably no longer needed?
        />
      )}
    </>
  );
};

export default CollectionsPanel;
