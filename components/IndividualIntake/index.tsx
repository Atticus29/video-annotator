import { useEffect, useMemo, useState } from "react";

import { Button, Grid } from "@mui/material";
import { map } from "lodash-es";

import { Collection, FormFieldGroup } from "../../types";
import ComposedFormSubmissionButton from "../ComposedFormSubmissionButton";
import InfoPanel from "../InfoPanel";
import InfoPanelBody from "../InfoPanel/InfoPanelBody";
import SingleFormField from "../SingleFormField";
import useFirebaseAuth from "../../hooks/useFirebaseAuth";
import { FormattedMessage, IntlShape, useIntl } from "react-intl";
import SaveOrUpdateButtonWithValidation from "../SaveOrUpdateButtonWithValidation";
import { capitalizeEachWord } from "../../utilities/textUtils";
import usePostIndividual from "../../hooks/usePostIndividual";
import { QueryClient, useQueryClient } from "@tanstack/react-query";
import useOnEnter from "../../hooks/useOnEnter";

const IndividualIntake: React.FC<{
  collection: Collection;
  onCloseDialog?: () => void;
}> = ({ collection, onCloseDialog }) => {
  const intl: IntlShape = useIntl();
  const defaultIndividualName: string = intl.formatMessage({
    id: "INDIVIDUAL",
  });
  const { user, authError } = useFirebaseAuth();

  const [localCollection, setLocalCollection] = useState<Collection>();
  const [individualQuestionFormValues, setIndividualQuestionFormValues] =
    useState<{}>({});
  const [
    areIndividualQuestionFormValuesInvalid,
    setAreIndividualQuestionFormValuesInvalid,
  ] = useState<{}>({});
  const [individualCreated, setIndividualCreated] = useState<boolean>(false);
  const queryClient = useQueryClient();

  useEffect(() => {
    if (individualCreated) {
      queryClient.invalidateQueries({
        queryKey: ["individualsFor", collection?.metadata?.urlPath],
      });
    }
  }, [collection?.metadata?.urlPath, individualCreated, queryClient]);

  const individualQuestionsFormFieldGroup: FormFieldGroup = useMemo(() => {
    return {
      title: "VideoFormFieldGroupForTheLocalCollection",
      setValues: setIndividualQuestionFormValues,
      actualValues: individualQuestionFormValues,
      isInvalids: areIndividualQuestionFormValuesInvalid,
      setIsInvalids: setAreIndividualQuestionFormValuesInvalid,
    };
  }, [areIndividualQuestionFormValuesInvalid, individualQuestionFormValues]);

  useEffect(() => {
    const initialCollection = { ...collection };
    initialCollection.individualQuestionsFormFieldGroup =
      individualQuestionsFormFieldGroup;
    setLocalCollection(initialCollection);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [user]);

  const titleId: string = intl.formatMessage(
    {
      id: "SUBMIT_NEW_INDIVIDUAL",
      defaultMessage: "Submit a New {individualName}",
    },
    {
      individualName:
        collection.metadata.nameOfIndividual || defaultIndividualName,
    }
  );

  const bodyId: string = intl.formatMessage(
    {
      id: "INDIVIDUAL_INTAKE_DETAILS",
      defaultMessage:
        "To add a {individualName} to the {videoName}, fill out the form below.",
    },
    {
      individualName: collection.metadata.nameOfIndividual?.toLowerCase(),
      videoName: collection.metadata.nameOfVideo?.toLowerCase(),
    }
  );

  return (
    <InfoPanel
      titleId={titleId}
      titleDefault={titleId}
      textOverrides={{ textAlign: "center" }}
      styleOverrides={{ maxHeight: 1000 }}
    >
      <InfoPanelBody bodyId={bodyId} bodyDefault={bodyId} />
      <Grid container>
        {map(
          localCollection?.individualIntakeQuestions,
          (intakeQuestion, intakeQuestionIdx) => {
            if (intakeQuestion) {
              return (
                <Grid item lg={12} sm={12} key={intakeQuestionIdx}>
                  <SingleFormField
                    question={intakeQuestion}
                    formFieldGroup={individualQuestionsFormFieldGroup}
                    key={intakeQuestionIdx}
                  />
                </Grid>
              );
            }
          }
        )}
        {localCollection?.individualQuestionsFormFieldGroup &&
          localCollection?.individualIntakeQuestions && (
            <>
              <Grid item lg={12} sm={12}>
                <SaveOrUpdateButtonWithValidation
                  disabled={!Boolean(collection)}
                  buttonTitle="CREATE"
                  successMsg={intl.formatMessage({
                    id: "INDIVIDUAL_SUCCESSFULLY_CREATED",
                    defaultMessage: "Individual successfully created",
                  })}
                  failMsg={intl.formatMessage({
                    id: "INDIVIDUAL_CREATION_FAILED",
                    defaultMessage: "Individual creation failed",
                  })}
                  usePostOrUseUpdate={usePostIndividual}
                  mutationData={{
                    collectionUrl: collection?.metadata?.urlPath,
                    individualData:
                      individualQuestionsFormFieldGroup?.actualValues || [],
                  }}
                  actualValues={individualQuestionsFormFieldGroup.actualValues}
                  invalidValues={individualQuestionsFormFieldGroup.isInvalids}
                  setParentStateOnSuccess={setIndividualCreated}
                  queryKeysToInvalidate={[
                    ["singleCollection", collection?.metadata?.urlPath || ""],
                  ]}
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
export default IndividualIntake;
