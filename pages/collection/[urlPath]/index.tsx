import {
  Alert,
  Backdrop,
  Button,
  CircularProgress,
  Dialog,
  DialogContent,
  IconButton,
  Link,
  Snackbar,
} from "@mui/material";
import CloseIcon from "@mui/icons-material/Close";
import { filter, forEach, get, map, reduce } from "lodash-es";
import { NextRouter, useRouter } from "next/router";
import { useEffect, useMemo, useState } from "react";
import { FormattedMessage, IntlShape, useIntl } from "react-intl";
import { useQueryClient } from "@tanstack/react-query";
import CollectionDetailsView from "../../../components/CollectionDetailsView";
import DataTable from "../../../components/DataTable";
import CustomError from "../../../components/CustomError";
import IndividualIntake from "../../../components/IndividualIntake";
import VideoIntake from "../../../components/VideoIntake";
import useGetCollection from "../../../hooks/useGetCollection";
import IndividualsTableView from "../../../components/IndividualsTableView";
import { sanitizeString } from "../../../utilities/textUtils";
import useFirebaseAuth from "../../../hooks/useFirebaseAuth";
import useGetUserRolesAsync from "../../../hooks/useGetUserRolesAsync";
import useGetUserRoles from "../../../hooks/useGetUserRoles";
import CollectionDetailsEdit from "../../../components/CollectionDetailsEdit";
import CollectionAlertsInfo from "../../../components/CollectionAlertsInfo";
import CollectionAlertsWarning from "../../../components/CollectionAlertsWarning";
import { endsInNameStar } from "../../../utilities/validators";

