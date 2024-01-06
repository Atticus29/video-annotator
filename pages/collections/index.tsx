import { Backdrop, Button, CircularProgress } from "@mui/material";
import axios from "axios";
import { get, map, reduce } from "lodash-es";
import { useEffect, useMemo, useState } from "react";
import { useQuery } from "@tanstack/react-query";
import DataTable from "../../components/DataTable";
import CustomError from "../../components/Error";
import ViewCollectionActionButton from "../../components/ViewCollectionActionButton";
import { excludeFromCollectionTableDisplay } from "../../constants";
import useFirebaseAuth from "../../hooks/useFirebaseAuth";
import {
  convertCamelCaseToCapitalCase,
  sanitizeString,
} from "../../utilities/textUtils";
import useGetCollections from "../../hooks/useGetCollections";
import { FormattedMessage, IntlShape, useIntl } from "react-intl";
import router from "next/router";

const Collections: React.FC = () => {
  const intl: IntlShape = useIntl();
  const [localError, setLocalError] = useState<string>("");
  const { user, authError } = useFirebaseAuth();
  const { isLoading, isError, data, errorMsg } = useGetCollections(
    user?.email || "public@example.com"
  );

  const [open, setOpen] = useState<boolean>(isLoading);

  useEffect(() => {
    setOpen(isLoading);
  }, [isLoading]);

  useEffect(() => {
    console.log("Error is: ");
    console.log(errorMsg);
  }, [errorMsg]);

  useEffect(() => {
    console.log("isError is: "); // @TODO do something with this? Or de-duplicate the error useEffect
    console.log(isError);
  }, [isError]);

  const defaultDisplayCols: {} = {
    name: "Collection name",
    createdBy: "Created By",
    dateCreated: "Date Created",
  };

  const dataWithActions = useMemo(() => {
    const dataWithActionsAppended = map(data, (datum) => {
      return {
        ...datum,
        actions: "stand in",
      };
    });
    return dataWithActionsAppended;
  }, [data]);

  const collectionDisplayKeys: string[] = Object.keys(
    get(dataWithActions, [0], {})
  ); // @TODO revisit this; this only gets the first element's keys??
  const collectionDisplayCols: { [key: string]: any } = reduce(
    collectionDisplayKeys,

    (memo: {}, collectionDisplayKey: string, elIdx: number) => {
      let currentAddition: any = {};
      if (!excludeFromCollectionTableDisplay.includes(collectionDisplayKey)) {
        currentAddition[collectionDisplayKey] =
          convertCamelCaseToCapitalCase(collectionDisplayKey);
      }
      return {
        ...memo,
        ...currentAddition,
      };
    },
    {}
  );

  const handleNewCollectionClick: () => void = () => {
    router.push("/collection/new");
  };
  const tableTitle: string = intl.formatMessage({
    id: "COLLECTIONS",
    defaultMessage: "Collections",
  });

  return (
    <>
      {!isLoading && !isError && !localError! && (
        <>
          <DataTable
            tableTitle={tableTitle}
            data={dataWithActions}
            colNamesToDisplay={collectionDisplayCols || defaultDisplayCols}
            actionButtonsToDisplay={{ edit: "Edit", view: "View" }}
            targetColNameForAction={"urlPath"}
            modificationMethodForAction={sanitizeString}
            targetColIdxForUrlPath={2} // 2 @TODO this is probably no longer needed?
          ></DataTable>
          <Button
            data-testid={"new-collection-add-button"}
            variant="contained"
            onClick={handleNewCollectionClick}
            style={{ marginBottom: "1rem" }}
          >
            <FormattedMessage
              id="CREATE_NEW_COLLECTION"
              defaultMessage="Create New Collection"
            />
          </Button>
        </>
      )}
      {(isError || localError) && <CustomError errorMsg={localError} />}
      {isLoading && (
        <Backdrop
          sx={{ color: "#fff", zIndex: (theme) => theme.zIndex.drawer + 1 }}
          open={open}
        >
          <CircularProgress color="inherit" />
        </Backdrop>
      )}
    </>
  );
};

export default Collections;
