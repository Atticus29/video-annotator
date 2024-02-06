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
  formFieldGroup: FormFieldGroup
) {
  // console.log("deleteMe questions are: ");
  // console.log(questions);
  const questionLabels: string[] = reduce(
    questions,
    (memo: string[], question: SingleFormField) => {
      const currentLabel: string = question.label;
      const currentKeys: string[] = Object.keys(question);
      const labelsForCurrentQuestion: string[] = map(
        currentKeys,
        (currentKey) => currentKey + "--" + currentLabel
      );
      return [...memo, ...labelsForCurrentQuestion];
    },
    []
  );
  // console.log("deleteMe questionLabels are: ");
  // console.log(questionLabels);

  // const requiredQuestions: any[] =
  //   filter(questions, (question) => {
  //     return question?.isRequired;
  //   }) || [];
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
  // console.log("deleteMe requiredQuestionLabels are: ");
  // console.log(requiredQuestionLabels);
  const existingValues: string[] = formFieldGroup?.actualValues
    ? Object.keys(formFieldGroup.actualValues)
    : [];
  // console.log("deleteMe existingValues are: ");
  // console.log(existingValues);
  const missingRequiredLabels: string[] = filter(
    requiredQuestionLabels,
    (requiredQuestionLabel) => !existingValues.includes(requiredQuestionLabel)
  );
  // console.log("deleteMe missingRequiredLabels are: ");
  // console.log(missingRequiredLabels);
  return missingRequiredLabels.length < 1;
}