const CollectionView: React.FC = () => {
  const queryClient = useQueryClient();
  const { user } = useFirebaseAuth();

  const router: NextRouter = useRouter();
  const intl: IntlShape = useIntl();
  const [isCollectionDetailsInEditMode, setIsCollectionDetailsInEditMode] =
    useState<boolean>(false);
  const localUrlPath: string | string[] | undefined = router.query.urlPath;
  let localUrlPathAsString: string =
    (Array.isArray(localUrlPath)
      ? sanitizeString(localUrlPath.join())
      : sanitizeString(localUrlPath)) || "";
  const [showCollection, setShowCollection] = useState<boolean>(false);

  const {
    isLoading: isLoadingCollection,
    isError: isErrorCollection,
    data: collectionData,
    errorMsg: collectionErrorMsg,
  } = useGetCollection(localUrlPathAsString.toLowerCase());

  const { isLoading, isError, data, error } = useGetUserRolesAsync(user?.uid);
  const [snackbarMessage, setSnackbarMessage] = useState<string>("");
  const [openSnackbar, setOpenSnackbar] = useState<boolean>(false);
  const handleSnackbarClose = (
    _event: React.SyntheticEvent | Event | null,
    reason?: string
  ) => {
    if (reason === "clickaway") {
      // in case you want this behavior to be different eventually
      setSnackbarMessage("");
      setOpenSnackbar(false);
      return;
    }

    // the "finally" of it all
    setSnackbarMessage("");
    setOpenSnackbar(false);
  };
  const isAdmin: boolean = true; // @TODO change!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!
  const isOwner: boolean = useMemo(() => {
    if (user?.uid && collectionData?.metadata?.ownerId) {
      return user?.uid === collectionData.metadata.ownerId;
    }
    return false;
  }, [user, collectionData]);
  const canEdit: boolean = useMemo(() => {
    return isAdmin || isOwner;
  }, [isAdmin, isOwner]);

  const [createVideoDialogOpen, setCreateVideoDialogOpen] =
    useState<boolean>(false);
  const [createIndividualDialogOpen, setCreateIndividualDialogOpen] =
    useState<boolean>(false);

  const flattenAndStringifyVideoEvents: (events: {}[]) => string = (
    events: {}[]
  ) => {
    const returnVals = forEach(events, (event) => {
      const targetKey: string = filter(Object.keys(event), (key) =>
        endsInNameStar(key)
      )[0];
      console.log("deleteMe targetKey is: ");
      console.log(targetKey); //@TODO LEFT OFF HERE
      return event[targetKey];
    });
    console.log("deleteMe returnVals is: ");
    console.log(returnVals);
    return "test";
  };

  const dataWithActions = useMemo(() => {
    let dataWithActionsAppended = [];
    if (collectionData && collectionData?.videos) {
      dataWithActionsAppended = map(collectionData.videos, (video) => {
        console.log("deleteMe v1 video is: ");
        console.log(video);
        return {
          actions: "stand in",
          ...video,
          events: flattenAndStringifyVideoEvents(video.events),
        };
      });
    }
    // @TODO add events in here?
    return dataWithActionsAppended;
  }, [collectionData]);
  // console.log("deleteMe c1 dataWithActions is: ");
  // console.log(dataWithActions);

  const linkIds = useMemo(() => {
    if (collectionData && collectionData?.videos) {
      return map(collectionData.videos, (datum) => {
        return datum.id;
      });
    }
  }, [collectionData]);

  useEffect(() => {
    if (!isLoadingCollection && !isErrorCollection && collectionData) {
      setShowCollection(true);
    }
    if (!isLoadingCollection && !isErrorCollection && !collectionData) {
      setShowCollection(false);
    }
  }, [isLoadingCollection, collectionData, isErrorCollection]);

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
    queryClient.invalidateQueries({ queryKey: queryKey });
  };

  const handleCreateIndividualDialogClose = () => {
    // @TODO can combine this with handleCreateVideoDialogClose
    setCreateIndividualDialogOpen(false);
    const queryKey = ["individualsFor", localUrlPathAsString];
    queryClient.invalidateQueries({ queryKey: queryKey });
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
    actions: "Actions",
    ...colNamesToDisplay,
    events: collectionData?.metadata?.nameOfEventPlural,
  };

  const videosFallback: string = intl.formatMessage({ id: "VIDEOS" });
  const individualsFallback: string = intl.formatMessage({
    id: "INDIVIDUALS_PLURAL",
  });

  const shouldShowCollectionIncompleteAlert: boolean = useMemo(() => {
    return (
      collectionData?.individualIntakeQuestions == undefined ||
      collectionData?.videoIntakeQuestions == undefined ||
      collectionData?.individualIntakeQuestions == undefined ||
      collectionData?.individualIntakeQuestions?.length < 1 ||
      collectionData?.videoIntakeQuestions?.length < 1 ||
      collectionData?.eventIntakeQuestions == undefined ||
      collectionData?.eventIntakeQuestions?.length < 1
    );
  }, [collectionData]);

  return (
    <>
      {isLoadingCollection && (
        <Backdrop
          sx={{ color: "#fff", zIndex: (theme) => theme.zIndex.drawer + 1 }}
          open={isLoadingCollection}
        >
          <CircularProgress color="inherit" />
        </Backdrop>
      )}
      {showCollection && (
        <>
          {isCollectionDetailsInEditMode ? (
            <CollectionDetailsEdit
              setIsCollectionDetailsInEditMode={
                setIsCollectionDetailsInEditMode
              }
              collectionUrl={collectionData?.metadata?.urlPath}
              setParentSnackbarMessage={setSnackbarMessage}
              setParentOpenSnackbar={setOpenSnackbar}
            />
          ) : (
            <CollectionDetailsView
              collectionUrl={collectionData.metadata.urlPath || ""}
              showEditButton={canEdit}
              setIsCollectionDetailsInEditMode={
                setIsCollectionDetailsInEditMode
              }
            ></CollectionDetailsView>
          )}
          {canEdit && !shouldShowCollectionIncompleteAlert && (
            <CollectionAlertsInfo collectionData={collectionData} />
          )}
          {shouldShowCollectionIncompleteAlert && (
            <CollectionAlertsWarning collectionData={collectionData} />
          )}

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
            tableTitle={
              collectionData?.metadata?.nameOfVideoPlural || videosFallback
            }
            data={dataWithActions}
            colNamesToDisplay={colNamesToDisplayWithActions}
            actionButtonsToDisplay={{ view: "View" }}
            targetColIdxForUrlPath={0}
            linkUrls={{
              view: "/collection/" + localUrlPathAsString + "/video/",
            }}
            linkIds={linkIds}
          ></DataTable>
          <Button
            disabled={shouldShowCollectionIncompleteAlert}
            data-testid={"new-video-add-button"}
            variant="contained"
            onClick={handleNewVideoClick}
            style={{ marginBottom: "1rem" }}
          >
            <FormattedMessage
              id="ADD_NEW_VIDEO_TO_COLLECTION"
              defaultMessage="Add New {videoName}"
              values={{ videoName: collectionData?.metadata?.nameOfVideo }}
            />
          </Button>

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
            collectionUrl={get(collectionData, ["metadata", "urlPath"])}
            tableTitle={
              collectionData?.metadata?.nameOfIndividualPlural ||
              individualsFallback
            }
            individualIntakeQuestions={get(
              collectionData,
              "individualIntakeQuestions"
            )}
          />
          <Button
            disabled={shouldShowCollectionIncompleteAlert}
            data-testid={"new-individual-add-button"}
            variant="contained"
            onClick={handleNewIndividualClick}
          >
            <FormattedMessage
              id="ADD_NEW_INDIVIDUAL_TO_COLLECTION"
              defaultMessage="Add New {individualName}"
              values={{
                individualName: collectionData?.metadata?.nameOfIndividual,
              }}
            />
          </Button>
        </>
      )}
      {!isLoadingCollection && !showCollection && (
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
      <Snackbar
        open={openSnackbar}
        onClose={handleSnackbarClose}
        autoHideDuration={6000}
        message={snackbarMessage}
        action={
          <IconButton
            size="small"
            aria-label="close"
            color="inherit"
            onClick={() => handleSnackbarClose(null, "clickaway")}
          >
            <CloseIcon fontSize="small" />
          </IconButton>
        }
      />
    </>
  );
};

export default CollectionView;
