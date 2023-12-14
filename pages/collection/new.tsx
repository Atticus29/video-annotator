import { useEffect, useMemo, useState } from "react";
import {
  Backdrop,
  Button,
  CircularProgress,
  Grid,
  IconButton,
  Snackbar,
} from "@mui/material";
import CloseIcon from "@mui/icons-material/Close";
import CollectionDetailsEdit from "../../components/CollectionDetailsEdit";
import CollectionDetailsView from "../../components/CollectionDetailsView";
import VideoIntakePreview from "../../components/VideoIntakePreview";
import VideoIntakeQuestions from "../../components/VideoIntakeQuestions";
import { Collection, FormFieldGroup } from "../../types";
import { shamCollection } from "../../dummy_data/dummyCollection";
import IndividualIntakeQuestions from "../../components/IndividualIntakeQuestions";
import IndividualIntakePreview from "../../components/IndividualIntakePreview";
import { get } from "lodash-es";
import EventIntakeQuestions from "../../components/EventIntakeQuestions";
import EventIntakePreview from "../../components/EventIntakePreview";
import {
  QueryFunctionContext,
  useMutation,
  UseMutationResult,
  useQuery,
} from "react-query";
import axios from "axios";
import { FormattedMessage, IntlShape, useIntl } from "react-intl";
import { sanitizeString } from "../../utilities/textUtils";
import { NextRouter, useRouter } from "next/router";
import dayjs from "dayjs";
import useFirebaseAuth from "../../hooks/useFirebaseAuth";
import UnsavedChangesPrompt from "../../components/UnsavedChangesPrompt";

