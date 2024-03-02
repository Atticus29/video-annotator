import { filter, map, reduce } from "lodash-es";
import { FormFieldGroup, SingleFormField } from "../types";

export function calculateAllRequiredsHaveValues(
  questions: SingleFormField[],
  formFieldGroup: FormFieldGroup
) {
  const requiredQuestions: any[] =
    filter(questions, (question) => {
      return question?.isRequired;
    }) || [];
  const requiredQuestionLabels: any[] =
    map(requiredQuestions, (requiredQuestion) => requiredQuestion?.label) || [];
  const existingValues: string[] = formFieldGroup?.actualValues
    ? Object.keys(formFieldGroup.actualValues)
    : [];
  const missingRequiredLabels: string[] = filter(
    requiredQuestionLabels,
    (requiredQuestionLabel) => !existingValues.includes(requiredQuestionLabel)
  );
  return missingRequiredLabels.length < 1;
}

export function calculateAllRequiredIntakeQuestionsHaveValues(
  questions: SingleFormField[],
  actualValues: {}
) {
  const questionLabels: string[] = reduce(
    questions,
    (memo: string[], question: SingleFormField, questionIdx: number) => {
      const currentKeys: string[] = Object.keys(question);
      const labelsForCurrentQuestion: string[] = map(
        currentKeys,
        (currentKey) => currentKey + "--" + questionIdx
      );
      return [...memo, ...labelsForCurrentQuestion];
    },
    []
  );
  const requiredQuestionLabels: any[] =
    filter(
      questionLabels,
      (questionLabel) =>
        questionLabel.startsWith("label--") ||
        questionLabel.startsWith("type--") ||
        questionLabel.startsWith("language--") ||
        questionLabel.startsWith("isRequired--")
      // @TODO find the questions with type autocomplete and add in autocompleteOptions here somehow
    ) || [];
  const existingValues: string[] = actualValues
    ? Object.keys(actualValues)
    : [];
  const missingRequiredLabels: string[] = filter(
    requiredQuestionLabels,
    (requiredQuestionLabel) => !existingValues.includes(requiredQuestionLabel)
  );
  return missingRequiredLabels.length < 1;
}
