import { useMemo, useState } from "react";

import { Alert, Button, Dialog, DialogContent, Grid } from "@mui/material";
import { get, map } from "lodash-es";

import { Collection, FormFieldGroup } from "../../types";
import ComposedFormSubmissionButton from "../ComposedFormSubmissionButton";
import InfoPanel from "../InfoPanel";
import InfoPanelBody from "../InfoPanel/InfoPanelBody";
import SingleFormField from "../SingleFormField";
import useFirebaseAuth from "../../hooks/useFirebaseAuth";
import { FormattedMessage, IntlShape, useIntl } from "react-intl";
import IndividualIntake from "../IndividualIntake";
import { useQueryClient } from "@tanstack/react-query";
import { GridCallbackDetails, GridRowSelectionModel } from "@mui/x-data-grid";
import { individualsQuestion } from "../../dummy_data/dummyCollection";
import IndividualsTableView from "../IndividualsTableView";

const VideoIntake: React.FC<{
  collection: Collection;
  onCloseDialog?: () => void;
}> = ({ collection, onCloseDialog }) => {
  const intl: IntlShape = useIntl();
  const { user, authError } = useFirebaseAuth();

  const queryClient = useQueryClient();
  const [localIsIndividualsInvalid, setLocalIsIndividualsInvalid] =
    useState<boolean>(false);

  const [videoQuestionFormValues, setVideoQuestionFormValues] = useState<{}>(
    {}
  );
  const [
    arevideoQuestionFormValuesInvalid,
    setArevideoQuestionFormValuesInvalid,
  ] = useState<{}>({});

  const videoQuestionsFormFieldGroup: FormFieldGroup = useMemo(() => {
    return {
      title: "VideoFormFieldGroupForTheLocalCollection",
      setValues: setVideoQuestionFormValues,
      actualValues: videoQuestionFormValues,
      isInvalids: arevideoQuestionFormValuesInvalid,
      setIsInvalids: setArevideoQuestionFormValuesInvalid,
    };
  }, [arevideoQuestionFormValuesInvalid, videoQuestionFormValues]);

  const titleId: string = intl.formatMessage(
    { id: "SUBMIT_NEW_VIDEO", defaultMessage: "Submit new {videoName}" },
    { videoName: collection.metadata.nameOfVideo }
  );

  const bodyId: string = intl.formatMessage(
    {
      id: "VIDEO_INTAKE_DETAILS",
      defaultMessage:
        "To add a {videoName} to the collection, fill out the form below.",
    },
    { videoName: collection.metadata.nameOfVideo?.toLowerCase() }
  );

  const [showIndividualCreationDialog, setShowIndividualCreationDialog] =
    useState<boolean>(false);

  const handleNewIndividualClick = () => {
    setShowIndividualCreationDialog(true);
  };

  const handleCreateVideoDialogClose = () => {
    // @TODO can combine this with handleCreateIndividualDialogClose
    setShowIndividualCreationDialog(false);
    const queryKey = ["singleCollection", collection.metadata.urlPath];
    const queryCache = queryClient.getQueryCache();
    let queryState = queryCache.find({ queryKey: queryKey });
    if (queryState) {
      console.log(
        `VideoIntake Before Query with key ${queryKey} is in the cache.`
      );
    } else {
      console.log(
        `VideoIntake Before Query with key ${queryKey} is NOT in the cache.`
      );
    }
    // queryClient.invalidateQueries();
    queryClient.invalidateQueries({ queryKey: queryKey });
    queryState = queryCache.find({ queryKey: queryKey });
    if (queryState) {
      console.log(
        `VideoIntake After Query with key ${queryKey} is in the cache.`
      );
    } else {
      console.log(
        `VideoIntake After Query with key ${queryKey} is NOT in the cache.`
      );
    }
  };
  const videoFallback: string = intl.formatMessage({ id: "VIDEO" });
  const individualFallback: string = intl.formatMessage({
    id: "INDIVIDUAL",
  });
  const individualsFallback: string = intl.formatMessage({
    id: "INDIVIDUALS_PLURAL",
  });
  const asteriskIfRequired: string = individualsQuestion?.isRequired ? "*" : "";
  const individualsTableText: string =
    intl.formatMessage(
      { id: "ADD_INDIVIDUAL_TO_VIDEO" },
      {
        individualName:
          collection.metadata.nameOfIndividual || individualFallback,
        individualNamePlural:
          collection.metadata.nameOfIndividualPlural || individualsFallback,
        videoName: collection.metadata.nameOfVideo || videoFallback,
      }
    ) + asteriskIfRequired;

  const localOnRowSelectionModelChange: (
    rowSelectionModel: GridRowSelectionModel,
    details: GridCallbackDetails
  ) => void = (rowSelectionModel, _) => {
    const selectedIds: string[] = map(rowSelectionModel, (selectedRow) => {
      return get(collection, ["individuals", Number(selectedRow) - 1, "id"]);
    });
    setVideoQuestionFormValues({
      ...videoQuestionFormValues,
      Individuals: selectedIds,
    });
    if (
      videoQuestionsFormFieldGroup &&
      videoQuestionsFormFieldGroup.setIsInvalids
    ) {
      const isIndividualsRequired = individualsQuestion?.isRequired;
      const isIndividualsInvalid = isIndividualsRequired
        ? selectedIds.length > 0
          ? false
          : true
        : false;
      setLocalIsIndividualsInvalid(isIndividualsInvalid);
      videoQuestionsFormFieldGroup.setIsInvalids({
        ...videoQuestionsFormFieldGroup.isInvalids,
        Individuals: isIndividualsInvalid,
      });
    }
  };

  return (
    <InfoPanel
      titleId={titleId}
      titleDefault={titleId}
      textOverrides={{ textAlign: "center" }}
    >
      <InfoPanelBody bodyId={bodyId} bodyDefault={bodyId} />
      <Grid container>
        {map(
          collection?.videoIntakeQuestions,
          (intakeQuestion, intakeQuestionIdx) => {
            if (intakeQuestion) {
              return (
                <Grid item lg={12} sm={12} key={intakeQuestionIdx}>
                  <SingleFormField
                    question={intakeQuestion}
                    formFieldGroup={videoQuestionsFormFieldGroup}
                    key={intakeQuestionIdx}
                  />
                </Grid>
              );
            }
          }
        )}
        {collection && (
          <>
            <Grid item lg={12} sm={12} key="individual-table">
              <IndividualsTableView
                collectionUrl={get(collection, ["metadata", "urlPath"], "")}
                tableTitle={individualsTableText}
                individualIntakeQuestions={get(
                  collection,
                  "individualIntakeQuestions",
                  []
                )}
                dataGridOptions={{
                  checkboxSelection: true,
                  disableRowSelectionOnClick: true,
                  onRowSelectionModelChange: localOnRowSelectionModelChange,
                }}
              />
              {localIsIndividualsInvalid && (
                <Alert
                  style={{ textAlign: "center", marginBottom: "1rem" }}
                  severity="error"
                >
                  <FormattedMessage
                    id="MUST_SELECT_AT_LEAST_ONE_INDIVIDUAL"
                    defaultMessage="You must select at least one individual"
                  ></FormattedMessage>
                </Alert>
              )}
            </Grid>
            {/* )} */}
            <Grid item lg={12} sm={12} key="individual-creation-button">
              <Button
                data-testid={"new-video-add-button"}
                variant="contained"
                onClick={handleNewIndividualClick}
                style={{ marginBottom: "1rem" }}
              >
                <FormattedMessage
                  id="SUBMIT_NEW_INDIVIDUAL"
                  defaultMessage="Create a New {individualName}"
                  values={{
                    individualName: collection.metadata.nameOfIndividual,
                  }}
                />
              </Button>
            </Grid>
            <Dialog
              open={showIndividualCreationDialog}
              onClose={handleCreateVideoDialogClose}
            >
              <DialogContent>
                <IndividualIntake
                  collection={collection}
                  onCloseDialog={handleCreateVideoDialogClose}
                ></IndividualIntake>
              </DialogContent>
            </Dialog>
          </>
        )}

        {videoQuestionsFormFieldGroup && collection?.videoIntakeQuestions && (
          <>
            <Grid item lg={12} sm={12}>
              <ComposedFormSubmissionButton
                questionsOfConcern={
                  [
                    ...get(collection, ["videoIntakeQuestions"], []),
                    individualsQuestion,
                  ] || []
                }
                formFieldGroupOfConcern={videoQuestionsFormFieldGroup}
                collectionPath={collection.metadata.urlPath}
                collectionPropToUpdate={"videos"}
                onCloseDialog={onCloseDialog}
              />
            </Grid>
            <Grid item lg={12} sm={12}>
              <Button variant="contained" onClick={onCloseDialog}>
                <FormattedMessage id="CLOSE" defaultMessage="Close" />
              </Button>
            </Grid>
          </>
        )}
      </Grid>
    </InfoPanel>
  );
};
export default VideoIntake;
