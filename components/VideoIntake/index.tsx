import { useEffect, useMemo, useState } from "react";

import { Button, Dialog, DialogContent, Grid } from "@mui/material";
import { get, map, reduce } from "lodash-es";

import { Collection, FormFieldGroup } from "../../types";
import ComposedFormSubmissionButton from "../ComposedFormSubmissionButton";
import InfoPanel from "../InfoPanel";
import InfoPanelBody from "../InfoPanel/InfoPanelBody";
import SingleFormField from "../SingleFormField";
import useFirebaseAuth from "../../hooks/useFirebaseAuth";
import { FormattedMessage, IntlShape, useIntl } from "react-intl";
import IndividualIntake from "../IndividualIntake";
import { useQueryClient } from "react-query";
import DataTable from "../DataTable";
import { GridCallbackDetails, GridRowSelectionModel } from "@mui/x-data-grid";
import { individualsQuestion } from "../../dummy_data/dummyCollection";

const VideoIntake: React.FC<{
  collection: Collection;
  onCloseDialog?: () => void;
}> = ({ collection, onCloseDialog }) => {
  const intl: IntlShape = useIntl();
  const { user, authError } = useFirebaseAuth();
  const queryClient = useQueryClient();
  const [localCollection, setLocalCollection] = useState<Collection>();

  const [calculatedIndividualTableHeight, setCalculatedIndividualTableHeight] =
    useState<number>(9.4);
  useEffect(() => {
    const numIndividualsRows: number =
      localCollection?.individuals?.length || 1;
    setCalculatedIndividualTableHeight(9.4 + 2.51 * (numIndividualsRows - 1));
  }, [localCollection?.individuals?.length]);

  const [videoQuestionFormValues, setVideoQuestionFormValues] = useState<{}>(
    {}
  );
  const [
    arevideoQuestionFormValuesInvalid,
    setArevideoQuestionFormValuesInvalid,
  ] = useState<{}>({});

  // const [localSelectedIds, setLocalSelectedIds] = useState<string[]>([]);

  const videoQuestionsFormFieldGroup: FormFieldGroup = useMemo(() => {
    return {
      title: "VideoFormFieldGroupForTheLocalCollection",
      setValues: setVideoQuestionFormValues,
      actualValues: videoQuestionFormValues,
      isInvalids: arevideoQuestionFormValuesInvalid,
      setIsInvalids: setArevideoQuestionFormValuesInvalid,
    };
  }, [arevideoQuestionFormValuesInvalid, videoQuestionFormValues]);

  useEffect(() => {
    const initialCollection = { ...collection };
    initialCollection.videoQuestionsFormFieldGroup =
      videoQuestionsFormFieldGroup;
    setLocalCollection(initialCollection);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [user]);

  const titleId: string = intl.formatMessage(
    { id: "SUBMIT_NEW_VIDEO", defaultMessage: "Submit new {videoName}" },
    { videoName: collection.nameOfVideo }
  );

  const bodyId: string = intl.formatMessage(
    {
      id: "VIDEO_INTAKE_DETAILS",
      defaultMessage:
        "To add a {videoName} to the collection, fill out the form below.",
    },
    { videoName: collection?.nameOfVideo?.toLowerCase() }
  );

  const [showIndividualCreationDialog, setShowIndividualCreationDialog] =
    useState<boolean>(false);

  const handleNewIndividualClick = () => {
    setShowIndividualCreationDialog(true);
  };
  const individualColNamesToDisplay: {} = useMemo(() => {
    if (localCollection?.individualIntakeQuestions) {
      return reduce(
        localCollection?.individualIntakeQuestions,
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
  }, [localCollection?.individualIntakeQuestions]);

  const handleCreateVideoDialogClose = () => {
    // @TODO can combine this with handleCreateIndividualDialogClose
    setShowIndividualCreationDialog(false);
    const queryKey = ["singleCollection", localCollection?.urlPath];
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
  const videoFallback: string = intl.formatMessage({ id: "VIDEO" });
  const individualFallback: string = intl.formatMessage({
    id: "INDIVIDUAL",
  });
  const individualsFallback: string = intl.formatMessage({
    id: "INDIVIDUALS_PLURAL",
  });
  const individualsTableText: string = intl.formatMessage(
    { id: "ADD_INDIVIDUAL_TO_VIDEO" },
    {
      individualName: localCollection?.nameOfIndividual || individualFallback,
      individualNamePlural:
        localCollection?.nameOfIndividualPlural || individualsFallback,
      videoName: localCollection?.nameOfVideo || videoFallback,
    }
  );

  const localOnRowSelectionModelChange: (
    rowSelectionModel: GridRowSelectionModel,
    details: GridCallbackDetails
  ) => void = (rowSelectionModel, _) => {
    const selectedIds: string[] = map(rowSelectionModel, (selectedRow) => {
      return get(localCollection, [
        "individuals",
        Number(selectedRow) - 1,
        "id",
      ]);
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
      videoQuestionsFormFieldGroup.setIsInvalids({
        ...videoQuestionsFormFieldGroup.isInvalids,
        Individuals: isIndividualsInvalid,
      });
    }
    // setLocalSelectedIds(selectedIds);
    // return selectedIds;
  };

  return (
    <InfoPanel
      titleId={titleId}
      titleDefault={titleId}
      textOverrides={{ textAlign: "center" }}
      // styleOverrides={{ maxHeight: 1500 }}
    >
      <InfoPanelBody bodyId={bodyId} bodyDefault={bodyId} />
      <Grid container>
        {map(
          localCollection?.videoIntakeQuestions,
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
        {/* @TODO add invidual addition */}
        {localCollection && (
          <>
            {/* Show individual table if individuals.length >0 */}
            {get(localCollection, ["individuals"], []).length > 0 && (
              <Grid item lg={12} sm={12} key="individual-table">
                <DataTable
                  tableTitle={individualsTableText}
                  data={localCollection?.individuals || []}
                  colNamesToDisplay={individualColNamesToDisplay}
                  targetColIdxForUrlPath={0}
                  styleOverrides={{
                    minHeight: 0,
                    height: calculatedIndividualTableHeight + "rem",
                    maxHeight: "50vh",
                  }}
                  linkUrls={{
                    view:
                      "/collection/" + localCollection.urlPath + "/individual/",
                  }}
                  dataGridOptions={{
                    checkboxSelection: true,
                    disableRowSelectionOnClick: true,
                    onRowSelectionModelChange: localOnRowSelectionModelChange,
                  }}
                ></DataTable>
              </Grid>
            )}
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
                    individualName: localCollection?.nameOfIndividual,
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
                  collection={localCollection}
                  onCloseDialog={handleCreateVideoDialogClose}
                ></IndividualIntake>
              </DialogContent>
            </Dialog>
          </>
        )}

        {localCollection?.videoQuestionsFormFieldGroup &&
          localCollection?.videoIntakeQuestions && (
            <Grid item lg={12} sm={12}>
              <ComposedFormSubmissionButton
                questionsOfConcern={
                  [
                    ...get(localCollection, ["videoIntakeQuestions"], []),
                    individualsQuestion,
                  ] || []
                }
                formFieldGroupOfConcern={videoQuestionsFormFieldGroup}
                collectionPath={localCollection?.urlPath}
                collectionPropToUpdate={"videos"}
                onCloseDialog={onCloseDialog}
              />
            </Grid>
          )}
      </Grid>
    </InfoPanel>
  );
};
export default VideoIntake;
