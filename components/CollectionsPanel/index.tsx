import DataTable from "../DataTable";

const CollectionsPanel: React.FC<{
  collectionData: {}[];
  titleId: string;
  titleDefault: string;
  colNamesToDisplay?: { [key: string]: any };
}> = ({ collectionData, titleId, titleDefault, colNamesToDisplay = {} }) => {
  return (
    <DataTable
      tableTitle={titleId}
      key={titleId}
      data={collectionData}
      colNamesToDisplay={colNamesToDisplay}
      actionButtonsToDisplay={{ edit: "Edit", view: "View" }}
    />
  );
};

export default CollectionsPanel;
