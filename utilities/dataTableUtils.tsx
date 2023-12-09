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
    linkUrls?: {};
    linkIds?: string[];
  }
) {
  // console.log("deleteMe options in populateWithActionButtons are: ");
  // console.log(options);
  // console.log("deleteMe params in populateWithActionButtons are: ");
  // console.log(params);
  const targetColIdxForUrlPath: number | undefined = get(
    options,
    "targetColIdxForUrlPath"
  );
  const modificationMethodForAction: ((target: string) => string) | undefined =
    get(options, "modificationMethodForAction");
  const rowId: number = Number(params?.id) || 0;
  const field: string = params?.field || "";
  const actionButtonKeys: string[] = params?.value?.split(" ") || [];
  const row = params?.row;
  const target: string = get(row, "col" + targetColIdxForUrlPath) || "";
  // console.log("deleteMe target is: ");
  // console.log(target);
  const processedTarget: string = modificationMethodForAction
    ? modificationMethodForAction(target)
    : target;

  // console.log("deleteMe processedTarget is: ");
  // console.log(processedTarget);
  // console.log("deleteMe the other stuff is: ");
  // console.log(tableTitle + field + rowId);
  // console.log("deleteMe rowId is: ");
  // console.log(rowId);
  // console.log("deleteMe actionButtonKeys are: ");
  // console.log(actionButtonKeys);
  return (
    <>
      {actionButtonKeys.map((actionButtonKey) => {
        const collectionUrl: string =
          (actionButtonKey === "Edit" ? "/collection/edit/" : "/collection/") +
          processedTarget;
        console.log("deleteMe collectionUrl is; ");
        console.log(collectionUrl);
        const videoId: string = get(options, ["linkIds", rowId - 1], "");
        const videoUrl: string =
          options?.linkIds && options?.linkUrls
            ? get(options, ["linkUrls", "view"], "") + videoId
            : "";
        console.log("deleteMe videoUrl is: ");
        console.log(videoUrl);
        const destinationUrl: string = videoUrl ? videoUrl : collectionUrl;
        console.log("deleteMe destinationUrl is: ");
        console.log(destinationUrl);

        return generateComponent(
          actionButtonKey,
          tableTitle + field + rowId + actionButtonKey,
          destinationUrl
        );
      })}
    </>
  );
}
