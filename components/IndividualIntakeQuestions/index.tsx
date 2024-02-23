import { useEffect, useMemo, useState } from "react";

import { map, reduce } from "lodash-es";

import { SingleFormField, FormFieldGroup } from "../../types";
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
import useGetCollection from "../../hooks/useGetCollection";
import usePostCollectionIndividualIntakeQuestions from "../../hooks/usePostCollectionIndividualIntakeQuestions";
import useUpdateCollectionIndividualIntakeQuestions from "../../hooks/useUpdateCollectionIndividualIntakeQuestions";
import {
  transformActualValueObjIntoIntakeQuestions,
  transformIntakeQuestionsIntoActualValueObj,
} from "../../utilities/intakeQuestionUtils";
import SaveOrUpdateButtonWithValidation from "../SaveOrUpdateButtonWithValidation";
import IndividualIntakePreview from "../IndividualIntakePreview";
import SingleIntakeQuestion from "../SingleIntakeQuestion";

const IndividualIntakeQuestions: React.FC<{
  collectionUrl: string;
  mode?: string;
}> = ({ collectionUrl, mode = "edit" }) => {
  console.log("deleteMe IndividualIntakeQuestions rendered ");
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
    console.log("deleteMe useMemo e1 called");
    return {
      title: "IndividualFormFieldGroupForTheWholeCollection",
      setValues: setIndividualQuestionFormValues,
      actualValues: individualQuestionFormValues,
      isInvalids: areIndividualQuestionFormValuesInvalid,
      setIsInvalids: setAreIndividualQuestionFormValuesInvalid,
    };
  }, [areIndividualQuestionFormValuesInvalid, individualQuestionFormValues]);

  const [hasAQuestionBeenDeleted, setHasAQuestionBeenDeleted] =
    useState<boolean>(false);

  useEffect(() => {
    console.log("deleteMe useEffect a1 is called and actual values is now: ");
    console.log(formFieldGroup.actualValues);
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

  const newQuestion: SingleFormField = useMemo(() => {
    console.log(
      "deleteMe useMemo b1 is called and formFieldGroup.actualValues are: "
    );
    console.log(formFieldGroup.actualValues);
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

  const intakeQuestionElements = useMemo(() => {
    console.log("deleteMe useMemo c1 called");
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
                    isACoreQuestion={wholeQuestion?.isACoreQuestion}
                    coreQuestionTranslationsValues={{
                      recommendation: wholeQuestion?.recommendedLabel || "",
                    }}
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
    console.log("deleteMe useMemo d1 called");
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
            intl.formatMessage(
              {
                id: "GENERIC_INTAKE_QUESTION_POST_FAILED",
                defaultMessage: "Failed to post individual intake questions",
              },
              { type: "individual" }
            )
          }
        />
      )}
      {!isLoading &&
        !isError &&
        !isPending &&
        !isPostCollectionIndividualIntakeQuestionsError && (
          <InfoPanel
            titleDefault={intl.formatMessage(
              { id: "GENERIC_INTAKE_QUESTIONS" },
              { type: "Individual" }
            )}
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
                      defaultMessage:
                        "Failed to update individual intake questions",
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
};
export default IndividualIntakeQuestions;
