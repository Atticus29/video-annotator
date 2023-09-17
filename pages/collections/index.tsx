import { Backdrop, CircularProgress } from "@mui/material";
import axios from "axios";
import { get, map, reduce } from "lodash-es";
import { useEffect, useState } from "react";
import { useQuery } from "react-query";
import DataTable from "../../components/DataTable";
import CustomError from "../../components/Error";
import { excludeFromCollectionTableDisplay } from "../../constants";
import {
  shamCollection,
  shamCollection2,
} from "../../dummy_data/dummyCollection";
import useFirebaseAuth from "../../hooks/useFirebaseAuth";
import { Collection } from "../../types";
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
        console.log("deleteMe error is: ");
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
    console.log("deleteMe error is: ");
    console.log(error);
  }, [error]);

  useEffect(() => {
    console.log("deleteMe isError is: ");
    console.log(isError);
  }, [isError]);

  let tempData: Collection[] = [];
  for (let i = 0; i < 500; i++) {
    tempData.push(shamCollection);
  }
  tempData.push(shamCollection2);
  // console.log("deleteMe tempData is: ");
  // console.log(tempData);
  // const shouldShowTable: boolean = !isError && !isLoading && Boolean(data);
  const shouldShowTable: boolean = true; // deleteMe
  const defaultDisplayCols: {} = {
    name: "Collection name",
    createdBy: "Created By",
    dateCreated: "Date Created",
  };

  const collectionDisplayKeys: string[] = Object.keys(get(data, [0], {}));
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
  // console.log("deleteMe collectionDisplayCols is: ");
  // console.log(collectionDisplayCols);
  return (
    <>
      {!isLoading && !isError && (
        <DataTable
          tableTitle="Testing"
          data={data}
          colNamesToDisplay={collectionDisplayCols || defaultDisplayCols}
          actionButtonsToDisplay={{ edit: "Edit", view: "View" }}
          styleOverrides={{ height: 1000 }}
          // targetColNameForAction={"urlPath"}
          modificationMethodForAction={sanitizeString}
          targetColIdxForUrlPath={2}
        ></DataTable>
      )}
      {isError && <CustomError errorMsg={localError} />}
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
