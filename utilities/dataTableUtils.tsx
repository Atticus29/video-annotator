import { get } from "lodash-es";
import { generateComponent } from "./componentUtils";

export function populateWithActionButtons(
  tableTitle: string,
  params: {
    id: string | number;
    field: string;
    value?: string;
    linkId?: string;
    row?: any;
  },
  options?: {
    targetColIdxForUrlPath?: number;
    modificationMethodForAction?: (target: string) => string;
  }
) {
  // console.log("deleteMe options in populateWithActionButtons are: ");
  // console.log(options);
  console.log("deleteMe params in populateWithActionButtons are: ");
  console.log(params);
  const targetColIdxForUrlPath: number | undefined = get(
    options,
    "targetColIdxForUrlPath"
  );
  const modificationMethodForAction: ((target: string) => string) | undefined =
    get(options, "modificationMethodForAction");
  const rowId: number | string = params?.id || "";
  const field: string = params?.field || "";
  const actionButtonKeys: string[] = params?.value?.split(" ") || [];
  const row = params?.row;
  const target: string = get(row, "col" + targetColIdxForUrlPath) || "";
  const processedTarget: string = modificationMethodForAction
    ? modificationMethodForAction(target)
    : target;

  // console.log("deleteMe processedTarget is: ");
  // console.log(processedTarget);
  // console.log("deleteMe the other stuff is: ");
  // console.log(tableTitle + field + rowId);
  console.log("deleteMe actionButtonKeys are: ");
  console.log(actionButtonKeys);
  return (
    <>
      {actionButtonKeys.map((actionButtonKey) => {
        console.log("deleteMe actionButtonKey is: ");
        console.log(actionButtonKey);
        return generateComponent(
          actionButtonKey,
          tableTitle + field + rowId + actionButtonKey,
          (actionButtonKey === "Edit" ? "/collection/edit/" : "/collection/") +
            processedTarget
        );
      })}
    </>
  );
}
