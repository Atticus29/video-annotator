import { useEffect, useMemo, useState } from "react";

import { map, get, reduce } from "lodash-es";

import { Collection, SingleFormField, FormFieldGroup } from "../../types";
import {
  Backdrop,
  Button,
  CircularProgress,
  Dialog,
  DialogContent,
  Grid,
  Typography,
} from "@mui/material";
import { FormattedMessage, IntlShape, useIntl } from "react-intl";
import CustomError from "../CustomError";
import InfoPanel from "../InfoPanel";
import {
  defaultDoNotDisplays,
  shamCollection,
} from "../../dummy_data/dummyCollection";
import useUpdateCollectionIndividualIntakeQuestions from "../../hooks/useUpdateCollectionIndividualIntakeQuestions";
import useGetCollection from "../../hooks/useGetCollection";
import usePostCollectionIndividualIntakeQuestions from "../../hooks/usePostCollectionIndividualIntakeQuestions";
import SingleIntakeQuestion from "../SingleIntakeQuestion";
import {
  transformActualValueObjIntoIntakeQuestions,
  transformIntakeQuestionsIntoActualValueObj,
} from "../../utilities/intakeQuestionUtils";
import SaveOrUpdateButtonWithValidation from "../SaveOrUpdateButtonWithValidation";
import IndividualIntakePreview from "../IndividualIntakePreview";

