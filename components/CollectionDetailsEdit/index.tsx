import React, { useEffect, useState } from "react";
import InfoIcon from "../InfoIcon";

import {
  Backdrop,
  Button,
  Checkbox,
  CircularProgress,
  FormControlLabel,
  Grid,
  IconButton,
  Snackbar,
  TextField,
} from "@mui/material";
import CloseIcon from "@mui/icons-material/Close";
import { FormattedMessage, useIntl, IntlShape } from "react-intl";

import InfoPanel from "../InfoPanel";
import { Collection, CollectionMetadata } from "../../types";
import {
  isNonEmptyString,
  isValidEmail,
  isValidName,
} from "../../utilities/validators";
import CustomError from "../Error";
import { get } from "lodash-es";
import useMutateCollectionMetadata from "../../hooks/useMutateCollectionMetadata";
import { sanitizeString } from "../../utilities/textUtils";
import router from "next/router";

const CollectionDetailsEdit: React.FC<{
  collection: Collection;
  setCollection: (col: Collection) => void;
  // setIsCollectionDetailsInEditMode: (val: boolean) => void;
  titleId?: string;
  mode?: string;
}> = ({
  collection,
  setCollection,
  // setIsCollectionDetailsInEditMode,
  titleId,
  mode = "edit",
}) => {
  const intl: IntlShape = useIntl();
  const {
    mutate,
    isPending,
    error: collectionMetadataUpdateError,
    isError,
  } = useMutateCollectionMetadata();

  const [snackbarMessage, setSnackbarMessage] = useState<string>("");
  const [open, setOpen] = useState<boolean>(false);

  const handleClose = () => {
    setOpen(false);
  };

  useEffect(() => {
    setName(collection.metadata.name);
    setNameOfVideo(collection.metadata.nameOfVideo);
    setNameOfVideoPlural(collection.metadata.nameOfVideoPlural);
    setNameOfEvent(collection.metadata.nameOfEvent);
    setNameOfEventPlural(collection.metadata.nameOfEventPlural);
    setNameOfIndividual(collection.metadata.nameOfIndividual);
    setLanguage(collection.metadata.language);
    setNameOfIndividualPlural(collection.metadata.nameOfIndividualPlural);
    setIsPrivate(collection.metadata.isPrivate);
    setCreatedByEmail(collection.metadata.createdByEmail);
  }, [collection]);

  const [error, setError] = useState<string>("");
  const [allRequiredValid, setAllRequiredValid] = useState<boolean>(false);

  // Collection name
  const [name, setName] = useState<string>("");
  const [nameInvalid, setNameInvalid] = useState<boolean>(false);
  const handleNameChange: (
    event: React.ChangeEvent<HTMLInputElement>
  ) => void = (event: React.ChangeEvent<HTMLInputElement>) => {
    const currentName: string = event?.currentTarget?.value;
    if (currentName.toLowerCase() !== "new") {
      console.log("deleteMe setting current name to: ");
      console.log(currentName);
      setName(currentName);
      setNameInvalid(!isValidName(currentName));
    } else {
      setName("Cannot name collection new"); // the collection/new URL is the create endpoint for now
      setNameInvalid(true);
    }
  };

  // Video name
  const [nameOfVideo, setNameOfVideo] = useState<string>("");
  const [nameOfVideoInvalid, setNameOfVideoInvalid] = useState<boolean>(false);
  const handleNameOfVideoChange: (
    event: React.ChangeEvent<HTMLInputElement>
  ) => void = (event: React.ChangeEvent<HTMLInputElement>) => {
    const currentNameOfVideo: string = event?.currentTarget?.value;
    setNameOfVideo(currentNameOfVideo);
    setNameOfVideoInvalid(!isValidName(currentNameOfVideo));
  };

  // Video name plural
  const [nameOfVideoPlural, setNameOfVideoPlural] = useState<string>("");
  const [nameOfVideoPluralInvalid, setNameOfVideoPluralInvalid] =
    useState<boolean>(false);
  const handleNameOfVideoPluralChange: (
    event: React.ChangeEvent<HTMLInputElement>
  ) => void = (event: React.ChangeEvent<HTMLInputElement>) => {
    const currentNameOfVideoPlural: string = event?.currentTarget?.value;
    setNameOfVideoPlural(currentNameOfVideoPlural);
    setNameOfVideoPluralInvalid(!isValidName(currentNameOfVideoPlural));
  };

  // Name of event
  const [nameOfEvent, setNameOfEvent] = useState<string>("");
  const [nameOfEventInvalid, setnameOfEventInvalid] = useState<boolean>(false);
  const handleNameOfEventChange: (
    event: React.ChangeEvent<HTMLInputElement>
  ) => void = (event: React.ChangeEvent<HTMLInputElement>) => {
    const currentNameOfEvent: string = event?.currentTarget?.value;
    setNameOfEvent(currentNameOfEvent);
    setnameOfEventInvalid(!isValidName(currentNameOfEvent));
  };

  // Name of event plural
  const [nameOfEventPlural, setNameOfEventPlural] = useState<string>("");
  const [nameOfEventPluralInvalid, setnameOfEventPluralInvalid] =
    useState<boolean>(false);
  const handleNameOfEventPluralChange: (
    event: React.ChangeEvent<HTMLInputElement>
  ) => void = (event: React.ChangeEvent<HTMLInputElement>) => {
    const currentNameOfEventPlural: string = event?.currentTarget?.value;
    setNameOfEventPlural(currentNameOfEventPlural);
    setnameOfEventPluralInvalid(!isValidName(currentNameOfEventPlural));
  };

  // Name of individual
  const [nameOfIndividual, setNameOfIndividual] = useState<string>("");
  const [nameOfIndividualInvalid, setnameOfIndividualInvalid] =
    useState<boolean>(false);
  const handleNameOfIndividualChange: (
    event: React.ChangeEvent<HTMLInputElement>
  ) => void = (event: React.ChangeEvent<HTMLInputElement>) => {
    const currentNameOfIndividual: string = event?.currentTarget?.value;
    setNameOfIndividual(currentNameOfIndividual);
    setnameOfIndividualInvalid(!isValidName(currentNameOfIndividual));
  };

  // Name of individual plural
  const [nameOfIndividualPlural, setNameOfIndividualPlural] =
    useState<string>("");
  const [nameOfIndividualPluralInvalid, setnameOfIndividualPluralInvalid] =
    useState<boolean>(false);
  const handleNameOfIndividualPluralChange: (
    event: React.ChangeEvent<HTMLInputElement>
  ) => void = (event: React.ChangeEvent<HTMLInputElement>) => {
    const currentNameOfIndividualPlural: string = event?.currentTarget?.value;
    setNameOfIndividualPlural(currentNameOfIndividualPlural);
    setnameOfIndividualPluralInvalid(
      !isValidName(currentNameOfIndividualPlural)
    );
  };

  // Language
  const [language, setLanguage] = useState<string>("");
  const [languageInvalid, setLanguageInvalid] = useState<boolean>(false);
  const handleLanguageChange: (
    event: React.ChangeEvent<HTMLInputElement>
  ) => void = (event: React.ChangeEvent<HTMLInputElement>) => {
    const currentLanguage: string = event?.currentTarget?.value;
    setLanguage(currentLanguage);
    setLanguageInvalid(!isValidName(currentLanguage));
  };

  // Created by email
  const [createdByEmail, setCreatedByEmail] = useState<string>("");
  const [createdByEmailInvalid, setCreatedByEmailInvalid] =
    useState<boolean>(false);
  const handleCreatedByEmailChange: (
    event: React.ChangeEvent<HTMLInputElement>
  ) => void = (event: React.ChangeEvent<HTMLInputElement>) => {
    const currentCreatedByEmail: string = event?.currentTarget?.value;
    setCreatedByEmail(currentCreatedByEmail);
    setCreatedByEmailInvalid(
      !isValidEmail(currentCreatedByEmail) ||
        !isNonEmptyString(currentCreatedByEmail)
    );
  };

  // isPrivate
  const [isPrivate, setIsPrivate] = useState<boolean>(
    get(collection, ["metadata", "isPrivate"], false)
  );
  const handleIsPrivateChange: (event: any) => void = (event: any) => {
    const currentIsPrivate: any = event?.target?.checked;
    setIsPrivate(currentIsPrivate);
  };

  useEffect(() => {
    if (
      isValidName(name) &&
      isValidName(nameOfVideo) &&
      isValidName(nameOfVideoPlural) &&
      isValidName(nameOfEvent) &&
      isValidName(nameOfEventPlural) &&
      isValidName(nameOfIndividual) &&
      isValidName(nameOfIndividualPlural) &&
      isValidName(language) &&
      isValidEmail(createdByEmail) &&
      isNonEmptyString(createdByEmail)
    ) {
      setAllRequiredValid(true);
    } else {
      setAllRequiredValid(false);
    }
  }, [
    name,
    nameOfEvent,
    nameOfVideo,
    createdByEmail,
    nameOfVideoPlural,
    nameOfEventPlural,
    nameOfIndividual,
    nameOfIndividualPlural,
    language,
  ]);

  const handleSnackbarClose = (
    event: React.SyntheticEvent | Event | null,
    reason?: string
  ) => {
    if (reason === "clickaway") {
      // in case you want this behavior to be different eventually
      // setSaveSuccess(false);
      // setSaveFail(false);
      setSnackbarMessage("");
      return;
    }

    // the "finally" of it all
    // setSaveSuccess(false);
    // setSaveFail(false);
    setSnackbarMessage("");
  };

  const handleCollectionDetailsCreate: () => void = async () => {
    const metadata: CollectionMetadata = {
      urlPath: sanitizeString(name).toLowerCase(),
      name,
      dateCreated: mode === "create" ? Date() : collection.metadata.dateCreated,
      dateLastUpdated: Date(),
      nameOfVideo,
      nameOfVideoPlural,
      nameOfEvent,
      nameOfEventPlural,
      nameOfIndividual,
      nameOfIndividualPlural,
      language,
      isPrivate,
      createdByEmail,
    };

    console.log("deleteMe metadata before mutation is: ");
    console.log(metadata);

    mutate(
      {
        collectionUrl: metadata.urlPath || "",
        updatedCollectionMetadata: metadata,
      },
      {
        onSuccess: (responseData) => {
          console.log("deleteMe responseData is: ");
          console.log(responseData);
          console.log("Mutation successful", responseData.message);
          setSnackbarMessage(responseData.message);
          // router.push("/collection/" + responseData?.data?.metadata?.urlPath); // @TODO comment back in
          // @TODO display the success snackbar
        },
        onError: (error) => {
          // Handle error
          setSnackbarMessage(error.message);
          console.error("Mutation error", error);
        },
      }
    );
  };

  // const handleCollectionDetailsSubmission: () => void = async () => {
  //   try {
  //     const dateCreated = get(collection, ["metadata", "dateCreated"]);
  //     const nameOfVideoPlural = get(collection, [
  //       "metadata",
  //       "nameOfVideoPlural",
  //     ]);
  //     const nameOfEventPlural = get(collection, [
  //       "metadata",
  //       "nameOfEventPlural",
  //     ]);
  //     const nameOfIndividual = get(collection, [
  //       "metadata",
  //       "nameOfIndividual",
  //     ]);
  //     const nameOfIndividualPlural = get(collection, [
  //       "metadata",
  //       "nameOfIndividualPlural",
  //     ]); // @TODO maybe make these editable?
  //     const language = get(collection, ["metadata", "language"]);
  //     setCollection({
  //       ...collection,
  //       metadata: {
  //         name,
  //         dateCreated,
  //         nameOfVideo,
  //         nameOfVideoPlural,
  //         nameOfEvent,
  //         nameOfEventPlural,
  //         nameOfIndividual,
  //         nameOfIndividualPlural,
  //         language,
  //         isPrivate,
  //         createdByEmail,
  //       },
  //     });
  //     // setIsCollectionDetailsInEditMode(false);
  //   } catch (error: any) {
  //     setError(error?.message);
  //   }
  // };

  const isPrivateCollectionLabel: string = intl.formatMessage({
    id: "IS_COLLECTION_PRIVATE",
    defaultMessage: "Is the collection private?",
  });

  return (
    // @TODO make this generic
    <>
      <InfoPanel
        titleId={titleId ? titleId : "COLLECTION_DETAILS_EDIT"}
        titleDefault="Edit Collection Details"
        textOverrides={{ textAlign: "center" }}
        styleOverrides={{ maxHeight: 1000 }}
      >
        <Grid container>
          {mode === "create" && (
            <Grid item lg={12} sm={12}>
              <TextField
                fullWidth
                data-testid={"collection-name"}
                error={nameInvalid}
                variant="filled"
                label={
                  <FormattedMessage
                    id="COLLECTION_NAME"
                    defaultMessage="Collection Name"
                  />
                }
                required
                helperText={
                  nameInvalid
                    ? intl.formatMessage({
                        id: "COLLECTION_NAME_CANNOT_BE_BLANK",
                        defaultMessage: "Invalid or blank collection name",
                      })
                    : ""
                }
                style={{ marginBottom: 10, maxWidth: 400 }}
                onChange={handleNameChange}
                value={name}
              ></TextField>
            </Grid>
          )}
          <Grid item lg={12} sm={12}>
            <TextField
              fullWidth
              data-testid={"collection-name-of-video"}
              error={nameOfVideoInvalid}
              variant="filled"
              label={
                <FormattedMessage
                  id="NAME_OF_VIDEO"
                  defaultMessage="Name of video"
                />
              }
              required
              helperText={
                nameOfVideoInvalid
                  ? intl.formatMessage(
                      {
                        id: "GENERIC_CANNOT_BE_BLANK",
                        defaultMessage: "Name of video cannot be blank",
                      },
                      { name: "Name of video" } // @TODO internationalize this, too
                    )
                  : ""
              }
              style={{ marginBottom: 10, maxWidth: 400 }}
              onChange={handleNameOfVideoChange}
              value={nameOfVideo}
            ></TextField>
          </Grid>
          <Grid item lg={12} sm={12}>
            <TextField
              fullWidth
              data-testid={"collection-name-of-video-plural"}
              error={nameOfVideoPluralInvalid}
              variant="filled"
              label={
                <FormattedMessage
                  id="NAME_OF_VIDEO_PLURAL"
                  defaultMessage="Name of video plural"
                />
              }
              required
              helperText={
                nameOfVideoPluralInvalid
                  ? intl.formatMessage(
                      {
                        id: "GENERIC_CANNOT_BE_BLANK",
                        defaultMessage: "Name of video plural cannot be blank",
                      },
                      { name: "Name of video plural" } // @TODO internationalize this, too
                    )
                  : ""
              }
              style={{ marginBottom: 10, maxWidth: 400 }}
              onChange={handleNameOfVideoPluralChange}
              value={nameOfVideoPlural}
            ></TextField>
          </Grid>
          <Grid item lg={12} sm={12}>
            <TextField
              fullWidth
              error={nameOfEventInvalid}
              variant="filled"
              data-testid={"collection-name-of-event"}
              label={
                <FormattedMessage
                  id="NAME_OF_EVENT"
                  defaultMessage="Name of event"
                />
              }
              required
              helperText={
                nameOfEventInvalid
                  ? intl.formatMessage(
                      {
                        id: "GENERIC_CANNOT_BE_BLANK",
                        defaultMessage: "Name of event cannot be blank",
                      },
                      { name: "Name of event" } // @TODO internationalize this, too
                    )
                  : ""
              }
              style={{ marginBottom: 10, maxWidth: 400 }}
              onChange={handleNameOfEventChange}
              value={nameOfEvent}
            ></TextField>
          </Grid>
          <Grid item lg={12} sm={12}>
            <TextField
              fullWidth
              error={nameOfEventPluralInvalid}
              variant="filled"
              data-testid={"collection-name-of-event-plural"}
              label={
                <FormattedMessage
                  id="NAME_OF_EVENT_PLURAL"
                  defaultMessage="Name of event plural"
                />
              }
              required
              helperText={
                nameOfEventPluralInvalid
                  ? intl.formatMessage(
                      {
                        id: "GENERIC_CANNOT_BE_BLANK",
                        defaultMessage: "Name of event plural cannot be blank",
                      },
                      { name: "Name of event plural" } // @TODO internationalize this, too
                    )
                  : ""
              }
              style={{ marginBottom: 10, maxWidth: 400 }}
              onChange={handleNameOfEventPluralChange}
              value={nameOfEventPlural}
            ></TextField>
          </Grid>
          <Grid item lg={12} sm={12}>
            <TextField
              fullWidth
              error={nameOfIndividualInvalid}
              variant="filled"
              data-testid={"collection-name-of-individual"}
              label={
                <FormattedMessage
                  id="NAME_OF_INDIVIDUAL"
                  defaultMessage="Name of individual"
                />
              }
              required
              helperText={
                nameOfIndividualInvalid
                  ? intl.formatMessage(
                      {
                        id: "GENERIC_CANNOT_BE_BLANK",
                        defaultMessage: "Name of individual cannot be blank",
                      },
                      { name: "Name of individual" } // @TODO internationalize this, too
                    )
                  : ""
              }
              style={{ marginBottom: 10, maxWidth: 400 }}
              onChange={handleNameOfIndividualChange}
              value={nameOfIndividual}
            ></TextField>
          </Grid>
          <Grid item lg={12} sm={12}>
            <TextField
              fullWidth
              error={nameOfIndividualPluralInvalid}
              variant="filled"
              data-testid={"collection-name-of-individual-plural"}
              label={
                <FormattedMessage
                  id="NAME_OF_INDIVIDUAL_PLURAL"
                  defaultMessage="Name of individual plural"
                />
              }
              required
              helperText={
                nameOfIndividualPluralInvalid
                  ? intl.formatMessage(
                      {
                        id: "GENERIC_CANNOT_BE_BLANK",
                        defaultMessage:
                          "Name of individual plural cannot be blank",
                      },
                      { name: "Name of individual plural" } // @TODO internationalize this, too
                    )
                  : ""
              }
              style={{ marginBottom: 10, maxWidth: 400 }}
              onChange={handleNameOfIndividualPluralChange}
              value={nameOfIndividualPlural}
            ></TextField>
          </Grid>
          <Grid item lg={12} sm={12}>
            <TextField
              fullWidth
              error={languageInvalid}
              variant="filled"
              data-testid={"language"}
              label={
                <FormattedMessage id="LANGUAGE" defaultMessage="Language" />
              }
              required
              helperText={
                languageInvalid
                  ? intl.formatMessage(
                      {
                        id: "GENERIC_CANNOT_BE_BLANK",
                        defaultMessage: "Language cannot be blank",
                      },
                      { name: "Language" } // @TODO internationalize this, too
                    )
                  : ""
              }
              style={{ marginBottom: 10, maxWidth: 400 }}
              onChange={handleLanguageChange}
              value={language}
            ></TextField>
          </Grid>
          <Grid item lg={12} sm={12}>
            <div style={{ display: "flex", alignItems: "center" }}>
              <FormControlLabel
                style={{ marginRight: 10 }}
                control={
                  <Checkbox
                    checked={isPrivate}
                    onChange={handleIsPrivateChange}
                  />
                }
                // value={isPrivate}
                // onChange={handleIsPrivateChange}
                label={isPrivateCollectionLabel}
              />
              <InfoIcon
                messageId="IS_PRIVATE_DESCRIPTION"
                defaultMessage="If selected, other users will not be able to discover your collection, nor view and edit the videos within the collection as their privileges permit. In either case, they will not be able to edit the questions that appear during video, individual, or event intake."
              />
            </div>
          </Grid>
          <Grid item lg={12} sm={12}>
            <TextField
              fullWidth
              error={createdByEmailInvalid}
              variant="filled"
              data-testid={"collection-created-by-email"}
              label={
                <FormattedMessage
                  id="CREATED_BY_EMAIL"
                  defaultMessage="Email address of collection creator"
                />
              }
              required
              helperText={
                createdByEmailInvalid
                  ? intl.formatMessage({
                      id: "MUST_BE_VALID_EMAIL",
                      defaultMessage: "Must be a valid email address",
                    })
                  : ""
              }
              style={{ marginBottom: 10, maxWidth: 400 }}
              onChange={handleCreatedByEmailChange}
              value={createdByEmail}
            ></TextField>
          </Grid>
          {/* <Grid item lg={12} sm={12}>
          <Button
            style={{ marginBottom: 10 }}
            data-testid={"collection-details-submit-button"}
            variant="contained"
            disabled={!allRequiredValid}
            onClick={handleCollectionDetailsSubmission}
          >
            <FormattedMessage id="DONE" defaultMessage="Done" />
          </Button>
          {error && <CustomError errorMsg={error} />}
        </Grid> */}
          <Grid item lg={12} sm={12}>
            <Button
              style={{ marginBottom: 10 }}
              data-testid={"collection-details-submit-button"}
              variant="contained"
              disabled={!allRequiredValid}
              onClick={handleCollectionDetailsCreate}
            >
              <FormattedMessage id="CREATE" defaultMessage="Create" />
            </Button>
            {error && <CustomError errorMsg={error} />}
          </Grid>
        </Grid>
      </InfoPanel>
      <Backdrop
        sx={{ color: "#fff", zIndex: (theme) => theme.zIndex.drawer + 1 }}
        open={open}
        onClick={handleClose}
      >
        <CircularProgress color="inherit" />
      </Backdrop>
      <Snackbar
        open={Boolean(isError) || false}
        onClose={handleSnackbarClose}
        autoHideDuration={6000}
        message={isError ? error : "@TODO it worked"}
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

export default CollectionDetailsEdit;
