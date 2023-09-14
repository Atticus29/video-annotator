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
import { convertCamelCaseToCapitalCase } from "../../utilities/textUtils";

const Collections: React.FC = () => {
  const [localError, setLocalError] = useState<string>("");
  const { user, authError } = useFirebaseAuth();
  const { isLoading, isError, data, error } = useQuery(
    "collections",
    async () => {
      try {
        const userEmail: string = user?.email || "public@example.com";
        console.log("deleteMe userEmail is: ");
        console.log(userEmail);
        const response = await axios.get("/api/collections", {
          params: { email: userEmail },
        });
        console.log("deleteMe response is: ");
        console.log(response);
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

  console.log("deleteMe data is: ");
  console.log(data);
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

  const collectionDisplayKeys: string[] = Object.keys(get(tempData, [0], {}));
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
      {shouldShowTable && (
        <DataTable
          tableTitle="Testing"
          data={tempData}
          colNamesToDisplay={collectionDisplayCols || defaultDisplayCols}
          actionButtonsToDisplay={{ edit: "Edit", view: "View" }}
          styleOverrides={{ height: 1000 }}
        ></DataTable>
      )}
      {/* {localError && <CustomError errorMsg={localError} />}
      <Backdrop
        sx={{ color: "#fff", zIndex: (theme) => theme.zIndex.drawer + 1 }}
        open={open}
      >
        <CircularProgress color="inherit" />
      </Backdrop> */}
    </>
  );
};

export default Collections;
