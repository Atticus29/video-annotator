import { Backdrop, CircularProgress, Grid } from "@mui/material";
import { get, map } from "lodash-es";
import { Collection, FormFieldGroup } from "../../types";
import ComposedFormSubmissionButton from "../ComposedFormSubmissionButton";
import InfoPanel from "../InfoPanel";
import InfoPanelBody from "../InfoPanel/InfoPanelBody";
import SingleFormField from "../SingleFormField";
import useGetCollection from "../../hooks/useGetCollection";
import { useMemo, useState } from "react";

const IndividualIntakePreview: React.FC<{
  collectionUrl: string;
}> = ({ collectionUrl }) => {
  const {
    isLoading,
    isError,
    errorMsg,
    data: collection,
  } = useGetCollection(collectionUrl);
  const [
    previewIndividualQuestionFormValues,
    setPreviewIndividualQuestionFormValues,
  ] = useState<{}>({});
  const [
    arePreviewIndividualQuestionFormValuesInvalid,
    setArePreviewIndividualQuestionFormValuesInvalid,
  ] = useState<{}>({});
  const formFieldGroup: FormFieldGroup = useMemo(() => {
    return {
      title: "IndividualFormFieldGroupForTheWholeCollection",
      setValues: setPreviewIndividualQuestionFormValues,
      actualValues: previewIndividualQuestionFormValues,
      isInvalids: arePreviewIndividualQuestionFormValuesInvalid,
      setIsInvalids: setArePreviewIndividualQuestionFormValuesInvalid,
    };
  }, [
    arePreviewIndividualQuestionFormValuesInvalid,
    previewIndividualQuestionFormValues,
  ]);

  // const formFieldGroup: FormFieldGroup | undefined = get(
  //   collection,
  //   "individualQuestionsFormFieldGroup"
  // );

  return (
    <InfoPanel
      titleId="INDIVIDUAL_INTAKE_PREVIEW"
      titleDefault="Individual Intake Preview"
      textOverrides={{ textAlign: "center" }}
      styleOverrides={{ maxHeight: 1000 }}
    >
      <InfoPanelBody
        bodyId="INDIVIDUAL_INTAKE_PREVIEW_DETAILS"
        bodyDefault="Contributors to your collection will see the following questions when they edit or create new individuals in the collection: "
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
            collection?.individualIntakeQuestions,
            (intakeQuestion, intakeQuestionIdx) => {
              if (intakeQuestion) {
                return (
                  <Grid item lg={12} sm={12} key={intakeQuestion?.label}>
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
          {collection?.individualQuestionsFormFieldGroup && (
            <Grid item lg={12} sm={12}>
              <ComposedFormSubmissionButton
                questionsOfConcern={collection?.individualIntakeQuestions || []}
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
export default IndividualIntakePreview;
