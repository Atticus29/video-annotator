import { createElement } from "react";

import EditActionButton from "../components/EditActionButton";
import ViewActionButton from "../components/ViewActionButton";
import ViewCollectionActionButton from "../components/ViewCollectionActionButton";

export const componentMap: { [key: string]: any } = {
  Edit: EditActionButton,
  View: ViewActionButton,
  ViewCollection: ViewCollectionActionButton,
};

export function generateComponent(componentName: string, id: string | number) {
  const Returncomponent = componentMap[componentName] || null;
  return createElement(Returncomponent, { id, key: id });
}
