import { useEffect, useMemo, useState } from "react";

import { map, get } from "lodash-es";

import { Collection, SingleFormField, FormFieldGroup } from "../../types";
import { Button, Grid, Typography } from "@mui/material";
import { FormattedMessage, useIntl } from "react-intl";
import CustomError from "../CustomError";
import InfoPanel from "../InfoPanel";
import SingleVideoIntakeQuestion from "../SingleVideoIntakeQuestion";
import {
  defaultDoNotDisplays,
  shamCollection,
} from "../../dummy_data/dummyCollection";
import useGetCollection from "../../hooks/useGetCollection";
import ComposedFormSubmissionButton from "../ComposedFormSubmissionButton";

const VideoIntakeQuestions: React.FC<{
  collectionUrl: string;
  mode?: string;
}> = ({ collectionUrl, mode = "edit" }) => {
  const {
    isLoading,
    isError,
    errorMsg,
    data: collection,
  } = useGetCollection(collectionUrl);

  const [localCollection, setLocalCollection] = useState<Collection | null>();

  const [videoQuestionFormValues, setVideoQuestionFormValues] = useState<{}>(
    {}
  );
  const [
    arevideoQuestionFormValuesInvalid,
    setArevideoQuestionFormValuesInvalid,
  ] = useState<{}>({});
  const formFieldGroup: FormFieldGroup = useMemo(() => {
    return {
      title: "VideoFormFieldGroupForTheWholeCollection",
      setValues: setVideoQuestionFormValues,
      actualValues: videoQuestionFormValues,
      isInvalids: arevideoQuestionFormValuesInvalid,
      setIsInvalids: setArevideoQuestionFormValuesInvalid,
    };
  }, [arevideoQuestionFormValuesInvalid, videoQuestionFormValues]);

  const [videoIntakeQuestions, setVideoIntakeQuestions] = useState<
    SingleFormField[]
  >([]);

  useEffect(() => {
    if (mode === "create" && videoIntakeQuestions.length < 1) {
      setVideoIntakeQuestions(shamCollection.videoIntakeQuestions || []);
    }
    // else {
    //   // @TODO decide
    //   // return collection?.videoIntakeQuestions;
    // }
  }, [mode, videoIntakeQuestions.length, videoQuestionFormValues]);

  const [error, setError] = useState<string>("");

  const newQuestion: SingleFormField = useMemo(() => {
    return {
      key: get(collection, ["videoIntakeQuestions"], []).length + 1,
      label: "Change Me",
      type: "Text",
      language: "English",
      isRequired: false,
      doNotDisplay: defaultDoNotDisplays,
      invalidInputMessage: "FIELD_CANNOT_BE_BLANK",
      validatorMethods: [],
      shouldBeCheckboxes: ["isRequired"],
    };
  }, [collection]);

  // useEffect(() => {
  //   setCollection((prevState: any) => {
  //     // @TODO LEFT OFF HERE MAKDING usePostCollectionVideoIntakeQuestions
  //     return { ...prevState, videoIntakeQuestions: videoIntakeQuestions };
  //   });
  //   // }
  //   // eslint-disable-next-line react-hooks/exhaustive-deps
  // }, [videoIntakeQuestions]); // I was having trouble with async updating the collection's intakeQuestion array. It seems to have been resolved if I use a local state and then call off to setCollection every time that local thing updates... but then it creates a different problem. See https://github.com/Atticus29/video-annotator/issues/33

  const deleteIntakeQuestion: (questionIdx: number) => void = (questionIdx) => {
    setVideoIntakeQuestions((prevState) => {
      const newVideoIntakeQuestions: SingleFormField[] =
        prevState?.filter((_entry, idx) => {
          return idx !== questionIdx;
        }) || [];
      return newVideoIntakeQuestions;
    });
  };

  const createNewIntakeQuestion: () => void = () => {
    try {
      setVideoIntakeQuestions((prevState: any) => {
        if (prevState) {
          return [...prevState, newQuestion];
        } else {
          return [newQuestion];
        }
      });
    } catch (error: any) {
      setError(error?.message);
    }
  };

  const intakeQuestionElements = map(
    // collection?.videoIntakeQuestions || [],
    videoIntakeQuestions || [],
    (intakeQuestion, intakeQuestionIdx) => {
      const intakeQuesionsInvalid: {} =
        collection?.videoQuestionsFormFieldGroup?.isInvalids || {};
      return map(
        intakeQuestion,
        (intakeQuestionEl, intakeQuestionKey, wholeQuestion) => {
          return (
            <>
              <>
                {intakeQuestionKey === "label" && (
                  <>
                    <Typography style={{ marginBottom: 10 }}>
                      {"Question " + (intakeQuestionIdx + 1) + ". "}
                    </Typography>

                    {!wholeQuestion?.isACoreQuestion && (
                      <Button
                        style={{ marginBottom: 10 }}
                        data-testid={"collection-details-submit-button"}
                        variant="contained"
                        onClick={() => {
                          deleteIntakeQuestion(Number(intakeQuestionIdx));
                        }}
                      >
                        <FormattedMessage
                          id="REMOVE_QUESTION"
                          defaultMessage="Remove this question"
                        />
                      </Button>
                    )}
                  </>
                )}
              </>
              {(!wholeQuestion?.isACoreQuestion ||
                (intakeQuestionKey === "label" &&
                  wholeQuestion?.isACoreQuestion)) && (
                <SingleVideoIntakeQuestion
                  key={intakeQuestionKey}
                  intakeQuestionEl={intakeQuestionEl}
                  intakeQuestionKey={intakeQuestionKey}
                  wholeQuestion={wholeQuestion}
                  intakeQuestionsInvalid={intakeQuesionsInvalid}
                  intakeQuestionIdx={intakeQuestionIdx}
                  collection={collection}
                  setCollection={setLocalCollection}
                  formFieldGroup={formFieldGroup}
                />
              )}
            </>
          );
        }
      );
    }
  );

  return (
    <InfoPanel
      titleId="VIDEO_INTAKE_QUESTIONS"
      titleDefault="Video Intake Questions"
      textOverrides={{ textAlign: "center" }}
    >
      <Grid container>
        {collection?.videoIntakeQuestions && (
          <Grid item lg={12} sm={12}>
            {intakeQuestionElements}
          </Grid>
        )}
        <Grid item lg={12} sm={12}>
          <Button
            style={{ marginBottom: 10 }}
            data-testid={"collection-details-submit-button"}
            variant="contained"
            onClick={createNewIntakeQuestion}
          >
            <FormattedMessage
              id="ADD_ANOTHER_QUESTION"
              defaultMessage="Add another question"
            />
          </Button>
          {error && <CustomError errorMsg={error} />}
        </Grid>
      </Grid>
      <Grid item lg={12} sm={12}>
        <ComposedFormSubmissionButton
          questionsOfConcern={
            [...get(collection, ["videoIntakeQuestions"], [])] || []
          }
          formFieldGroupOfConcern={formFieldGroup}
          collectionPath={collection?.metadata?.urlPath}
          collectionPropToUpdate={"videos"}
          // onCloseDialog={onCloseDialog}
        />
      </Grid>
    </InfoPanel>
  );
};
export default VideoIntakeQuestions;
