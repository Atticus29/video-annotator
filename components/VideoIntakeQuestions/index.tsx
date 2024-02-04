import { useEffect, useMemo, useState } from "react";

import { map, get } from "lodash-es";

import { Collection, SingleFormField, FormFieldGroup } from "../../types";
import { Button, CircularProgress, Grid, Typography } from "@mui/material";
import { FormattedMessage, IntlShape, useIntl } from "react-intl";
import CustomError from "../CustomError";
import InfoPanel from "../InfoPanel";
import SingleVideoIntakeQuestion from "../SingleVideoIntakeQuestion";
import {
  defaultDoNotDisplays,
  shamCollection,
  shamCollectionShell,
} from "../../dummy_data/dummyCollection";
import useGetCollection from "../../hooks/useGetCollection";
import ComposedFormSubmissionButton from "../ComposedFormSubmissionButton";
import usePostCollectionVideoIntakeQuestions from "../../hooks/usePostCollectionVideoIntakeQuestions";
import useUpdateCollectionVideoIntakeQuestions from "../../hooks/useUpdateCollectionVideoIntakeQuestions";
import ComposedFormSubmissionButtonVideoIntakeQuestions from "../ComposedFormSubmissionButtonVideoIntakeQuestions";
import SingleVideoIntakeQuestionV2 from "../SingleVideoIntakeQuestionV2";

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

  const intl: IntlShape = useIntl();

  const {
    mutate: postCollectionVideoIntakeQuestions,
    isPending,
    isError: isPostCollectionVideoIntakeQuestionsError,
    error: postCollectionVideoIntakeQuestionError,
  } = usePostCollectionVideoIntakeQuestions();

  const {
    mutate: updateCollectionVideoIntakeQuestions,
    isPending: isUpdateCollectionVideoIntakeQuestionsPending,
    isError: isUpdateCollectionVideoIntakeQuestionsError,
    error: updateCollectionVideoIntakeQuestionError,
  } = useUpdateCollectionVideoIntakeQuestions();

  const [localCollection, setLocalCollection] =
    useState<Collection>(shamCollectionShell);

  useEffect(() => {
    setLocalCollection(collection);
  }, [collection]);

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
    if (
      mode === "create" &&
      videoIntakeQuestions.length < 1 &&
      (shamCollection?.videoIntakeQuestions || []).length > 0 // @TODO this smells like an antipattern
    ) {
      setVideoIntakeQuestions(shamCollection.videoIntakeQuestions || []);
      // postCollectionVideoIntakeQuestions(
      //   {
      //     collectionUrl: collectionUrl,
      //     collectionVideoIntakeQuestions:
      //       shamCollection.videoIntakeQuestions || [],
      //   },
      //   {
      //     onSuccess: (responseData) => {
      //       console.log("Mutation successful a1", responseData);
      //     },
      //     onError: (error) => {
      //       // Handle error
      //       console.error("Mutation error", error);
      //     },
      //   }
      // );
    }
    // else {
    //   // @TODO decide
    //   // return collection?.videoIntakeQuestions;
    // }
  }, [
    collectionUrl,
    mode,
    postCollectionVideoIntakeQuestions,
    videoIntakeQuestions.length,
    videoQuestionFormValues,
  ]);

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

  useEffect(() => {
    postCollectionVideoIntakeQuestions(
      {
        collectionUrl: collectionUrl,
        collectionVideoIntakeQuestions: videoIntakeQuestions,
      },
      {
        onSuccess: (responseData) => {
          console.log("deleteMe success got here and responseData is: ");
          console.log(responseData);
        },
        onError: (error) => {
          console.log("deleteMe error is: ");
          console.log(error);
        },
      }
    );
    // setCollection((prevState: any) => { // @TODO deleteMe after the above proves successful
    //   return { ...prevState, videoIntakeQuestions: videoIntakeQuestions };
    // });
    // }
    // eslint-disable-next-line react-hooks/exhaustive-deps
    // }, [videoIntakeQuestions]); // I was having trouble with async updating the collection's intakeQuestion array. It seems to have been resolved if I use a local state and then call off to setCollection every time that local thing updates... but then it creates a different problem. See https://github.com/Atticus29/video-annotator/issues/33
  }, [collectionUrl, postCollectionVideoIntakeQuestions, videoIntakeQuestions]); // I was having trouble with async updating the collection's intakeQuestion array. It seems to have been resolved if I use a local state and then call off to setCollection every time that local thing updates... but then it creates a different problem. See https://github.com/Atticus29/video-annotator/issues/33

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
      // console.log("deleteMe intakeQuestion is: ");
      // console.log(intakeQuestion);
      const intakeQuesionsInvalid: {} =
        collection?.videoQuestionsFormFieldGroup?.isInvalids || {}; // @TODO this might be the problem
      return map(
        intakeQuestion,
        (intakeQuestionEl, intakeQuestionKey, wholeQuestion) => {
          // console.log("deleteMe intakeQuestionEl is: ");
          // console.log(intakeQuestionEl);
          // console.log("deleteMe intakeQuestionKey is: ");
          // console.log(intakeQuestionKey);
          // console.log("deleteMe wholeQuestion is: ");
          // console.log(wholeQuestion);
          const isDelible: boolean = !wholeQuestion?.isACoreQuestion;
          return (
            <>
              <>
                {intakeQuestionKey === "label" && (
                  <>
                    <Typography style={{ marginBottom: 10 }}>
                      {"Question " + (intakeQuestionIdx + 1) + ". "}
                    </Typography>

                    {isDelible && (
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
              {(isDelible || (intakeQuestionKey === "label" && !isDelible)) && (
                <SingleVideoIntakeQuestionV2
                  key={intakeQuestionKey}
                  intakeQuestionEl={intakeQuestionEl}
                  intakeQuestionKey={intakeQuestionKey}
                  wholeQuestion={wholeQuestion}
                  intakeQuestionsInvalid={intakeQuesionsInvalid}
                  intakeQuestionIdx={intakeQuestionIdx}
                  collectionUrl={localCollection?.metadata?.urlPath || ""}
                  // collection={localCollection}
                  // setCollection={setLocalCollection}
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
    <>
      {(isLoading || isPending) && <CircularProgress color="inherit" />}
      {!isLoading && isError && (
        <CustomError
          errorMsg={
            errorMsg ||
            intl.formatMessage({
              id: "COLLECTION_NOT_FOUND",
              defaultMessage: "Collection not found",
            })
          }
        />
      )}
      {!isPending && isPostCollectionVideoIntakeQuestionsError && (
        <CustomError
          errorMsg={
            postCollectionVideoIntakeQuestionError?.message ||
            intl.formatMessage({
              id: "VIDEO_INTAKE_QUESTION_POST_FAILED",
              defaultMessage: "Failed to post video intake questions",
            })
          }
        />
      )}
      {!isLoading && !isError && (
        <InfoPanel
          titleId="VIDEO_INTAKE_QUESTIONS"
          titleDefault="Video Intake Questions"
          textOverrides={{ textAlign: "center" }}
        >
          <Grid container>
            {videoIntakeQuestions && (
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
            <ComposedFormSubmissionButtonVideoIntakeQuestions
              questionsOfConcern={
                [...get(localCollection, ["videoIntakeQuestions"], [])] || []
              }
              formFieldGroupOfConcern={formFieldGroup}
              collectionPath={localCollection?.metadata?.urlPath}
              collectionPropToUpdate={"videos"}
              // onCloseDialog={onCloseDialog}
              updateMethod={postCollectionVideoIntakeQuestions}
            />
          </Grid>
        </InfoPanel>
      )}
    </>
  );
};
export default VideoIntakeQuestions;
