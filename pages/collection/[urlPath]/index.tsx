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
import { get, map, reduce } from "lodash-es";
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
    event: React.SyntheticEvent | Event | null,
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
  const isAdmin: boolean = true; // @TODO change
  const isOwner: boolean = useMemo(() => {
    if (user?.uid && collectionData?.metadata?.ownerId) {
      const deleteMe: boolean = user?.uid === collectionData.metadata.ownerId;
      console.log("deleteMe got here n1 and deleteMe is: " + deleteMe);
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

  const videosFallback: string = intl.formatMessage({ id: "VIDEOS" });
  const individualsFallback: string = intl.formatMessage({
    id: "INDIVIDUALS_PLURAL",
  });
  const nameOfIndividualPlural: string = get(
    collectionData,
    "nameOfIndividualPlural",
    individualsFallback
  );

  const shouldShowCollectionIncompleteAlert: boolean = useMemo(() => {
    console.log("deleteMe collectionData is: ");
    console.log(collectionData);
    console.log(
      "deleteMe collectionData?.individualIntakeQuestions?.length is: "
    );
    console.log(collectionData?.individualIntakeQuestions?.length);
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
              collectionUrl={collectionData?.metadata?.urlPath}
              setIsCollectionDetailsInEditMode={
                setIsCollectionDetailsInEditMode
              }
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
          {canEdit && (
            <Alert severity="info" style={{ marginBottom: "4vh" }}>
              <FormattedMessage
                id="EDIT_COLLECTION_INTAKE_QUESTIONS"
                defaultMessage="You have edit access to this collection. Edit your individual intake questions, video intake questions, and event intake questions here:"
                values={{
                  individualIntakeQuestions: get(
                    collectionData,
                    "individualIntakeQuestions"
                  ) ? (
                    <Link
                      href={
                        "/collection/" +
                        collectionData?.metadata?.urlPath +
                        "/individualIntakeQuestions/new"
                      }
                    >
                      Individual Intake Questions
                    </Link>
                  ) : (
                    ""
                  ),
                  videoIntakeQuestions: get(
                    collectionData,
                    "videoIntakeQuestions"
                  ) ? (
                    <Link
                      href={
                        "/collection/" +
                        collectionData?.metadata?.urlPath +
                        "/videoIntakeQuestions/new"
                      }
                    >
                      Video Intake Questions
                    </Link>
                  ) : (
                    ""
                  ),
                  eventIntakeQuestions: get(
                    collectionData,
                    "eventIntakeQuestions"
                  ) ? (
                    <Link
                      href={
                        "/collection/" +
                        collectionData?.metadata?.urlPath +
                        "/eventIntakeQuestions/new"
                      }
                    >
                      Event Intake Questions
                    </Link>
                  ) : (
                    ""
                  ),
                }}
              />
            </Alert>
          )}
          {shouldShowCollectionIncompleteAlert && (
            <Alert severity="warning" style={{ marginBottom: "4vh" }}>
              <FormattedMessage
                id="YOUR_COLLECTION_IS_INCOMPLETE"
                defaultMessage="Your collection isn't ready for primetime yet. You must create individual intake questions, video intake questions, and event intake questions in order for users of your collection to be able to create and annotate videos in your collection first."
                values={{
                  individualIntakeQuestions: get(
                    collectionData,
                    "individualIntakeQuestions"
                  ) ? (
                    ""
                  ) : (
                    <Link
                      href={
                        "/collection/" +
                        collectionData?.metadata?.urlPath +
                        "/individualIntakeQuestions/new"
                      }
                    >
                      Individual Intake Questions
                    </Link>
                  ),
                  videoIntakeQuestions: get(
                    collectionData,
                    "videoIntakeQuestions"
                  ) ? (
                    ""
                  ) : (
                    <Link
                      href={
                        "/collection/" +
                        collectionData?.metadata?.urlPath +
                        "/videoIntakeQuestions/new"
                      }
                    >
                      Video Intake Questions
                    </Link>
                  ),
                  eventIntakeQuestions: get(
                    collectionData,
                    "eventIntakeQuestions"
                  ) ? (
                    ""
                  ) : (
                    <Link
                      href={
                        "/collection/" +
                        collectionData?.metadata?.urlPath +
                        "/eventIntakeQuestions/new"
                      }
                    >
                      Event Intake Questions
                    </Link>
                  ),
                }}
              />
            </Alert>
          )}

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
            tableTitle={nameOfIndividualPlural}
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
