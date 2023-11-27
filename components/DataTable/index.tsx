import {
  DataGrid,
  GridColDef,
  GridRenderCellParams,
  GridRowsProp,
} from "@mui/x-data-grid";
import { reduce, map, get, camelCase } from "lodash-es";
import React, { useMemo } from "react";
import { populateWithActionButtons } from "../../utilities/dataTableUtils";
import InfoPanel from "../InfoPanel";
import InfoPanelBody from "../InfoPanel/InfoPanelBody";

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
  console.log(
    "deleteMe colNamesToDisplay entering the DataTable component are: "
  );
  console.log(colNamesToDisplay);
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

  const columns: GridColDef<{
    [key: string | number]: any;
  }>[] = useMemo(() => {
    const uniqueKeysObject: { [key: string]: any } = data.reduce(
      (result: any, obj: any) => {
        for (const key in obj) {
          if (Object.prototype.hasOwnProperty.call(obj, key)) {
            // checks whether object has the propery of whatever key is
            result[key] = true;
          }
        }
        return result;
      },
      {}
    );
    // console.log("deleteMe uniqueKeysObject are: ");
    // console.log(uniqueKeysObject);
    let prototypeRowWithOnlyDesiredCols: { [key: string]: any } =
      uniqueKeysObject;
    if (shouldFilter) {
      prototypeRowWithOnlyDesiredCols = reduce(
        uniqueKeysObject,
        (memo: {}, col: any, colKey: string) => {
          const safeToInclude: boolean = colNamesToDisplayKeys.includes(colKey);
          return safeToInclude ? { ...memo, [colKey]: col } : { ...memo };
        },
        {}
      );
    }
    let tracker: number = 0;
    return map(prototypeRowWithOnlyDesiredCols, (el, elKey) => {
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
    tableTitle,
    targetColIdxForUrlPath,
    modificationMethodForAction,
  ]);

  console.log("deleteMe columns is: ");
  console.log(columns);

  const rows: GridRowsProp = useMemo(() => {
    return data?.map((dataRow, idx) => {
      console.log("deleteMe dataRow is: ");
      console.log(dataRow);
      const rowData: { [key: string]: any } = {};
      columns.forEach((column) => {
        rowData[column.field] =
          dataRow[column.headerName] ||
          dataRow[column.headerName?.trim().toLowerCase()] ||
          dataRow[camelCase(column.headerName)];
      });

      // If you need to add an 'actions' field, do it here based on the column definition

      return { id: idx + 1, ...rowData };
    });
  }, [columns, data]);

  console.log("deleteMe rows is: ");
  console.log(rows);

  return (
    <>
      {data && data.length > 0 && (
        <>
          <InfoPanel titleId={tableTitle} titleDefault={tableTitle}>
            <InfoPanelBody>
              <DataGrid
                key={tableTitle}
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
            </InfoPanelBody>
          </InfoPanel>
        </>
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
