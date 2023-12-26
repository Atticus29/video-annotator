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

const IndividualIntake: React.FC<{
  collection: Collection;
  onCloseDialog?: () => void;
  setCollection?: (collection: any) => void;
}> = ({ collection, onCloseDialog, setCollection }) => {
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
    { individualName: collection?.nameOfIndividual || defaultIndividualName }
  );

  const bodyId: string = intl.formatMessage(
    {
      id: "INDIVIDUAL_INTAKE_DETAILS",
      defaultMessage:
        "To add a {individualName} to the {videoName}, fill out the form below.",
    },
    {
      individualName: collection?.nameOfIndividual?.toLowerCase(),
      videoName: collection?.nameOfVideo?.toLowerCase(),
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
        {/* @TODO add invidual addition */}
        {localCollection?.individualQuestionsFormFieldGroup &&
          localCollection?.individualIntakeQuestions && (
            <>
              <Grid item lg={12} sm={12}>
                <ComposedFormSubmissionButton
                  questionsOfConcern={
                    localCollection?.individualIntakeQuestions || []
                  }
                  formFieldGroupOfConcern={individualQuestionsFormFieldGroup}
                  collectionPath={localCollection?.urlPath}
                  collectionPropToUpdate={"individuals"}
                  onCloseDialog={onCloseDialog}
                  setCollection={setCollection}
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
