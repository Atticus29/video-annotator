import { useEffect, useMemo, useState } from "react";

import { Grid } from "@mui/material";
import { get, map } from "lodash-es";

import { Collection, FormFieldGroup } from "../../types";
import ComposedFormSubmissionButton from "../ComposedFormSubmissionButton";
import InfoPanel from "../InfoPanel";
import InfoPanelBody from "../InfoPanel/InfoPanelBody";
import SingleFormField from "../SingleFormField";
import useFirebaseAuth from "../../hooks/useFirebaseAuth";

const VideoIntake: React.FC<{
  collection: Collection;
}> = ({ collection }) => {
  console.log("deleteMe collection going into VideoIntake is: ");
  console.log(collection);
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
    setLocalCollection(initialCollection);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [user]);

  return (
    <InfoPanel
      titleId="SUBMIT_NEW_VIDEO"
      titleDefault="Submit a New Video"
      textOverrides={{ textAlign: "center" }}
      styleOverrides={{ maxHeight: 1000 }}
    >
      <InfoPanelBody
        bodyId="VIDEO_INTAKE_DETAILS"
        bodyDefault="To add a video to the collection, fill out the form below."
      />
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
                formFieldGroupOfConcern={
                  localCollection?.videoQuestionsFormFieldGroup
                }
                collection={localCollection}
              />
            </Grid>
          )}
      </Grid>
    </InfoPanel>
  );
};
export default VideoIntake;
