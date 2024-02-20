import { Backdrop, CircularProgress, Grid } from "@mui/material";
import { get, map } from "lodash-es";
import { Collection, FormFieldGroup } from "../../types";
import ComposedFormSubmissionButton from "../ComposedFormSubmissionButton";
import InfoPanel from "../InfoPanel";
import InfoPanelBody from "../InfoPanel/InfoPanelBody";
import SingleFormField from "../SingleFormField";
import useGetCollection from "../../hooks/useGetCollection";
import { useMemo, useState } from "react";

const VideoIntakePreview: React.FC<{
  collectionUrl: string;
}> = ({ collectionUrl }) => {
  const {
    isLoading,
    isError,
    errorMsg,
    data: collection,
  } = useGetCollection(collectionUrl);

  const [previewVideoQuestionFormValues, setPreviewVideoQuestionFormValues] =
    useState<{}>({});
  const [
    arePreviewVideoQuestionFormValuesInvalid,
    setArePreviewVideoQuestionFormValuesInvalid,
  ] = useState<{}>({});
  const formFieldGroup: FormFieldGroup = useMemo(() => {
    return {
      title: "VideoFormFieldGroupForTheWholeCollection",
      setValues: setPreviewVideoQuestionFormValues,
      actualValues: previewVideoQuestionFormValues,
      isInvalids: arePreviewVideoQuestionFormValuesInvalid,
      setIsInvalids: setArePreviewVideoQuestionFormValuesInvalid,
    };
  }, [
    arePreviewVideoQuestionFormValuesInvalid,
    previewVideoQuestionFormValues,
  ]);

  return (
    <InfoPanel
      titleId="VIDEO_INTAKE_PREVIEW"
      titleDefault="Video Intake Preview"
      textOverrides={{ textAlign: "center" }}
      styleOverrides={{ maxHeight: 1000 }}
    >
      <InfoPanelBody
        bodyId="INTAKE_PREVIEW_DETAILS"
        bodyDefault="Contributors to your collection will see the following questions when they submit new videos to the collection (as well as a submit button): "
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
            collection?.videoIntakeQuestions,
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
          {collection?.videoQuestionsFormFieldGroup &&
            collection?.videoIntakeQuestions && (
              <Grid item lg={12} sm={12}>
                <ComposedFormSubmissionButton
                  questionsOfConcern={collection?.videoIntakeQuestions || []}
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
export default VideoIntakePreview;
