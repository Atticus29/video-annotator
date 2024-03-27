import { get, reduce } from "lodash-es";
import useGetEvents from "../../hooks/useGetEvents";
import DataTable from "../DataTable";
import useGetCollection from "../../hooks/useGetCollection";
import { useMemo } from "react";
import { CircularProgress } from "@mui/material";

const EventTableView: React.FC<{
  videoData: any;
  collectionUrl: string;
}> = ({ collectionUrl, videoData }) => {
  const {
    data: events,
    isLoading: isLoadingEvents,
    isError: isErrorEvents,
    error: eventsError,
  } = useGetEvents(collectionUrl, get(videoData, ["id"]));

  const {
    data: collection,
    isLoading: isCollectionLoading, //@TODO implement
    isError: isCollectionError,
    errorMsg: collectionErrorMsg,
  } = useGetCollection(collectionUrl);

  const colNamesToDisplay: {} = useMemo(() => {
    if (get(collection, ["eventIntakeQuestions"])) {
      return reduce(
        collection?.eventIntakeQuestions,
        (memo: {}, intakeQuestion: any) => {
          return {
            ...memo,
            [intakeQuestion?.label]: intakeQuestion?.label,
          };
        },
        {}
      );
    } else {
      return {};
    }
  }, [collection]);

  const colNamesToDisplayWithActions = {
    ...colNamesToDisplay,
    actions: "Actions",
  };

  return (
    <>
      {isCollectionLoading && <CircularProgress color="inherit" />}
      {!isCollectionLoading && collection && (
        <section style={{ marginLeft: "1rem" }}>
          <DataTable
            tableTitle={collection?.metadata?.nameOfEventPlural}
            data={events}
            loading={isLoadingEvents}
            errorMsg={eventsError?.message}
            colNamesToDisplay={colNamesToDisplayWithActions}
          />
        </section>
      )}
    </>
  );
};

export default EventTableView;
