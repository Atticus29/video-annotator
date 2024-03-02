import { Tulpen_One } from "@next/font/google";
import { filter, get, reduce } from "lodash-es";
import { defaultDoNotDisplays } from "../dummy_data/dummyCollection";
import { Collection, SingleFormField } from "../types";
import { isNonEmptyString, isValidEmail, isValidUrl } from "./validators";
import { calculateCurrentAttributesToDisplay } from "./singleFormFieldUtils";

export function transformQuestion(
  question: SingleFormField,
  newQuestionType: string
): SingleFormField {
  if (question?.type !== newQuestionType) {
    const baseQuestion: {} = {
      label: question.label,
      isRequired: question.isRequired || false,
      language: question.language,
      testId: question.testId,
      shouldBeCheckboxes: ["isRequired"],
    };
    const newQuestion: any = (() => {
      switch (newQuestionType) {
        case "URL":
          return {
            type: "URL",
            ...baseQuestion,
            doNotDisplay: defaultDoNotDisplays,
            invalidInputMessage: "MUST_BE_VALID_URL",
            validatorMethods: [isValidUrl],
          };
        case "Email":
          return {
            type: "Email",
            ...baseQuestion,
            doNotDisplay: defaultDoNotDisplays,
            invalidInputMessage: "MUST_BE_VALID_EMAIL",
            validatorMethods: [isValidEmail],
          };
        case "Autocomplete":
          return {
            type: "Autocomplete",
            ...baseQuestion,
            autocompleteOptions: ["Option 1 - change me"],
            usersCanAddCustomOptions: true,
            doNotDisplay: [...defaultDoNotDisplays, "autocompleteOptions"],
            invalidInputMessage: "INPUT_INVALID",
            validatorMethods: [],
          };
        case "Checkbox":
          return {
            type: "Checkbox",
            ...baseQuestion,
            isRequired: true,
            doNotDisplay: defaultDoNotDisplays,
            validatorMethods: [],
          };
        case "Date":
          return {
            type: "Date",
            ...baseQuestion,
            doNotDisplay: defaultDoNotDisplays,
            validatorMethods: [],
          };
        case "Number":
          return {
            type: "Number",
            ...baseQuestion,
            doNotDisplay: defaultDoNotDisplays,
            invalidInputMessage: "INPUT_INVALID",
            validatorMethods: [],
          };
        case "Text":
          return {
            type: "Text",
            ...baseQuestion,
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

export function transformActualValueObjIntoIntakeQuestions(
  actualValueObj: any
) {
  const returnVal: SingleFormField[] = [];
  const numberOfQuestions: number = filter(
    Object.keys(actualValueObj),
    (attrKey) => attrKey.indexOf("label") > -1
  ).length;
  for (let i = 0; i < numberOfQuestions; i++) {
    const currentQuestion: any = reduce(
      actualValueObj,
      (memo, attribute, attributeKey) => {
        if (Number(attributeKey.split("--")[1]) === i) {
          return { ...memo, [attributeKey.split("--")[0]]: attribute };
        } else {
          return { ...memo };
        }
      },
      {}
    );
    returnVal.push(currentQuestion);
  }
  return returnVal;
}

export function transformIntakeQuestionsIntoActualValueObj(
  intakeQuestions: SingleFormField[],
  questionIdx?: number
) {
  return reduce(
    intakeQuestions,
    (memo, intakeQuestion, intakeQuestionIdx) => {
      const objKeys: string[] = Object.keys(intakeQuestion);
      const newObj = reduce(
        objKeys,
        (memo, objKey) => {
          const currentVal: any = get(intakeQuestion, [objKey]);
          const newEntry: {} = {
            [objKey + "--" + (questionIdx ? questionIdx : intakeQuestionIdx)]:
              currentVal,
          };
          return { ...memo, ...newEntry };
        },
        {}
      );
      return { ...memo, ...newObj };
    },
    {}
  );
}

export function updateSingleQuestionInCollection(
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

export function calculateShouldBeTypeDropdown(
  question: SingleFormField,
  questionKey: string
) {
  const currentAttributesToDisplay =
    calculateCurrentAttributesToDisplay(question);

  const onTheDisplayListForThisQuestionType: boolean =
    currentAttributesToDisplay.includes(questionKey);
  return questionKey === "type" && onTheDisplayListForThisQuestionType;
}

export function calculateShouldBeTextField(
  question: SingleFormField,
  questionKey: string
) {
  const onTheNoDisplayList: boolean = (question?.doNotDisplay || []).includes(
    questionKey
  );

  const onCheckboxList: boolean = (question?.shouldBeCheckboxes || []).includes(
    questionKey
  );

  const currentAttributesToDisplay =
    calculateCurrentAttributesToDisplay(question);

  const onTheDisplayListForThisQuestionType: boolean =
    currentAttributesToDisplay.includes(questionKey);

  const shouldBeTypeDropdown: boolean = calculateShouldBeTypeDropdown(
    question,
    questionKey
  );

  return (
    !onTheNoDisplayList &&
    !onCheckboxList &&
    !shouldBeTypeDropdown &&
    onTheDisplayListForThisQuestionType
  );
}

export function calculateShouldBeCheckbox(
  question: SingleFormField,
  questionKey: string
) {
  const onTheNoDisplayList: boolean = (question?.doNotDisplay || []).includes(
    questionKey
  );

  const onCheckboxList: boolean = (question?.shouldBeCheckboxes || []).includes(
    questionKey
  );
  const currentAttributesToDisplay =
    calculateCurrentAttributesToDisplay(question);

  const onTheDisplayListForThisQuestionType: boolean =
    currentAttributesToDisplay.includes(questionKey);

  const shouldBeTypeDropdown: boolean =
    questionKey === "type" && onTheDisplayListForThisQuestionType;

  return (
    !onTheNoDisplayList &&
    onCheckboxList &&
    !shouldBeTypeDropdown &&
    onTheDisplayListForThisQuestionType
  );
}
