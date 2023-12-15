import {
  Backdrop,
  Button,
  CircularProgress,
  Dialog,
  DialogContent,
  DialogContentText,
  DialogTitle,
} from "@mui/material";
import axios from "axios";
import { get, map, reduce } from "lodash-es";
import { NextRouter, useRouter } from "next/router";
import { useEffect, useMemo, useState } from "react";
import { FormattedMessage, IntlShape, useIntl } from "react-intl";
import { QueryFunctionContext, useQuery, useQueryClient } from "react-query";
import CollectionDetailsView from "../../../components/CollectionDetailsView";
import DataTable from "../../../components/DataTable";
import CustomError from "../../../components/Error";
import IndividualIntake from "../../../components/IndividualIntake";
import VideoIntake from "../../../components/VideoIntake";
import { excludeFromCollectionTableDisplay } from "../../../constants";
import useGetCollection from "../../../hooks/useGetCollection";
import { convertCamelCaseToCapitalCase } from "../../../utilities/textUtils";

const CollectionView: React.FC = () => {
  const queryClient = useQueryClient();
  const router: NextRouter = useRouter();
  const intl: IntlShape = useIntl();
  const localUrlPath: string | string[] | undefined = router.query.urlPath;
  let localUrlPathAsString: string =
    (Array.isArray(localUrlPath) ? localUrlPath.join() : localUrlPath) || "";
  const [calculatedHeight, setCalculatedHeight] = useState<number>(9.4);
  const [calculatedIndividualTableHeight, setCalculatedIndividualTableHeight] =
    useState<number>(9.4);
  const [showCollection, setShowCollection] = useState<boolean>(false);
  const { isLoading, isError, data, error } =
    useGetCollection(localUrlPathAsString);

  const [open, setOpen] = useState<boolean>(true);
  const [createVideoDialogOpen, setCreateVideoDialogOpen] =
    useState<boolean>(false);
  const [createIndividualDialogOpen, setCreateIndividualDialogOpen] =
    useState<boolean>(false);

  const dataWithActions = useMemo(() => {
    let dataWithActionsAppended = [];
    if (data && data?.videos) {
      dataWithActionsAppended = map(data.videos, (datum) => {
        return {
          ...datum,
          actions: "stand in",
        };
      });
    }
    return dataWithActionsAppended;
  }, [data]);

  const individualDataWithActions = useMemo(() => {
    let individualDataWithActionsAppended = [];
    if (data && data?.individuals) {
      individualDataWithActionsAppended = map(data.individuals, (datum) => {
        return {
          ...datum,
          actions: "stand in",
        };
      });
    }
    return individualDataWithActionsAppended;
  }, [data]);

  const linkIds = useMemo(() => {
    if (data && data?.videos) {
      return map(data.videos, (datum) => {
        return datum.id;
      });
    }
  }, [data]);

  const individualLinkIds = useMemo(() => {
    if (data && data?.individuals) {
      return map(data.individuals, (datum) => {
        return datum.id;
      });
    }
  }, [data]);

  useEffect(() => {
    setOpen(isLoading);
    if (!isLoading && !isError && data) {
      const numRows: number = data?.videos?.length || 1;
      setCalculatedHeight(9.4 + 2.51 * (numRows - 1));

      const numIndividualsRows: number = data?.individuals?.length || 1;
      setCalculatedIndividualTableHeight(9.4 + 2.51 * (numIndividualsRows - 1));
    }
    if (!isLoading && !isError && data) {
      setShowCollection(true);
    }
    if (!isLoading && !isError && !data) {
      setShowCollection(false);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isLoading, data, isError, createVideoDialogOpen]);

  const handleNewVideoClick = () => {
    setCreateVideoDialogOpen(true);
  };

  const handleNewIndividualClick = () => {
    setCreateIndividualDialogOpen(true);
  };

  const handleCreateVideoDialogClose = () => {
    // @TODO can combine this with handleCreateIndividualDialogClose
    setCreateVideoDialogOpen(false);
    const queryKey = ["singleCollection", localUrlPathAsString];
    const queryCache = queryClient.getQueryCache();
    let queryState = queryCache.find(queryKey);
    if (queryState) {
      console.log(`Before Query with key ${queryKey} is in the cache.`);
    } else {
      console.log(`Before Query with key ${queryKey} is NOT in the cache.`);
    }
    // queryClient.invalidateQueries();
    queryClient.invalidateQueries({
      queryKey: queryKey,
    });
    queryState = queryCache.find(queryKey);
    if (queryState) {
      console.log(`After Query with key ${queryKey} is in the cache.`);
    } else {
      console.log(`After Query with key ${queryKey} is NOT in the cache.`);
    }
  };

  const handleCreateIndividualDialogClose = () => {
    // @TODO can combine this with handleCreateVideoDialogClose
    setCreateIndividualDialogOpen(false);
    const queryKey = ["singleCollection", localUrlPathAsString];
    const queryCache = queryClient.getQueryCache();
    let queryState = queryCache.find(queryKey);
    if (queryState) {
      console.log(`Before Query with key ${queryKey} is in the cache.`);
    } else {
      console.log(`Before Query with key ${queryKey} is NOT in the cache.`);
    }
    // queryClient.invalidateQueries();
    queryClient.invalidateQueries({
      queryKey: queryKey,
    });
    queryState = queryCache.find(queryKey);
    if (queryState) {
      console.log(`After Query with key ${queryKey} is in the cache.`);
    } else {
      console.log(`After Query with key ${queryKey} is NOT in the cache.`);
    }
  };

  const colNamesToDisplay: {} = useMemo(() => {
    if (dataWithActions && data?.videoIntakeQuestions) {
      return reduce(
        data?.videoIntakeQuestions,
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
  }, [data?.videoIntakeQuestions, dataWithActions]);

  const colNamesToDisplayWithActions = {
    ...colNamesToDisplay,
    actions: "Actions",
  };

  const individualColNamesToDisplay: {} = useMemo(() => {
    if (individualDataWithActions && data?.individualIntakeQuestions) {
      return reduce(
        data?.individualIntakeQuestions,
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
  }, [data?.individualIntakeQuestions, individualDataWithActions]);

  const individualColNamesToDisplayWithActions = {
    ...individualColNamesToDisplay,
    actions: "Actions",
  };

  const videosFallback: string = intl.formatMessage({ id: "VIDEOS" });
  const individualsFallback: string = intl.formatMessage({
    id: "INDIVIDUALS_PLURAL",
  });

  return (
    <>
      {isLoading && (
        <Backdrop
          sx={{ color: "#fff", zIndex: (theme) => theme.zIndex.drawer + 1 }}
          open={open}
        >
          <CircularProgress color="inherit" />
        </Backdrop>
      )}
      {showCollection && (
        <>
          <CollectionDetailsView
            collection={data}
            showEditButton={false}
          ></CollectionDetailsView>

          {/* Video creation */}
          <Dialog
            open={createVideoDialogOpen}
            onClose={handleCreateVideoDialogClose}
          >
            <DialogContent>
              <VideoIntake
                collection={data}
                onCloseDialog={handleCreateVideoDialogClose}
              ></VideoIntake>
            </DialogContent>
          </Dialog>
          <DataTable
            tableTitle={data?.nameOfVideoPlural || videosFallback}
            data={dataWithActions}
            colNamesToDisplay={colNamesToDisplayWithActions}
            actionButtonsToDisplay={{ view: "View" }}
            targetColIdxForUrlPath={0}
            styleOverrides={{
              minHeight: 0,
              height: calculatedHeight + "rem",
            }}
            linkUrls={{
              view: "/collection/" + localUrlPathAsString + "/video/",
            }}
            linkIds={linkIds}
          ></DataTable>
          <Button
            data-testid={"new-video-add-button"}
            variant="contained"
            onClick={handleNewVideoClick}
            style={{ marginBottom: "1rem" }}
          >
            <FormattedMessage
              id="ADD_NEW_VIDEO_TO_COLLECTION"
              defaultMessage="Add New {videoName}"
              values={{ videoName: data?.nameOfVideo }}
            />
          </Button>

          {/* Individual creation */}
          <Dialog
            open={createIndividualDialogOpen}
            onClose={handleCreateIndividualDialogClose}
          >
            <DialogContent>
              <IndividualIntake
                collection={data}
                onCloseDialog={handleCreateIndividualDialogClose}
              ></IndividualIntake>
            </DialogContent>
          </Dialog>
          <DataTable
            tableTitle={data?.nameOfIndividualPlural || individualsFallback}
            data={individualDataWithActions}
            colNamesToDisplay={individualColNamesToDisplayWithActions}
            actionButtonsToDisplay={{ view: "View" }}
            targetColIdxForUrlPath={0}
            styleOverrides={{
              minHeight: 0,
              height: calculatedIndividualTableHeight + "rem",
              maxHeight: "50vh",
            }}
            linkUrls={{
              view: "/collection/" + localUrlPathAsString + "/individual/",
            }}
            linkIds={individualLinkIds}
          ></DataTable>
          <Button
            data-testid={"new-video-add-button"}
            variant="contained"
            onClick={handleNewIndividualClick}
          >
            <FormattedMessage
              id="ADD_NEW_INDIVIDUAL_TO_COLLECTION"
              defaultMessage="Add New {individualName}"
              values={{ individualName: data?.nameOfIndividual }}
            />
          </Button>
        </>
      )}
      {!open && !showCollection && (
        <CustomError
          errorMsg={intl.formatMessage({
            id: "COLLECTION_NOT_FOUND",
            defaultMessage: "Collection not found",
          })}
        />
      )}
    </>
  );
};

export default CollectionView;
