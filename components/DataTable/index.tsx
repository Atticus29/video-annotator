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
import { Typography } from "@mui/material";
import { FormattedMessage } from "react-intl";

const DataTable: React.FC<{
  tableTitle?: string;
  tableTitleId?: string;
  data: {}[];
  colNamesToDisplay: { [key: string]: any }; // @TODO make optional and have a way of deriving them from data as a fallback
  actionButtonsToDisplay?: { [key: string]: any };
  styleOverrides?: {};
  targetColNameForAction?: string;
  modificationMethodForAction?: (target: string) => string;
  targetColIdxForUrlPath?: number;
  loading?: boolean;
  linkUrls?: {};
  linkIds?: string[];
  dataGridOptions?: {};
  errorMsg?: string;
}> = ({
  tableTitle = "Untitled",
  tableTitleId = tableTitle,
  data,
  colNamesToDisplay = {},
  actionButtonsToDisplay = {},
  styleOverrides = {},
  targetColNameForAction,
  modificationMethodForAction,
  targetColIdxForUrlPath,
  loading = false,
  linkUrls = {},
  linkIds = [],
  dataGridOptions = {},
  errorMsg,
}) => {
  // console.log("deleteMe colNamesToDisplay are: ");
  // console.log(colNamesToDisplay);
  // console.log("deleteMe data is: ");
  // console.log(data);
  // Handle actionButton logic
  const actionButtonsKeys: string[] = useMemo(() => {
    return Object.keys(actionButtonsToDisplay) || [];
  }, [actionButtonsToDisplay]);
  // console.log("deleteMe actionButtonsKeys is: ");
  // console.log(actionButtonsKeys);

  const shouldAddActionButtons: boolean = useMemo(() => {
    return actionButtonsKeys.length > 0;
  }, [actionButtonsKeys]);
  // console.log("deleteMe shouldAddActionButtons is: " + shouldAddActionButtons);

  const colNamesToDisplayDoesNotHaveActions: boolean = useMemo(() => {
    const result: boolean =
      Object.keys(colNamesToDisplay).includes("actions") ||
      Object.keys(colNamesToDisplay).includes("Actions")
        ? false
        : true;
    return result;
  }, [colNamesToDisplay]);
  // console.log("deleteMe colNamesToDisplayDoesNotHaveActions is: ");
  // console.log(colNamesToDisplayDoesNotHaveActions);

  const colNamesToDisplayActionsRetrofit: { [key: string]: any } =
    useMemo(() => {
      if (
        colNamesToDisplayDoesNotHaveActions &&
        Object.keys(actionButtonsKeys).length > 0
      ) {
        console.log("deleteMe this happens a5");
        return { ...colNamesToDisplay, actions: "actions" };
      } else {
        return colNamesToDisplay;
      }
    }, [
      actionButtonsKeys,
      colNamesToDisplay,
      colNamesToDisplayDoesNotHaveActions,
    ]);
  // console.log("deleteMe colNamesToDisplayActionsRetrofit is: ");
  // console.log(colNamesToDisplayActionsRetrofit);

  // end handle actioButton logic

  const colNamesToDisplayKeys: string[] = useMemo(() => {
    const returnVal: string[] = colNamesToDisplayActionsRetrofit
      ? [...Object.keys(colNamesToDisplayActionsRetrofit), "_id"]
      : [];

    return returnVal;
  }, [colNamesToDisplayActionsRetrofit]);
  console.log("deleteMe colNamesToDisplayKeys is: ");
  console.log(colNamesToDisplayKeys);

  const shouldFilter: boolean = useMemo(() => {
    return colNamesToDisplayKeys.length > 0;
  }, [colNamesToDisplayKeys]);
  console.log("deleteMe shouldFilter is: " + shouldFilter);

  const columns: GridColDef<{
    [key: string | number]: any;
  }>[] = useMemo(() => {
    let uniqueKeysObject: { [key: string]: any } = data?.reduce(
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

    let prototypeRowWithOnlyDesiredColsAndActions = {
      ...prototypeRowWithOnlyDesiredCols,
    };
    console.log("deleteMe prototypeRowWithOnlyDesiredColsAndActions is: ");
    console.log(prototypeRowWithOnlyDesiredColsAndActions);
    let tracker: number = 0;
    return map(prototypeRowWithOnlyDesiredColsAndActions, (el, elKey) => {
      tracker++; // tracker seems needed because I can't get both the keys and the indexes in lodash map(obj)
      const cleanHeader: string = elKey.trim().toLowerCase(); // @TODO use capitalizeEachWord utili here instead of the cleanHeader.slice(1) below??
      console.log("deleteMe cleanHeader is: ");
      console.log(cleanHeader);
      console.log("deleteMe elKey is: ");
      console.log(elKey);
      console.log("deleteMe colNamesToDisplayActionsRetrofit is: ");
      console.log(colNamesToDisplayActionsRetrofit);

      const headerName: string =
        colNamesToDisplayActionsRetrofit[elKey] ||
        cleanHeader.charAt(0).toUpperCase() + cleanHeader.slice(1);
      console.log("deleteMe headerName is: ");
      console.log(headerName);

      const returnVal: GridColDef<{
        [key: string | number]: any | null;
      }> = {
        field: "col" + tracker,
        headerName: headerName,
        renderCell:
          headerName === "Actions"
            ? (params: GridRenderCellParams) => {
                return populateWithActionButtons(tableTitleId, params, {
                  targetColIdxForUrlPath: targetColIdxForUrlPath,
                  modificationMethodForAction: modificationMethodForAction,
                  linkUrls: linkUrls,
                  linkIds: linkIds,
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
    colNamesToDisplayActionsRetrofit,
    tableTitleId,
    targetColIdxForUrlPath,
    modificationMethodForAction,
    linkUrls,
    linkIds,
  ]);

  const rows: GridRowsProp = useMemo(() => {
    return data?.map((dataRow: any, idx) => {
      const rowData: { [key: string]: any } = {};
      if (shouldAddActionButtons) {
        dataRow["actions"] = null; // reset upon every run
        actionButtonsKeys.forEach((actionButtonKey) => {
          const alreadyHasValues: boolean = dataRow["actions"] !== null;
          dataRow["actions"] = alreadyHasValues
            ? dataRow["actions"] + " " + actionButtonsToDisplay[actionButtonKey]
            : actionButtonsToDisplay[actionButtonKey];
        });
      }

      columns.forEach((column) => {
        const headerName: string = get(column, "headerName") || "";
        rowData[column.field] =
          get(dataRow, headerName) ||
          get(dataRow, headerName?.trim()?.toLowerCase()) ||
          get(dataRow, camelCase(headerName));
      });

      return { id: idx + 1, ...rowData };
    });
  }, [
    actionButtonsKeys,
    actionButtonsToDisplay,
    columns,
    data,
    shouldAddActionButtons,
  ]);

  // console.log("deleteMe rows is: ");
  // console.log(rows);
  // console.log("deleteMe columns is: ");
  // console.log(columns);

  return (
    <>
      {data && data.length > 0 && (
        <>
          <InfoPanel titleId={tableTitleId} titleDefault={tableTitle}>
            <InfoPanelBody>
              <DataGrid
                key={tableTitleId}
                rows={rows}
                rowHeight={40}
                columns={columns}
                autoHeight={true}
                initialState={{
                  pagination: { paginationModel: { pageSize: 5 } },
                }}
                pageSizeOptions={[5, 10, 25]}
                style={{
                  marginBottom: "2vh",
                  ...styleOverrides,
                }}
                loading={loading}
                checkboxSelection={get(dataGridOptions, ["checkboxSelection"])}
                disableRowSelectionOnClick={get(dataGridOptions, [
                  "disableRowSelectionOnClick",
                ])}
                onRowSelectionModelChange={get(dataGridOptions, [
                  "onRowSelectionModelChange",
                ])}
              />
            </InfoPanelBody>
          </InfoPanel>
        </>
      )}
      {(!data || data.length < 1) && (
        <InfoPanel titleId={tableTitleId || ""} titleDefault={tableTitle || ""}>
          <Typography variant="body1">
            {errorMsg && <Typography> {errorMsg}</Typography>}
            {!errorMsg && (
              <FormattedMessage
                id={"THIS_TABLE_HAS_NO_DATA_YET"}
                defaultMessage={"This table has no data yet"}
              />
            )}
          </Typography>
        </InfoPanel>
      )}
    </>
  );
};

export default DataTable;
