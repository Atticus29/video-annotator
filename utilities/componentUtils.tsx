import { createElement } from "react";

import EditActionButton from "../components/EditActionButton";
import ViewActionButton from "../components/ViewActionButton";
import ViewCollectionActionButton from "../components/ViewCollectionActionButton";

export const componentMap: { [key: string]: any } = {
  Edit: EditActionButton,
  View: ViewActionButton,
  ViewCollection: ViewCollectionActionButton,
};

export function generateComponent(
  componentName: string,
  id: string | number,
  urlTarget?: string
) {
  console.log("deleteMe generateComponent entered");
  const Returncomponent = componentMap[componentName] || null;
  console.log("deleteMe Returncomponent is: ");
  console.log(Returncomponent);
  return createElement(Returncomponent, { id, key: id, urlTarget });
}
