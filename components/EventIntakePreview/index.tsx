import { Backdrop, CircularProgress, Grid } from "@mui/material";
import { map } from "lodash-es";
import { FormFieldGroup } from "../../types";
import ComposedFormSubmissionButton from "../ComposedFormSubmissionButton";
import InfoPanel from "../InfoPanel";
import InfoPanelBody from "../InfoPanel/InfoPanelBody";
import SingleFormField from "../SingleFormField";
import useGetCollection from "../../hooks/useGetCollection";
import { useMemo, useState } from "react";
import { IntlShape, useIntl } from "react-intl";

const EventIntakePreview: React.FC<{
  collectionUrl: string;
}> = ({ collectionUrl }) => {
  const {
    isLoading,
    isError,
    errorMsg,
    data: collection,
  } = useGetCollection(collectionUrl);

  const intl: IntlShape = useIntl();

  const [previewEventQuestionFormValues, setPreviewEventQuestionFormValues] =
    useState<{}>({});
  const [
    arePreviewEventQuestionFormValuesInvalid,
    setArePreviewEventQuestionFormValuesInvalid,
  ] = useState<{}>({});
  const formFieldGroup: FormFieldGroup = useMemo(() => {
    return {
      title: "EventFormFieldGroupForTheWholeCollection",
      setValues: setPreviewEventQuestionFormValues,
      actualValues: previewEventQuestionFormValues,
      isInvalids: arePreviewEventQuestionFormValuesInvalid,
      setIsInvalids: setArePreviewEventQuestionFormValuesInvalid,
    };
  }, [
    arePreviewEventQuestionFormValuesInvalid,
    previewEventQuestionFormValues,
  ]);

  return (
    <InfoPanel
      titleDefault={intl.formatMessage(
        { id: "GENERIC_INTAKE_PREVIEW" },
        { type: "Event" }
      )}
      // titleDefault="Event Intake Preview"
      textOverrides={{ textAlign: "center" }}
      styleOverrides={{ maxHeight: 1000 }}
    >
      <InfoPanelBody
        bodyId="INTAKE_PREVIEW_DETAILS"
        bodyDefault="Contributors to your collection will see the following questions when they submit new events to the collection (as well as a submit button): "
      />
      <Backdrop
        sx={{ color: "#fff", zIndex: (theme) => theme.zIndex.drawer + 1 }}
        open={isLoading}
      >
        <CircularProgress color="inherit" />
      </Backdrop>
      {!isLoading && !isError && (
        <Grid container>
          {map(
            collection?.eventIntakeQuestions,
            (intakeQuestion, intakeQuestionIdx) => {
              if (intakeQuestion) {
                return (
                  <Grid item lg={12} sm={12} key={intakeQuestionIdx}>
                    <SingleFormField
                      key={intakeQuestionIdx}
                      question={intakeQuestion}
                      formFieldGroup={formFieldGroup}
                    />
                  </Grid>
                );
              }
            }
          )}
          {collection?.eventQuestionsFormFieldGroup &&
            collection?.eventIntakeQuestions && (
              <Grid item lg={12} sm={12}>
                <ComposedFormSubmissionButton
                  questionsOfConcern={collection?.eventIntakeQuestions || []}
                  formFieldGroupOfConcern={formFieldGroup}
                  collection={collection}
                />
              </Grid>
            )}
        </Grid>
      )}
    </InfoPanel>
  );
};
export default EventIntakePreview;
