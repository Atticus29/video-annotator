import { useEffect, useMemo, useState } from "react";

import { map, get } from "lodash-es";

import { Collection, SingleFormField, FormFieldGroup } from "../../types";
import { Button, Grid, Typography } from "@mui/material";
import { FormattedMessage, IntlShape, useIntl } from "react-intl";
import CustomError from "../CustomError";
import InfoPanel from "../InfoPanel";
import SingleIndividualIntakeQuestion from "../SingleIndividualIntakeQuestion";
import { defaultDoNotDisplays } from "../../dummy_data/dummyCollection";
import { sanitizeString } from "../../utilities/textUtils";
import useUpdateCollectionIndividualIntakeQuestions from "../../hooks/useUpdateCollectionIndividualIntakeQuestions";
import useGetCollection from "../../hooks/useGetCollection";
import usePostCollectionIndividualIntakeQuestions from "../../hooks/usePostCollectionIndividualIntakeQuestions";

const IndividualIntakeQuestions: React.FC<{
  // collection: Collection;
  // setCollection: (collection: any) => void;
  // formFieldGroup: FormFieldGroup;
  collectionUrl: string;
  mode?: string;
}> = ({
  collectionUrl,
  mode = "edit",
  // collection, setCollection, formFieldGroup
}) => {
  const {
    isLoading,
    isError,
    errorMsg,
    data: collection,
  } = useGetCollection(collectionUrl);

  const intl: IntlShape = useIntl();

  const {
    mutate: postCollectionIndividualIntakeQuestions,
    isPending: isPostIndividualIntakeQuestionsPending,
    isError: isPostCollectionIndividualIntakeQuestionsError,
    error: postCollectionIndividualIntakeQuestionError,
  } = usePostCollectionIndividualIntakeQuestions();

  const {
    mutate: updateCollectionIndividualIntakeQuestions,
    isPending,
    error: individualIntakeError,
    isError: updateCollectionIndividualIntakeQuestionsError,
  } = useUpdateCollectionIndividualIntakeQuestions();

  const [individualIntakeQuestions, setIndividualIntakeQuestions] = useState<
    SingleFormField[] | undefined
  >(get(collection, ["individualIntakeQuestions"]));
  const [error, setError] = useState<string>("");

  const newQuestion: SingleFormField = useMemo(() => {
    return {
      label: "Change Me",
      type: "Text",
      language: "English",
      isRequired: false,
      doNotDisplay: defaultDoNotDisplays,
      invalidInputMessage: "FIELD_CANNOT_BE_BLANK",
      validatorMethods: [],
      shouldBeCheckboxes: ["isRequired"],
    };
  }, []);

  useEffect(() => {
    if (collection?.metadata?.urlPath) {
      if (mode === "edit") {
        updateCollectionIndividualIntakeQuestions(
          {
            collectionUrl: collection?.metadata?.urlPath || "",
            updatedIndividualIntakeQuestions:
              collection?.individualIntakeQuestions || [],
          },
          {
            onSuccess: (responseData) => {
              console.log("Mutation successful", responseData);
            },
            onError: (error) => {
              // Handle error
              console.error("Mutation error", error);
            },
          }
        );
      }

      if (mode === "create") {
        postCollectionIndividualIntakeQuestions(
          {
            collectionUrl: collection?.metadata?.urlPath || "",
            collectionIndividualIntakeQuestions:
              collection?.individualIntakeQuestions || [],
          },
          {
            onSuccess: (responseData) => {
              console.log("Mutation successful", responseData);
            },
            onError: (error) => {
              // Handle error
              console.error("Mutation error", error);
            },
          }
        );
      }
    }
    // setCollection((prevState: any) => {
    //   return {
    //     ...prevState,
    //     individualIntakeQuestions: individualIntakeQuestions,
    //   };
    // });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [individualIntakeQuestions]); // I was having trouble with async updating the collection's intakeQuestion array. It seems to have been resolved if I use a local state and then call off to setCollection every time that local thing updates...but then it creates a different problem. See https://github.com/Atticus29/video-annotator/issues/33

  const deleteIntakeQuestion: (questionIdx: number) => void = (questionIdx) => {
    setIndividualIntakeQuestions((prevState) => {
      const newIndividualIntakeQuestions: SingleFormField[] =
        prevState?.filter((_entry, idx) => {
          return idx !== questionIdx;
        }) || [];
      return newIndividualIntakeQuestions;
    });
  };

  const handleSaveIndividualIntakeQuestionsAndPreview = () => {
    if (mode === "edit") {
      updateCollectionIndividualIntakeQuestions(
        {
          collectionUrl: collection.metadata.urlPath || "",
          updatedIndividualIntakeQuestions:
            collection.individualIntakeQuestions || [],
        },
        {
          onSuccess: (responseData) => {
            console.log("Mutation successful", responseData);
          },
          onError: (error) => {
            // Handle error
            console.error("Mutation error", error);
          },
        }
      );
    }
    if (mode === "create") {
      postCollectionIndividualIntakeQuestions(
        {
          collectionUrl: collection?.metadata?.urlPath || "",
          collectionIndividualIntakeQuestions:
            collection?.individualIntakeQuestions || [],
        },
        {
          onSuccess: (responseData) => {
            console.log("Mutation successful", responseData);
          },
          onError: (error) => {
            // Handle error
            console.error("Mutation error", error);
          },
        }
      );
    }
  };

  const createNewIntakeQuestion: () => void = () => {
    try {
      setIndividualIntakeQuestions((prevState: any) => {
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
    collection?.individualIntakeQuestions || [],
    (intakeQuestion, intakeQuestionIdx: number) => {
      const intakeQuesionsInvalid: {} =
        collection?.individualQuestionsFormFieldGroup?.isInvalids || {};
      return map(
        intakeQuestion,
        (intakeQuestionEl, intakeQuestionKey, wholeQuestion) => {
          return (
            <>
              {intakeQuestionKey === "label" && (
                <>
                  <Typography style={{ marginBottom: 10 }}>
                    {"Question " + (intakeQuestionIdx + 1) + ". "}
                  </Typography>
                  <Button
                    style={{ marginBottom: 10 }}
                    data-testid={"collection-details-submit-button"}
                    variant="contained"
                    onClick={() => {
                      deleteIntakeQuestion(intakeQuestionIdx);
                    }}
                  >
                    <FormattedMessage
                      id="REMOVE_QUESTION"
                      defaultMessage="Remove this question"
                    />
                  </Button>
                </>
              )}
              <SingleIndividualIntakeQuestion
                key={intakeQuestionKey}
                intakeQuestionEl={intakeQuestionEl}
                intakeQuestionKey={intakeQuestionKey}
                wholeQuestion={wholeQuestion}
                intakeQuestionsInvalid={intakeQuesionsInvalid}
                intakeQuestionIdx={intakeQuestionIdx}
                collectionUrl={collectionUrl}
                collection={collection} // @TODO decide whether this is needed
                // setCollection={setCollection}
                formFieldGroup={formFieldGroup}
              />
            </>
          );
        }
      );
    }
  );

  return (
    <InfoPanel
      titleId="INDIVIDUAL_INTAKE_QUESTIONS"
      titleDefault="Individual Intake Questions"
      textOverrides={{ textAlign: "center" }}
    >
      <Grid container>
        {collection?.individualIntakeQuestions && (
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
        <Grid item lg={12} sm={12}>
          <Button
            style={{ marginBottom: 10 }}
            data-testid={"collection-details-submit-button"}
            variant="contained"
            onClick={handleSaveIndividualIntakeQuestionsAndPreview}
          >
            <FormattedMessage
              id="SAVE_INDIVIDUAL_INTAKE_QUESTIONS_AND_PREVIEW"
              defaultMessage="Save and Preview"
            />
          </Button>
          {error && <CustomError errorMsg={error} />}
        </Grid>
      </Grid>
    </InfoPanel>
  );
};
export default IndividualIntakeQuestions;
