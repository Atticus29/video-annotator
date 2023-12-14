import { Tulpen_One } from "@next/font/google";
import { get } from "lodash-es";
import { defaultDoNotDisplays } from "../dummy_data/dummyCollection";
import { Collection, SingleFormField } from "../types";
import { isNonEmptyString, isValidEmail, isValidUrl } from "./validators";

export function transformQuestion(
  question: SingleFormField,
  newQuestionType: string
): SingleFormField {
  if (question?.type !== newQuestionType) {
    const baseQuestion: {} = {
      label: question.label,
      language: question.language,
      testId: question.testId,
      shouldBeCheckboxes: ["isRequired"],
    };
    const newQuestion: any = (() => {
      switch (newQuestionType) {
        case "URL":
          return {
            ...baseQuestion,
            type: "URL",
            isRequired: question.isRequired || false,
            doNotDisplay: defaultDoNotDisplays,
            invalidInputMessage: "MUST_BE_VALID_URL",
            validatorMethods: [isValidUrl],
          };
        case "Email":
          return {
            ...baseQuestion,
            type: "Email",
            isRequired: question.isRequired || false,
            doNotDisplay: defaultDoNotDisplays,
            invalidInputMessage: "MUST_BE_VALID_EMAIL",
            validatorMethods: [isValidEmail],
          };
        case "Autocomplete":
          return {
            ...baseQuestion,
            type: "Autocomplete",
            isRequired: question.isRequired || false,
            doNotDisplay: [...defaultDoNotDisplays, "autocompleteOptions"],
            invalidInputMessage: "INPUT_INVALID",
            validatorMethods: [],
            autocompleteOptions: ["Option 1 - change me"],
            useCanAddCustomOptions: true,
          };
        case "Checkbox":
          return {
            ...baseQuestion,
            type: "Checkbox",
            isRequired: true,
            doNotDisplay: defaultDoNotDisplays,
            validatorMethods: [],
          };
        case "Date":
          return {
            ...baseQuestion,
            type: "Date",
            isRequired: question.isRequired || false,
            doNotDisplay: defaultDoNotDisplays,
            validatorMethods: [],
          };
        case "Number":
          return {
            ...baseQuestion,
            type: "Number",
            isRequired: question.isRequired || false,
            doNotDisplay: defaultDoNotDisplays,
            invalidInputMessage: "INPUT_INVALID",
            validatorMethods: [],
          };
        case "Text":
          return {
            ...baseQuestion,
            type: "Text",
            isRequired: question.isRequired || false,
            doNotDisplay: defaultDoNotDisplays,
            invalidInputMessage: "FIELD_CANNOT_BE_BLANK",
            validatorMethods: [isNonEmptyString],
          };
        default:
          throw new Error(`Unsupported question type: ${newQuestionType}`);
      }
    })();
    return newQuestion;
  } else {
    return question;
  }
}

export function updateSingleQuestionInCollection(
  collection: Collection,
  setCollection: (input: any) => void,
  questionIdx: number,
  newQuestion: SingleFormField,
  intakeQuestions: SingleFormField[],
  whichIntakeQuestion: string
) {
  const modifiedQuestionSet: SingleFormField[] = intakeQuestions || [];
  modifiedQuestionSet[questionIdx] = newQuestion;
  setCollection((prevState: any) => {
    return { ...prevState, [whichIntakeQuestion]: modifiedQuestionSet };
  });
}

export function deleteSingleQuestionInCollection(
  collection: Collection,
  setCollection: (input: any) => void,
  questionIdx: number,
  whichIntakeQuestion: string
) {
  const originalQuestionSet: SingleFormField[] = get(
    collection,
    [whichIntakeQuestion],
    []
  );
  const modifiedQuestionSet = originalQuestionSet?.splice(questionIdx, 1);
  setCollection((prevState: any) => {
    return { ...prevState, [whichIntakeQuestion]: modifiedQuestionSet };
  });
}
