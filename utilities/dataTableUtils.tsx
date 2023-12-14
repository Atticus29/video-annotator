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
  const processedTarget: string = modificationMethodForAction
    ? modificationMethodForAction(target)
    : target;

  return (
    <>
      {actionButtonKeys.map((actionButtonKey) => {
        const collectionUrl: string =
          (actionButtonKey === "Edit" ? "/collection/edit/" : "/collection/") +
          processedTarget;
        const videoId: string = get(options, ["linkIds", rowId - 1], "");
        const videoUrl: string =
          options?.linkIds && options?.linkUrls
            ? get(options, ["linkUrls", "view"], "") + videoId
            : "";
        const destinationUrl: string = videoUrl ? videoUrl : collectionUrl;

        return generateComponent(
          actionButtonKey,
          tableTitle + field + rowId + actionButtonKey,
          destinationUrl
        );
      })}
    </>
  );
}