const NewCollection: React.FC = () => {
  const intl: IntlShape = useIntl();
  const router: NextRouter = useRouter();
  const { user, authError } = useFirebaseAuth();
  const localUrlPath: string | string[] | undefined = router.query.urlPath;
  let localUrlPathAsString: string =
    (Array.isArray(localUrlPath) ? localUrlPath.join() : localUrlPath) || "";

  const collectionFailMsg: string = intl.formatMessage({
    id: "COLLECTION_WAS_NOT_SAVED",
  });
  const collectionSaveMsg: string = intl.formatMessage({
    id: "COLLECTION_SAVED_SUCCESSFULL",
  });
  const [videoQuestionFormValues, setVideoQuestionFormValues] = useState<{}>(
    {}
  );
  const [individualQuestionFormValues, setIndividualQuestionFormValues] =
    useState<{}>({});
  const [eventQuestionFormValues, setEventQuestionFormValues] = useState<{}>(
    {}
  );

  const [
    arevideoQuestionFormValuesInvalid,
    setArevideoQuestionFormValuesInvalid,
  ] = useState<{}>({});
  const [
    areIndividualQuestionFormValuesInvalid,
    setAreIndividualQuestionFormValuesInvalid,
  ] = useState<{}>({});
  const [
    areEventQuestionFormValuesInvalid,
    setAreEventQuestionFormValuesInvalid,
  ] = useState<{}>({});

  const [collection, setCollection] = useState<Collection>();
  const [isCollectionDetailsInEditMode, setIsCollectionDetailsInEditMode] =
    useState<boolean>(false);
  const [open, setOpen] = useState<boolean>(false);
  const [saveSucess, setSaveSuccess] = useState<boolean>(false);
  const [saveFail, setSaveFail] = useState<boolean>(false);
  const [snackbarMessage, setSnackbarMessage] = useState<string>("");

  useEffect(() => {
    const initialCollection = { ...shamCollection };
    initialCollection.videoQuestionsFormFieldGroup =
      videoQuestionsFormFieldGroup;
    initialCollection.individualQuestionsFormFieldGroup =
      individualQuestionsFormFieldGroup;
    initialCollection.eventQuestionsFormFieldGroup =
      eventQuestionsFormFieldGroup;
    initialCollection.createdByEmail =
      collection?.createdByEmail || user?.email || "public@example.com";
    setCollection(initialCollection);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [user]);

  const videoQuestionsFormFieldGroup: FormFieldGroup = useMemo(() => {
    return {
      title: "VideoFormFieldGroupForTheWholeDummyCollection",
      setValues: setVideoQuestionFormValues,
      actualValues: videoQuestionFormValues,
      isInvalids: arevideoQuestionFormValuesInvalid,
      setIsInvalids: setArevideoQuestionFormValuesInvalid,
    };
  }, [arevideoQuestionFormValuesInvalid, videoQuestionFormValues]);

  const individualQuestionsFormFieldGroup: FormFieldGroup = useMemo(() => {
    return {
      title: "IndividualFormFieldGroupForTheWholeDummyCollection",
      setValues: setIndividualQuestionFormValues,
      actualValues: individualQuestionFormValues,
      isInvalids: areIndividualQuestionFormValuesInvalid,
      setIsInvalids: setAreIndividualQuestionFormValuesInvalid,
    };
  }, [areIndividualQuestionFormValuesInvalid, individualQuestionFormValues]);

  const eventQuestionsFormFieldGroup: FormFieldGroup = useMemo(() => {
    return {
      title: "EventFormFieldGroupForTheWholeDummyCollection",
      setValues: setEventQuestionFormValues,
      actualValues: eventQuestionFormValues,
      isInvalids: areEventQuestionFormValuesInvalid,
      setIsInvalids: setAreEventQuestionFormValuesInvalid,
    };
  }, [areEventQuestionFormValuesInvalid, eventQuestionFormValues]);

  useEffect(() => {
    setCollection((prevState: any) => {
      return {
        ...prevState,
        videoQuestionsFormFieldGroup: videoQuestionsFormFieldGroup,
        individualQuestionsFormFieldGroup: individualQuestionsFormFieldGroup,
        eventQuestionsFormFieldGroup: eventQuestionsFormFieldGroup,
      };
    });
  }, [
    videoQuestionsFormFieldGroup,
    videoQuestionsFormFieldGroup?.actualValues,
    individualQuestionsFormFieldGroup,
    individualQuestionsFormFieldGroup?.actualValues,
    eventQuestionsFormFieldGroup,
    eventQuestionsFormFieldGroup?.actualValues,
  ]);

  const collectionMutation: UseMutationResult<any> = useMutation({
    // @TODO move this into a custom hook?
    mutationFn: async (collection) => {
      const response = await axios.post("/api/collection", {
        data: collection,
      });
      return response?.data;
    },
    onSuccess: (data) => {
      setSnackbarMessage(data?.message);
      setOpen(false);
      setSaveSuccess(true);
      setSaveFail(false);
      handleClose();
      router.push("/collection/" + data?.data?.urlPath);
    },
    onError: (error) => {
      setSnackbarMessage(
        get(
          error,
          ["response", "data", "message"],
          "Collection not saved due to unknown error."
        )
      );
      setSaveSuccess(false);
      setSaveFail(true);
      handleClose();
    },
  });

  const handleSaveCollection = async () => {
    setOpen(true);
    const sanitizedCollectionName: string = sanitizeString(
      collection?.name || String(Math.random() * 10)
    );
    const fleshedOutCollection: Collection | any = {
      // @TODO just having Collection as the type created issues that I don't have internet access to resolve
      ...collection,
      urlPath: sanitizeString(
        collection?.name || localUrlPathAsString || String(Math.random() * 10)
      ),
      createdByEmail: user?.email || "public@example.com",
      dateCreated: dayjs(),
    };
    collectionMutation.mutate(fleshedOutCollection);
  };

  const handleSnackbarClose = (
    event: React.SyntheticEvent | Event | null,
    reason?: string
  ) => {
    if (reason === "clickaway") {
      // in case you want this behavior to be different eventually
      setSaveSuccess(false);
      setSaveFail(false);
      setSnackbarMessage("");
      return;
    }

    // the "finally" of it all
    setSaveSuccess(false);
    setSaveFail(false);
    setSnackbarMessage("");
  };

  const handleClose = () => {
    setOpen(false);
  };

  const savingText: JSX.Element = (
    <FormattedMessage id={"SAVING"}></FormattedMessage>
  );
  const savedText: JSX.Element = (
    <FormattedMessage id="SAVE_COLLECTION"></FormattedMessage>
  );

  return (
    <>
      <UnsavedChangesPrompt />
      {/* <Backdrop
        sx={{ color: "#fff", zIndex: (theme) => theme.zIndex.drawer + 1 }}
        open={isLoading}
        onClick={handleClose}
      >
        <CircularProgress color="inherit" />
      </Backdrop> */}
      <Grid container spacing={2} style={{ marginTop: "1vh" }}>
        {collection && (
          <>
            <Grid item sm={12} md={12}>
              {isCollectionDetailsInEditMode ? (
                <CollectionDetailsEdit
                  collection={collection}
                  setCollection={setCollection}
                  setIsCollectionDetailsInEditMode={
                    setIsCollectionDetailsInEditMode
                  }
                />
              ) : (
                <CollectionDetailsView
                  collection={collection}
                  showEditButton={true}
                  setIsCollectionDetailsInEditMode={
                    setIsCollectionDetailsInEditMode
                  }
                />
              )}
            </Grid>
            <Grid item sm={12} md={4} style={{ height: 700, overflow: "auto" }}>
              {collection && individualQuestionsFormFieldGroup && (
                <IndividualIntakeQuestions
                  collection={collection}
                  setCollection={setCollection}
                  formFieldGroup={individualQuestionsFormFieldGroup}
                />
              )}
            </Grid>
            <Grid item sm={12} md={8} style={{ height: 700, overflow: "auto" }}>
              {collection && (
                <IndividualIntakePreview collection={collection} />
              )}
            </Grid>
            <Grid item sm={12} md={4} style={{ height: 700, overflow: "auto" }}>
              {collection && videoQuestionsFormFieldGroup && (
                <VideoIntakeQuestions
                  collection={collection}
                  setCollection={setCollection}
                  formFieldGroup={videoQuestionsFormFieldGroup}
                />
              )}
            </Grid>
            <Grid item sm={12} md={8} style={{ height: 700, overflow: "auto" }}>
              {collection && <VideoIntakePreview collection={collection} />}
            </Grid>
            <Grid item sm={12} md={4} style={{ height: 700, overflow: "auto" }}>
              {collection && eventQuestionsFormFieldGroup && (
                <EventIntakeQuestions
                  collection={collection}
                  setCollection={setCollection}
                  formFieldGroup={eventQuestionsFormFieldGroup}
                />
              )}
            </Grid>
            <Grid item sm={12} md={8} style={{ height: 700, overflow: "auto" }}>
              {collection && <EventIntakePreview collection={collection} />}
            </Grid>
          </>
        )}
      </Grid>
      <Button variant="contained" onClick={handleSaveCollection}>
        {collectionMutation.isLoading ? savingText : savedText}
      </Button>
      <Backdrop
        sx={{ color: "#fff", zIndex: (theme) => theme.zIndex.drawer + 1 }}
        open={open}
        onClick={handleClose}
      >
        <CircularProgress color="inherit" />
      </Backdrop>
      <Snackbar
        open={saveSucess}
        onClose={handleSnackbarClose}
        autoHideDuration={6000}
        message={collectionSaveMsg}
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
      <Snackbar
        open={saveFail}
        onClose={handleSnackbarClose}
        autoHideDuration={6000}
        message={collectionFailMsg + snackbarMessage}
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

export default NewCollection;
