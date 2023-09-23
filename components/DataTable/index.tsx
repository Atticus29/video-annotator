import {
  DataGrid,
  GridColDef,
  GridRenderCellParams,
  GridRowsProp,
} from "@mui/x-data-grid";
import { reduce, map, get } from "lodash-es";
import React, { useMemo } from "react";
import { populateWithActionButtons } from "../../utilities/dataTableUtils";
import InfoPanel from "../InfoPanel";

const DataTable: React.FC<{
  tableTitle: string;
  data: {}[];
  colNamesToDisplay?: { [key: string]: any };
  actionButtonsToDisplay?: { [key: string]: any };
  styleOverrides?: {};
  targetColNameForAction?: string;
  modificationMethodForAction?: (target: string) => string;
  targetColIdxForUrlPath?: number;
  loading?: boolean;
}> = ({
  tableTitle,
  data,
  colNamesToDisplay = {},
  actionButtonsToDisplay = {},
  styleOverrides = {},
  targetColNameForAction,
  modificationMethodForAction,
  targetColIdxForUrlPath,
  loading = false,
}) => {
  const actionButtonsKeys: string[] = useMemo(() => {
    return Object.keys(actionButtonsToDisplay) || [];
  }, [actionButtonsToDisplay]);

  const shouldAddActionButtons: boolean = useMemo(() => {
    return actionButtonsKeys.length > 0;
  }, [actionButtonsKeys]);

  let colNamesToDisplayWithActions: { [key: string]: any } = colNamesToDisplay;
  if (shouldAddActionButtons) {
    colNamesToDisplayWithActions["actions"] = "Actions";
  }

  const colNamesToDisplayKeys: string[] = useMemo(() => {
    return [...Object.keys(colNamesToDisplayWithActions), "_id"] || [];
  }, [colNamesToDisplayWithActions]);

  const shouldFilter: boolean = useMemo(() => {
    return colNamesToDisplayKeys.length > 0;
  }, [colNamesToDisplayKeys]);

  const rows: GridRowsProp = useMemo(() => {
    return data?.map((dataRow, idx) => {
      let dataRowWithOnlyDesiredCols: { [key: string]: any } = dataRow;
      if (shouldAddActionButtons) {
        dataRowWithOnlyDesiredCols["actions"] = null; // reset upon every run
        actionButtonsKeys.forEach((actionButtonKey) => {
          // just add the actionButtonKey for the componentMap to use later in columns definition
          const alreadyHasValues: boolean =
            dataRowWithOnlyDesiredCols["actions"] !== null;
          dataRowWithOnlyDesiredCols["actions"] = alreadyHasValues
            ? dataRowWithOnlyDesiredCols["actions"] +
              " " +
              actionButtonsToDisplay[actionButtonKey]
            : actionButtonsToDisplay[actionButtonKey];
        });
      }
      if (shouldFilter) {
        dataRowWithOnlyDesiredCols = reduce(
          dataRow,
          (memo: {}, col: any, colKey: string) => {
            const safeToInclude: boolean =
              colNamesToDisplayKeys.includes(colKey);
            return safeToInclude ? { ...memo, [colKey]: col } : { ...memo };
          },
          {}
        );
      }
      const renamedDataRow: { [key: string]: any } = reduce(
        // can't include in above reduce because this time I need the index number and lodash reduce won't track index and key of objects
        Object.values(dataRowWithOnlyDesiredCols),
        (memo: {}, el: any, elIdx: number) => {
          const colNum: number = elIdx + 1;
          return { ...memo, ["col" + colNum]: el };
        },
        {}
      );
      return { id: idx + 1, ...renamedDataRow };
    });
  }, [
    actionButtonsKeys,
    actionButtonsToDisplay,
    colNamesToDisplayKeys,
    data,
    shouldAddActionButtons,
    shouldFilter,
  ]);

  const columns: GridColDef<{
    [key: string | number]: any;
  }>[] = useMemo(() => {
    const safePrototypeRow: { [key: string]: any } = get(data, [0]) || {}; // assumes that the first row of the data has all of the columns desired (i.e., that it's a good prototype to use)
    let prototypeRowWithOnlyDesiredCols: { [key: string]: any } =
      safePrototypeRow;
    if (shouldFilter) {
      prototypeRowWithOnlyDesiredCols = reduce(
        safePrototypeRow,
        (memo: {}, col: any, colKey: string) => {
          const safeToInclude: boolean = colNamesToDisplayKeys.includes(colKey);
          return safeToInclude ? { ...memo, [colKey]: col } : { ...memo };
        },
        {}
      );
    }
    let tracker: number = 0;
    return map(prototypeRowWithOnlyDesiredCols, (el, elKey) => {
      // console.log("deleteMe el is: ");
      // console.log(el);
      // console.log("deleteMe elKey is: ");
      // console.log(elKey);
      tracker++; // tracker seems needed because I can't get both the keys and the indexes in lodash map(obj)
      const cleanHeader: string = elKey.trim().toLowerCase(); // @TODO use capitalizeEachWord utili here

      const headerName: string =
        colNamesToDisplay[elKey] ||
        cleanHeader.charAt(0).toUpperCase() + cleanHeader.slice(1);
      // var linkId: string = "";
      // if (
      //   targetColNameForAction &&
      //   modificationMethodForAction &&
      //   targetColNameForAction === elKey
      // ) {
      //   linkId = modificationMethodForAction(el);
      //   console.log("deleteMe got here b1 and linkId is now: ");
      //   console.log(linkId);
      // }

      const returnVal: GridColDef<{
        [key: string | number]: any | null;
      }> = {
        field: "col" + tracker,
        headerName: headerName,
        renderCell:
          headerName === "Actions"
            ? (params: GridRenderCellParams) => {
                return populateWithActionButtons(tableTitle, params, {
                  targetColIdxForUrlPath: targetColIdxForUrlPath,
                  modificationMethodForAction: modificationMethodForAction,
                });
              }
            : undefined,
        width: 200,
      };
      return returnVal;
    });
  }, [
    data,
    shouldFilter,
    colNamesToDisplayKeys,
    colNamesToDisplay,
    targetColNameForAction,
    modificationMethodForAction,
    tableTitle,
  ]);

  return (
    <>
      {data && data.length > 0 && (
        <DataGrid
          key={tableTitle} // @TODO add title to this
          rows={rows}
          rowHeight={40}
          columns={columns}
          style={{
            minHeight: 200,
            marginBottom: "2vh",
            ...styleOverrides,
          }}
          loading={loading}
        />
      )}
      {(!data || data.length < 1) && (
        <InfoPanel
          titleId={"THIS_TABLE_HAS_NO_DATA_YET"}
          titleDefault={"This table has no data yet"}
        ></InfoPanel>
      )}
    </>
  );
};

export default DataTable;
