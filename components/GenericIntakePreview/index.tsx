import { Backdrop, CircularProgress, Grid } from "@mui/material";
import { get, map } from "lodash-es";
import { Collection, FormFieldGroup } from "../../types";
import ComposedFormSubmissionButton from "../ComposedFormSubmissionButton";
import InfoPanel from "../InfoPanel";
import InfoPanelBody from "../InfoPanel/InfoPanelBody";
import SingleFormField from "../SingleFormField";
import useGetCollection from "../../hooks/useGetCollection";
import { useMemo, useState } from "react";

const GenericIntakePreview: React.FC<{
  collectionUrl: string;
  intakeQuestionType: string;
}> = ({ collectionUrl, intakeQuestionType }) => {
  const {
    isLoading,
    isError,
    errorMsg,
    data: collection,
  } = useGetCollection(collectionUrl);
  const [
    previewGenericQuestionFormValues,
    setPreviewGenericQuestionFormValues,
  ] = useState<{}>({});
  const [
    arePreviewGenericQuestionFormValuesInvalid,
    setArePreviewGenericQuestionFormValuesInvalid,
  ] = useState<{}>({});
  const formFieldGroup: FormFieldGroup = useMemo(() => {
    return {
      title: "GenericFormFieldGroupForTheWholeCollection",
      setValues: setPreviewGenericQuestionFormValues,
      actualValues: previewGenericQuestionFormValues,
      isInvalids: arePreviewGenericQuestionFormValuesInvalid,
      setIsInvalids: setArePreviewGenericQuestionFormValuesInvalid,
    };
  }, [
    arePreviewGenericQuestionFormValuesInvalid,
    previewGenericQuestionFormValues,
  ]);

  const titleId: string = (() => {
    switch (intakeQuestionType) {
      case "individual":
        return "INDIVIDUAL_INTAKE_PREVIEW";
      case "video":
        return "VIDEO_INTAKE_PREVIEW";
      case "event":
        return "EVENT_INTAKE_PREVIEW";
      default:
        return "VIDEO_INTAKE_PREVIEW";
    }
  })();

  const titleDefault: string = (() => {
    switch (intakeQuestionType) {
      case "individual":
        return "Individual intake preview";
      case "video":
        return "Video intake preview";
      case "event":
        return "Event intake preview";
      default:
        return "Video intake preview";
    }
  })();

  const bodyId: string = (() => {
    switch (intakeQuestionType) {
      case "individual":
        return "INDIVIDUAL_INTAKE_PREVIEW_DETAILS";
      case "video":
        return "VIDEO_INTAKE_PREVIEW_DETAILS";
      case "event":
        return "EVENT_INTAKE_PREVIEW_DETAILS";
      default:
        return "VIDEO_INTAKE_PREVIEW_DETAILS";
    }
  })();

  const intakeQuestionAccessor: string = (() => {
    switch (intakeQuestionType) {
      case "individual":
        return "individualIntakeQuestions";
      case "video":
        return "videoIntakeQuestions";
      case "event":
        return "eventIntakeQuestions";
      default:
        return "videoIntakeQuestions";
    }
  })();

  const bodyDefault: string =
    "Contributors to your collection will see the following questions when they edit or create new" +
    intakeQuestionType +
    " in the collection: ";

  return (
    <InfoPanel
      titleId={titleId}
      titleDefault={titleDefault}
      textOverrides={{ textAlign: "center" }}
      styleOverrides={{ maxHeight: 1000 }}
    >
      <InfoPanelBody bodyId={bodyId} bodyDefault={bodyDefault} />
      <Backdrop
        sx={{ color: "#fff", zIndex: (theme) => theme.zIndex.drawer + 1 }}
        open={isLoading}
      >
        <CircularProgress color="inherit" />
      </Backdrop>
      {!isLoading && !isError && (
        <Grid container>
          {map(
            get(collection, intakeQuestionAccessor),
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
              <ComposedFormSubmissionButton // @TODO think about either removing or rendering impotent because preview mode. But right now, it's broken
                questionsOfConcern={
                  get(collection, intakeQuestionAccessor) || []
                }
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
export default GenericIntakePreview;
