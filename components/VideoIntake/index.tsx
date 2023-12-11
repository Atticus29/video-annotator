import { useEffect, useMemo, useState } from "react";

import { Grid } from "@mui/material";
import { map } from "lodash-es";

import { Collection, FormFieldGroup } from "../../types";
import ComposedFormSubmissionButton from "../ComposedFormSubmissionButton";
import InfoPanel from "../InfoPanel";
import InfoPanelBody from "../InfoPanel/InfoPanelBody";
import SingleFormField from "../SingleFormField";
import useFirebaseAuth from "../../hooks/useFirebaseAuth";
import { IntlShape, useIntl } from "react-intl";

const VideoIntake: React.FC<{
  collection: Collection;
  onCloseDialog?: () => void;
}> = ({ collection, onCloseDialog }) => {
  // console.log("deleteMe collection going into VideoIntake is: ");
  // console.log(collection);
  const intl: IntlShape = useIntl();
  const { user, authError } = useFirebaseAuth();
  const [localCollection, setLocalCollection] = useState<Collection>();
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

  useEffect(() => {
    const initialCollection = { ...collection };
    initialCollection.videoQuestionsFormFieldGroup =
      videoQuestionsFormFieldGroup;
    // console.log(
    //   "deleteMe initialCollection formation happens and initialCollection is: "
    // );
    // console.log(initialCollection);
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
        {localCollection?.videoQuestionsFormFieldGroup &&
          localCollection?.videoIntakeQuestions && (
            <Grid item lg={12} sm={12}>
              <ComposedFormSubmissionButton
                questionsOfConcern={localCollection?.videoIntakeQuestions || []}
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