const IndividualIntakeQuestions: React.FC<{
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
  const [showPreview, setShowPreview] = useState<boolean>(false);

  const {
    mutate: postCollectionIndividualIntakeQuestions,
    isPending,
    isError: isPostCollectionIndividualIntakeQuestionsError,
    error: postCollectionIndividualIntakeQuestionError,
  } = usePostCollectionIndividualIntakeQuestions();

  const [individualQuestionFormValues, setIndividualQuestionFormValues] =
    useState<{}>({});
  const [
    areIndividualQuestionFormValuesInvalid,
    setAreIndividualQuestionFormValuesInvalid,
  ] = useState<{}>({});
  const formFieldGroup: FormFieldGroup = useMemo(() => {
    return {
      title: "individualFormFieldGroupForTheWholeCollection",
      setValues: setIndividualQuestionFormValues,
      actualValues: individualQuestionFormValues,
      isInvalids: areIndividualQuestionFormValuesInvalid,
      setIsInvalids: setAreIndividualQuestionFormValuesInvalid,
    };
  }, [areIndividualQuestionFormValuesInvalid, individualQuestionFormValues]);

  const [hasAQuestionBeenDeleted, setHasAQuestionBeenDeleted] =
    useState<boolean>(false);

  useEffect(() => {
    if (
      mode === "create" && // @TODO maybe this is moot now
      transformActualValueObjIntoIntakeQuestions(formFieldGroup.actualValues)
        .length < 1 &&
      !hasAQuestionBeenDeleted &&
      (shamCollection?.individualIntakeQuestions || []).length > 0
    ) {
      // add their values to the formFieldGroup
      const transformedIndividualIntakeQuestions =
        transformIntakeQuestionsIntoActualValueObj(
          shamCollection.individualIntakeQuestions || []
        );

      const formFieldGroupValueSetter: ((input: any) => void) | undefined =
        formFieldGroup?.setValues;

      if (formFieldGroupValueSetter) {
        formFieldGroupValueSetter((prevState: any) => {
          return {
            ...prevState,
            ...transformedIndividualIntakeQuestions,
          };
        });
      }
    }
  }, [
    collectionUrl,
    formFieldGroup.actualValues,
    formFieldGroup?.setValues,
    hasAQuestionBeenDeleted,
    mode,
    postCollectionIndividualIntakeQuestions,
    individualQuestionFormValues,
  ]);

  const [error, setError] = useState<string>("");

  // const {
  //   mutate: updateCollectionIndividualIntakeQuestions,
  //   isPending,
  //   error: individualIntakeError,
  //   isError: updateCollectionIndividualIntakeQuestionsError,
  // } = useUpdateCollectionIndividualIntakeQuestions();

  // const [individualIntakeQuestions, setIndividualIntakeQuestions] = useState<
  //   SingleFormField[] | undefined
  // >(get(collection, ["individualIntakeQuestions"]));
  // const [error, setError] = useState<string>("");

  const newQuestion: SingleFormField = useMemo(() => {
    return {
      key:
        transformActualValueObjIntoIntakeQuestions(formFieldGroup.actualValues)
          .length + 1,
      type: "Text",
      label: "Change Me",
      isRequired: false,
      language: "English",
      doNotDisplay: defaultDoNotDisplays,
      invalidInputMessage: "FIELD_CANNOT_BE_BLANK",
      validatorMethods: [],
      shouldBeCheckboxes: ["isRequired"],
    };
  }, [formFieldGroup.actualValues]);

  const deleteIntakeQuestion: (questionIdx: number) => void = (questionIdx) => {
    setHasAQuestionBeenDeleted(true);

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

        //now rename the remaining keys
        const renumberedState = reduce(
          updatedState,
          (memo, stateItem, stateItemKey) => {
            const splitLabel: string[] = stateItemKey.split("--");
            const firstPartOfcurrentAssociatedQuestionLabel = splitLabel[0];
            const currentAssociatedQuestionIdx: number = Number(
              splitLabel[1] || 0
            );
            if (currentAssociatedQuestionIdx > questionIdx) {
              //needs to be renamed
              return {
                ...memo,
                [firstPartOfcurrentAssociatedQuestionLabel +
                "--" +
                String(currentAssociatedQuestionIdx - 1)]: stateItem,
              };
            } else {
              // good as is; just attach
              return { ...memo, [stateItemKey]: stateItem };
            }
          },
          {}
        );

        return renumberedState;
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

        //now rename the remaining keys
        const renumberedState = reduce(
          updatedState,
          (memo, stateItem, stateItemKey) => {
            const splitLabel: string[] = stateItemKey.split("--");
            const firstPartOfcurrentAssociatedQuestionLabel = splitLabel[0];
            const currentAssociatedQuestionIdx: number = Number(
              splitLabel[1] || 0
            );
            if (currentAssociatedQuestionIdx > questionIdx) {
              //needs to be renamed
              return {
                ...memo,
                [firstPartOfcurrentAssociatedQuestionLabel +
                "--" +
                String(currentAssociatedQuestionIdx - 1)]: stateItem,
              };
            } else {
              // good as is; just attach
              return { ...memo, [stateItemKey]: stateItem };
            }
          },
          {}
        );

        return renumberedState;
      });
    }
    // End remove the question from the formFieldGroup actualValues as well as from isInvalids
  };

  const createNewIntakeQuestion: () => void = () => {
    try {
      const transformedNewIntakeQuestionForFormFieldGroup =
        transformIntakeQuestionsIntoActualValueObj([
          ...transformActualValueObjIntoIntakeQuestions(
            formFieldGroup.actualValues
          ),
          newQuestion,
        ]);

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

  // const handleSaveIndividualIntakeQuestionsAndPreview = () => {
  //   if (mode === "edit") {
  //     updateCollectionIndividualIntakeQuestions(
  //       {
  //         collectionUrl: collection.metadata.urlPath || "",
  //         updatedIndividualIntakeQuestions:
  //           collection.individualIntakeQuestions || [],
  //       },
  //       {
  //         onSuccess: (responseData) => {
  //           console.log("Mutation successful", responseData);
  //         },
  //         onError: (error) => {
  //           // Handle error
  //           console.error("Mutation error", error);
  //         },
  //       }
  //     );
  //   }
  //   if (mode === "create") {
  //     postCollectionIndividualIntakeQuestions(
  //       {
  //         collectionUrl: collection?.metadata?.urlPath || "",
  //         collectionIndividualIntakeQuestions:
  //           collection?.individualIntakeQuestions || [],
  //       },
  //       {
  //         onSuccess: (responseData) => {
  //           console.log("Mutation successful", responseData);
  //         },
  //         onError: (error) => {
  //           // Handle error
  //           console.error("Mutation error", error);
  //         },
  //       }
  //     );
  //   }
  // };

  const intakeQuestionElements = useMemo(() => {
    return map(
      transformActualValueObjIntoIntakeQuestions(formFieldGroup.actualValues) ||
        [],
      (intakeQuestion, intakeQuestionIdx) => {
        return map(
          intakeQuestion,
          (intakeQuestionEl, intakeQuestionKey, wholeQuestion) => {
            const isDelible: boolean = !wholeQuestion?.isACoreQuestion;
            return (
              <>
                <>
                  {intakeQuestionKey === "type" && (
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
                {(isDelible ||
                  (intakeQuestionKey === "label" && !isDelible)) && (
                  <SingleIntakeQuestion
                    key={intakeQuestionKey}
                    intakeQuestionEl={intakeQuestionEl}
                    intakeQuestionKey={intakeQuestionKey}
                    intakeQuestionIdx={intakeQuestionIdx}
                    formFieldGroup={formFieldGroup}
                  />
                )}
              </>
            );
          }
        );
      }
    );
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [formFieldGroup]);

  const individualIntakeQuestionsAlreadyExist: boolean = useMemo(() => {
    return Boolean(collection?.individualIntakeQuestions);
  }, [collection]);

  const buttonTitle: string = intl.formatMessage({
    id: individualIntakeQuestionsAlreadyExist
      ? "UPDATE_AND_PREVIEW"
      : "SAVE_AND_PREVIEW",
    defaultMessage: individualIntakeQuestionsAlreadyExist
      ? "Update and Preview"
      : "Save and Preview",
  });

  return (
    <>
      <Backdrop
        sx={{ color: "#fff", zIndex: (theme) => theme.zIndex.drawer + 1 }}
        open={isLoading || isPending}
      >
        <CircularProgress color="inherit" />
      </Backdrop>
      {!isLoading && !isPending && isError && (
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
      {!isPending && isPostCollectionIndividualIntakeQuestionsError && (
        <CustomError
          errorMsg={
            postCollectionIndividualIntakeQuestionError?.message ||
            intl.formatMessage({
              id: "INDIVIDUAL_INTAKE_QUESTION_POST_FAILED",
              defaultMessage: "Failed to post individual intake questions",
            })
          }
        />
      )}
      {!isLoading &&
        !isError &&
        !isPending &&
        !isPostCollectionIndividualIntakeQuestionsError && (
          <InfoPanel
            titleId="INDIVIDUAL_INTAKE_QUESTIONS"
            titleDefault="Individual Intake Questions"
            textOverrides={{ textAlign: "center" }}
          >
            <Grid container>
              {transformActualValueObjIntoIntakeQuestions(
                formFieldGroup.actualValues
              ) && (
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
              {!isLoading && !isError && (
                <SaveOrUpdateButtonWithValidation
                  disabled={!Boolean(collection)}
                  buttonTitle={buttonTitle}
                  successMsg={intl.formatMessage({
                    id: "COLLECTION_UPDATED_SUCCESSFULLY",
                    defaultMessage: "Collection was updated successfully.",
                  })}
                  failMsg={intl.formatMessage(
                    {
                      id: "GENERIC_INTAKE_QUESTION_POST_FAILED",
                      defaultMessage: "Failed to update video intake questions",
                    },
                    { type: "individual" } // @TODO i8n
                  )}
                  usePostOrUseUpdate={
                    individualIntakeQuestionsAlreadyExist
                      ? useUpdateCollectionIndividualIntakeQuestions
                      : usePostCollectionIndividualIntakeQuestions
                  }
                  mutationData={{
                    collectionUrl: collectionUrl,
                    collectionIndividualIntakeQuestions:
                      transformActualValueObjIntoIntakeQuestions(
                        formFieldGroup.actualValues
                      ) || [],
                  }}
                  actualValues={formFieldGroup.actualValues}
                  invalidValues={formFieldGroup.isInvalids}
                  setParentStateOnSuccess={setShowPreview}
                  queryKeysToInvalidate={[
                    ["singleCollection", collection?.urlPath],
                  ]}
                />
              )}
              <Dialog
                open={showPreview}
                onClose={() => {
                  setShowPreview(false);
                }}
              >
                <DialogContent>
                  <IndividualIntakePreview collectionUrl={collectionUrl} />
                </DialogContent>
              </Dialog>
            </Grid>
          </InfoPanel>
        )}
    </>
  );
  // return (
  //   <InfoPanel
  //     titleId="INDIVIDUAL_INTAKE_QUESTIONS"
  //     titleDefault="Individual Intake Questions"
  //     textOverrides={{ textAlign: "center" }}
  //   >
  //     <Grid container>
  //       {collection?.individualIntakeQuestions && (
  //         <Grid item lg={12} sm={12}>
  //           {intakeQuestionElements}
  //         </Grid>
  //       )}
  //       <Grid item lg={12} sm={12}>
  //         <Button
  //           style={{ marginBottom: 10 }}
  //           data-testid={"collection-details-submit-button"}
  //           variant="contained"
  //           onClick={createNewIntakeQuestion}
  //         >
  //           <FormattedMessage
  //             id="ADD_ANOTHER_QUESTION"
  //             defaultMessage="Add another question"
  //           />
  //         </Button>
  //         {error && <CustomError errorMsg={error} />}
  //       </Grid>
  //       <Grid item lg={12} sm={12}>
  //         <Button
  //           style={{ marginBottom: 10 }}
  //           data-testid={"collection-details-submit-button"}
  //           variant="contained"
  //           onClick={handleSaveIndividualIntakeQuestionsAndPreview}
  //         >
  //           <FormattedMessage
  //             id="SAVE_INDIVIDUAL_INTAKE_QUESTIONS_AND_PREVIEW"
  //             defaultMessage="Save and Preview"
  //           />
  //         </Button>
  //         {error && <CustomError errorMsg={error} />}
  //       </Grid>
  //     </Grid>
  //   </InfoPanel>
  // );
};
export default IndividualIntakeQuestions;
