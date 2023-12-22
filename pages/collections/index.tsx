import { Backdrop, CircularProgress } from "@mui/material";
import axios from "axios";
import { get, map, reduce } from "lodash-es";
import { useEffect, useMemo, useState } from "react";
import { useQuery } from "react-query";
import DataTable from "../../components/DataTable";
import CustomError from "../../components/Error";
import ViewCollectionActionButton from "../../components/ViewCollectionActionButton";
import { excludeFromCollectionTableDisplay } from "../../constants";
import useFirebaseAuth from "../../hooks/useFirebaseAuth";
import {
  convertCamelCaseToCapitalCase,
  sanitizeString,
} from "../../utilities/textUtils";

const Collections: React.FC = () => {
  const [localError, setLocalError] = useState<string>("");
  const { user, authError } = useFirebaseAuth();
  const { isLoading, isError, data, error } = useQuery(
    "collections",
    async () => {
      try {
        const userEmail: string = user?.email || "public@example.com";
        const response = await axios.get("/api/collections", {
          params: { email: userEmail },
        });
        return response?.data;
      } catch (e: any) {
        console.log("Error is: ");
        console.log(e);
        setLocalError(e?.message);
      }
    }
  );

  const [open, setOpen] = useState<boolean>(isLoading);

  useEffect(() => {
    setOpen(isLoading);
  }, [isLoading]);

  useEffect(() => {
    console.log("Error is: ");
    console.log(error);
  }, [error]);

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

  return (
    <>
      {!isLoading && !isError && !localError! && (
        <DataTable
          tableTitle="Testing"
          data={dataWithActions}
          colNamesToDisplay={collectionDisplayCols || defaultDisplayCols}
          actionButtonsToDisplay={{ edit: "Edit", view: "View" }}
          styleOverrides={{ height: 1000 }} // @TODO make this look better
          targetColNameForAction={"urlPath"}
          modificationMethodForAction={sanitizeString}
          targetColIdxForUrlPath={2} // 2
        ></DataTable>
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
