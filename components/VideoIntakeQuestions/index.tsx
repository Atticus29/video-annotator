import { useEffect, useMemo, useState } from "react";

import { map, get, reduce, filter } from "lodash-es";

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
import {
  transformActualValueObjIntoIntakeQuestions,
  transformIntakeQuestionsIntoActualValueObj,
} from "../../utilities/videoIntakeQuestionUtils";

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
    console.log("deleteMe video intake questions changed and is now:");
    console.log(videoIntakeQuestions);
    if (
      mode === "create" &&
      videoIntakeQuestions.length < 1 &&
      (shamCollection?.videoIntakeQuestions || []).length > 0 // @TODO this smells like an antipattern
    ) {
      console.log("deleteMe should only get here during initialization");
      setVideoIntakeQuestions(shamCollection.videoIntakeQuestions || []);

      // add their values to the formFieldGroup
      const transformedVideoIntakeQuestions =
        transformIntakeQuestionsIntoActualValueObj(
          shamCollection.videoIntakeQuestions || []
        );

      // console.log("deleteMe transformedVideoIntakeQuestions a3 are: ");
      // console.log(transformedVideoIntakeQuestions);

      const formFieldGroupValueSetter: ((input: any) => void) | undefined =
        formFieldGroup?.setValues;

      if (formFieldGroupValueSetter) {
        formFieldGroupValueSetter((prevState: any) => {
          return {
            ...prevState,
            ...transformedVideoIntakeQuestions,
          };
        });
      }
      // currently, don't have to add invalids to the formFieldGroup here, because the dummy data is all valid
      // end add their values to the formFieldGroup
      //////////////////////////////////////////////

      // postCollectionVideoIntakeQuestions( // @TODO figure out where to do this (not here)
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
    formFieldGroup?.setValues,
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
    console.log("deleteMe formFieldGroup changed and is now: ");
    console.log(formFieldGroup);
    // const deleteMe: any = transformActualValueObjIntoIntakeQuestions(
    //   formFieldGroup.actualValues
    // );
    // console.log("deleteMe deleteMe is: ");
    // console.log(deleteMe);
    //update setVideoIntakeQuestions with new values
    if (Object.keys(formFieldGroup.actualValues).length > 0) {
      setVideoIntakeQuestions(
        transformActualValueObjIntoIntakeQuestions(formFieldGroup.actualValues)
      );
    }
  }, [formFieldGroup]);

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
    console.log("deleteMe deleteIntakeQuestion questionIdx is: ");
    console.log(questionIdx);
    setVideoIntakeQuestions((prevState) => {
      const newVideoIntakeQuestions: SingleFormField[] =
        prevState?.filter((_entry, idx) => {
          return idx !== questionIdx;
        }) || [];
      console.log("deleteMe newVideoIntakeQuestions passing the filter are: ");
      console.log(newVideoIntakeQuestions);
      return newVideoIntakeQuestions;
    });

    ////////////////////////////////////////////////////////////////////////////////////////////////
    // remove the question from the formFieldGroup actualValues as well as from isInvalids
    const actualValueSetter: any = formFieldGroup.setValues; // @TODO DRY this up by creating a removeFromFormGroup method that takes formFieldGroup, questionIdx, and setterString ("setValues" or "setInvalids") as arguments
    if (actualValueSetter) {
      actualValueSetter((prevState: any) => {
        const updatedState = reduce(
          prevState,
          (memo, stateItem, stateItemKey) => {
            if (stateItemKey.indexOf("--" + questionIdx) < 0) {
              return { ...memo, [stateItemKey]: stateItem };
            } else {
              return memo;
            }
          },
          {}
        );
        return updatedState;
      });
    }

    const isInvalidSetter: any = formFieldGroup.setIsInvalids; // @TODO DRY this up by creating a removeFromFormGroup method that takes formFieldGroup, questionIdx, and setterString ("setValues" or "setInvalids") as arguments
    if (isInvalidSetter) {
      isInvalidSetter((prevState: any) => {
        const updatedState = reduce(
          prevState,
          (memo, stateItem, stateItemKey) => {
            if (stateItemKey.indexOf("--" + questionIdx) < 0) {
              return { ...memo, [stateItemKey]: stateItem };
            } else {
              return memo;
            }
          },
          {}
        );
        return updatedState;
      });
    }
    // End remove the question from the formFieldGroup actualValues as well as from isInvalids
    ////////////////////////////////////////////////////////////////////////////////////////////////
  };

  const createNewIntakeQuestion: () => void = () => {
    try {
      const transformedNewIntakeQuestionForFormFieldGroup =
        transformIntakeQuestionsIntoActualValueObj([
          ...videoIntakeQuestions,
          newQuestion,
        ]);
      console.log(
        "deleteMe transformedNewIntakeQuestionForFormFieldGroup is: "
      );
      console.log(transformedNewIntakeQuestionForFormFieldGroup);

      setVideoIntakeQuestions((prevState: any) => {
        if (prevState) {
          return [...prevState, newQuestion];
        } else {
          return [newQuestion];
        }
      });

      const formFieldGroupValueSetter: ((input: any) => void) | undefined =
        formFieldGroup?.setValues;

      if (formFieldGroupValueSetter) {
        formFieldGroupValueSetter((prevState: any) => {
          return {
            ...prevState,
            ...transformedNewIntakeQuestionForFormFieldGroup,
          };
        });
      }
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
              questionsOfConcern={videoIntakeQuestions}
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
