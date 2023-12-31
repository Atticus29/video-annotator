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
import {
  QueryFunctionContext,
  useQuery,
  useQueryClient,
} from "@tanstack/react-query";
import CollectionDetailsView from "../../../components/CollectionDetailsView";
import DataTable from "../../../components/DataTable";
import CustomError from "../../../components/Error";
import IndividualIntake from "../../../components/IndividualIntake";
import VideoIntake from "../../../components/VideoIntake";
import { excludeFromCollectionTableDisplay } from "../../../constants";
import useGetCollection from "../../../hooks/useGetCollection";
import useGetIndividuals from "../../../hooks/useGetIndividuals";
import { convertCamelCaseToCapitalCase } from "../../../utilities/textUtils";
import IndividualsTableView from "../../../components/IndividualsTableView";

const CollectionView: React.FC = () => {
  const queryClient = useQueryClient();
  const router: NextRouter = useRouter();
  const intl: IntlShape = useIntl();
  const localUrlPath: string | string[] | undefined = router.query.urlPath;
  let localUrlPathAsString: string =
    (Array.isArray(localUrlPath) ? localUrlPath.join() : localUrlPath) || "";
  const [calculatedHeight, setCalculatedHeight] = useState<number>(9.4);
  // const [calculatedIndividualTableHeight, setCalculatedIndividualTableHeight] =
  //   useState<number>(9.4);
  const [showCollection, setShowCollection] = useState<boolean>(false);
  // const {
  //   isLoading: isLoadingIndividuals,
  //   isError: isErrorIndividuals,
  //   data: individualsData,
  //   errorMsg: errorMsgIndividuals,
  // } = useGetIndividuals(localUrlPathAsString);

  const {
    isLoading: isLoadingCollection,
    isError: isErrorCollection,
    data: collectionData,
    errorMsg: collectionErrorMsg,
  } = useGetCollection(localUrlPathAsString);

  const [open, setOpen] = useState<boolean>(true);
  const [createVideoDialogOpen, setCreateVideoDialogOpen] =
    useState<boolean>(false);
  const [createIndividualDialogOpen, setCreateIndividualDialogOpen] =
    useState<boolean>(false);

  const dataWithActions = useMemo(() => {
    let dataWithActionsAppended = [];
    if (collectionData && collectionData?.videos) {
      dataWithActionsAppended = map(collectionData.videos, (datum) => {
        return {
          ...datum,
          actions: "stand in",
        };
      });
    }
    return dataWithActionsAppended;
  }, [collectionData]);

  // const individualDataWithActions = useMemo(() => {
  //   let individualDataWithActionsAppended: any[] = [];
  //   if (individualsData) {
  //     individualDataWithActionsAppended = map(individualsData, (datum: {}) => {
  //       return {
  //         ...datum,
  //         actions: "stand in",
  //       };
  //     });
  //   }
  //   return individualDataWithActionsAppended;
  // }, [individualsData]);

  const linkIds = useMemo(() => {
    if (collectionData && collectionData?.videos) {
      return map(collectionData.videos, (datum) => {
        return datum.id;
      });
    }
  }, [collectionData]);

  // const individualLinkIds = useMemo(() => {
  //   if (individualsData) {
  //     return map(individualsData, (datum) => {
  //       return get(datum, ["id"]);
  //     });
  //   }
  // }, [individualsData]);

  useEffect(() => {
    setOpen(isLoadingCollection);
    if (!isLoadingCollection && !isErrorCollection && collectionData) {
      const numRows: number = collectionData?.videos?.length || 1;
      setCalculatedHeight(9.4 + 2.51 * (numRows - 1));

      // const numIndividualsRows: number =
      //   collectionData?.individuals?.length || 1;
      // setCalculatedIndividualTableHeight(9.4 + 2.51 * (numIndividualsRows - 1));
    }
    if (!isLoadingCollection && !isErrorCollection && collectionData) {
      setShowCollection(true);
    }
    if (!isLoadingCollection && !isErrorCollection && !collectionData) {
      setShowCollection(false);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [
    isLoadingCollection,
    collectionData,
    isErrorCollection,
    createVideoDialogOpen,
  ]);

  const handleNewVideoClick = () => {
    setCreateVideoDialogOpen(true);
  };

  const handleNewIndividualClick = () => {
    const queryKey = ["individualsFor", localUrlPathAsString];
    queryClient.invalidateQueries({ queryKey: queryKey });
    setCreateIndividualDialogOpen(true);
  };

  const handleCreateVideoDialogClose = () => {
    // @TODO can combine this with handleCreateIndividualDialogClose
    setCreateVideoDialogOpen(false);
    const queryKey = ["singleCollection", localUrlPathAsString];
    const queryCache = queryClient.getQueryCache();
    let queryState = queryCache.find({ queryKey: queryKey });
    if (queryState) {
      console.log(
        `CollectionView handleCreateVideoDialogClose Before Query with key ${queryKey} is in the cache.`
      );
    } else {
      console.log(
        `CollectionView handleCreateVideoDialogClose Before Query with key ${queryKey} is NOT in the cache.`
      );
    }
    // queryClient.invalidateQueries();
    queryClient.invalidateQueries({ queryKey: queryKey });
    queryState = queryCache.find({ queryKey: queryKey });
    if (queryState) {
      console.log(
        `CollectionView handleCreateVideoDialogClose After Query with key ${queryKey} is in the cache.`
      );
    } else {
      console.log(
        `CollectionView handleCreateVideoDialogClose After Query with key ${queryKey} is NOT in the cache.`
      );
    }
  };

  const handleCreateIndividualDialogClose = () => {
    // @TODO can combine this with handleCreateVideoDialogClose
    setCreateIndividualDialogOpen(false);
    const queryKey = ["individualsFor", localUrlPathAsString];
    const queryCache = queryClient.getQueryCache();
    let queryState = queryCache.find({ queryKey: queryKey });
    if (queryState) {
      console.log(
        `CollectionView handleCreateIndividualDialogClose Before Query with key ${queryKey} is in the cache.`
      );
    } else {
      console.log(
        `CollectionView handleCreateIndividualDialogClose Before Query with key ${queryKey} is NOT in the cache.`
      );
    }
    // queryClient.invalidateQueries();
    queryClient.invalidateQueries({ queryKey: queryKey });
    queryState = queryCache.find({ queryKey: queryKey });
    if (queryState) {
      console.log(
        `CollectionView handleCreateIndividualDialogClose After Query with key ${queryKey} is in the cache.`
      );
    } else {
      console.log(
        `CollectionView handleCreateIndividualDialogClose After Query with key ${queryKey} is NOT in the cache.`
      );
    }
  };

  const colNamesToDisplay: {} = useMemo(() => {
    if (dataWithActions && get(collectionData, ["videoIntakeQuestions"])) {
      return reduce(
        collectionData?.videoIntakeQuestions,
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
  }, [collectionData, dataWithActions]);

  const colNamesToDisplayWithActions = {
    ...colNamesToDisplay,
    actions: "Actions",
  };

  // const individualColNamesToDisplay: {} = useMemo(() => {
  //   if (
  //     individualDataWithActions &&
  //     collectionData?.individualIntakeQuestions
  //   ) {
  //     return reduce(
  //       collectionData?.individualIntakeQuestions,
  //       (memo: {}, intakeQuestion: any) => {
  //         return {
  //           ...memo,
  //           [intakeQuestion?.label]: intakeQuestion?.label,
  //         };
  //       },
  //       {}
  //     );
  //   } else {
  //     return {};
  //   }
  // }, [collectionData?.individualIntakeQuestions, individualDataWithActions]);

  // const individualColNamesToDisplayWithActions = {
  //   ...individualColNamesToDisplay,
  //   actions: "Actions",
  // };

  const videosFallback: string = intl.formatMessage({ id: "VIDEOS" });
  const individualsFallback: string = intl.formatMessage({
    id: "INDIVIDUALS_PLURAL",
  });
  const nameOfIndividualPlural: string = get(
    collectionData,
    "nameOfIndividualPlural",
    individualsFallback
  );

  return (
    <>
      {isLoadingCollection && (
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
            collection={collectionData}
            showEditButton={false}
          ></CollectionDetailsView>

          {/* Video creation */}
          <Dialog
            open={createVideoDialogOpen}
            onClose={handleCreateVideoDialogClose}
          >
            <DialogContent>
              <VideoIntake
                collection={collectionData}
                onCloseDialog={handleCreateVideoDialogClose}
              ></VideoIntake>
            </DialogContent>
          </Dialog>
          <DataTable
            tableTitle={collectionData?.nameOfVideoPlural || videosFallback}
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
              values={{ videoName: collectionData?.nameOfVideo }}
            />
          </Button>

          {/* Individual creation */}
          <Dialog
            open={createIndividualDialogOpen}
            onClose={handleCreateIndividualDialogClose}
          >
            <DialogContent>
              <IndividualIntake
                collection={collectionData}
                onCloseDialog={handleCreateIndividualDialogClose}
              ></IndividualIntake>
            </DialogContent>
          </Dialog>
          <IndividualsTableView
            collectionUrl={get(collectionData, "urlPath")}
            tableTitle={nameOfIndividualPlural}
            // nameOfIndividualPlural={get(
            //   collectionData,
            //   "nameOfIndividualPlural"
            // )}
            individualIntakeQuestions={get(
              collectionData,
              "individualIntakeQuestions"
            )}
          />
          <Button
            data-testid={"new-video-add-button"}
            variant="contained"
            onClick={handleNewIndividualClick}
          >
            <FormattedMessage
              id="ADD_NEW_INDIVIDUAL_TO_COLLECTION"
              defaultMessage="Add New {individualName}"
              values={{ individualName: collectionData?.nameOfIndividual }}
            />
          </Button>
        </>
      )}
      {!open && !showCollection && (
        <CustomError
          errorMsg={
            collectionErrorMsg ||
            intl.formatMessage({
              id: "COLLECTION_NOT_FOUND",
              defaultMessage: "Collection not found",
            })
          }
        />
      )}
    </>
  );
};

export default CollectionView;
