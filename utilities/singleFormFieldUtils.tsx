import { filter, forEach, get, map, reduce } from "lodash-es";
import { IntlShape } from "react-intl";
import formFieldConfig from "../formFieldConfig.json";
import { SingleFormField, Collection, FormFieldGroup } from "../types";
import {
  isNonEmptyString,
  isValidEmail,
  isValidUrl,
  isValidOption,
  isValidYouTubeUrl,
  endsInUrl,
  endsInName,
} from "./validators";

export function calculateCurrentAttributesToDisplay(question: SingleFormField) {
  const currentTypeConfig = filter(formFieldConfig, (entry) => {
    const matches: boolean = entry?.type === question?.type;
    return matches;
  });
  const currentAttributesToDisplay: string[] = get(
    currentTypeConfig,
    [0, "attributesToDisplay"],
    []
  );
  return currentAttributesToDisplay;
}

export function replaceFormFieldValuesWith(
  originalFormFieldGroup: FormFieldGroup,
  replacementValues: {},
  removeAllOld: boolean = true
): {} {
  if (removeAllOld) {
    // get rid of all values with the same --num index, in case some are missing in the new
    const currentIndex: number = Number(
      get(Object.keys(replacementValues), [0])?.split("--")[1]
    );
    const originalWithOldRemoved: {} = reduce(
      originalFormFieldGroup.actualValues,
      (memo, value, valueKey) => {
        if (valueKey.indexOf(String(currentIndex)) < 0) {
          return { ...memo, [valueKey]: value };
        } else {
          return memo;
        }
      },
      {}
    );
    return { ...originalWithOldRemoved, ...replacementValues };
  } else {
    return { ...originalFormFieldGroup.actualValues, ...replacementValues };
  }
}

export function updateIntakeQuestionFormField(
  currentVal: any,
  intakeQuestionKey: string,
  intakeQuestionIdx: number,
  formFieldGroup: FormFieldGroup
) {
  // console.log("deleteMe intakeQuestionKey is: ");
  // console.log(intakeQuestionKey);
  // console.log("deleteMe formFieldGroup is: ");
  // console.log(formFieldGroup);
  // console.log("deleteMe intakeQuestionIdx is: " + intakeQuestionIdx);

  const valueSetter: ((input: any) => void) | undefined = get(formFieldGroup, [
    "setValues",
  ]);
  const invalidSetter: ((input: any) => void) | undefined = get(
    formFieldGroup,
    ["setIsInvalids"]
  );
  if (invalidSetter) {
    let isInvalid: boolean =
      intakeQuestionKey === "isRequired" ||
      intakeQuestionKey === "usersCanAddCustomOptions"
        ? false
        : !isNonEmptyString(currentVal);

    // Check for the special URL label
    const isCoreQuestion = get(formFieldGroup, [
      "actualValues",
      "isACoreQuestion--" + intakeQuestionIdx,
    ]);
    const isLabel = intakeQuestionKey === "label";
    const isYoutubeUrlType =
      get(formFieldGroup, ["actualValues", "type--" + intakeQuestionIdx]) ===
      "YouTubeUrl";
    if (isLabel && isYoutubeUrlType && isCoreQuestion) {
      isInvalid = !isNonEmptyString(currentVal) || !endsInUrl(currentVal);
    }
    const isPrimaryAutocompleteType =
      get(formFieldGroup, ["actualValues", "type--" + intakeQuestionIdx]) ===
      "PrimaryAutocomplete";
    if (isLabel && isPrimaryAutocompleteType && isCoreQuestion) {
      console.log("deleteMe got here a12");
      console.log("deleteMe endsInName(currentVal) is: ");
      console.log(endsInName(currentVal));
      isInvalid = !isNonEmptyString(currentVal) || !endsInName(currentVal);
    }

    console.log("deleteMe isInvalid is: " + isInvalid);
    // End check for the special URL label
    invalidSetter((prevState: {}) => {
      return {
        ...prevState,
        [intakeQuestionKey + "--" + intakeQuestionIdx]: isInvalid,
      };
    });
  }
  if (valueSetter) {
    valueSetter((prevState: {}) => {
      return {
        ...prevState,
        [intakeQuestionKey + "--" + intakeQuestionIdx]: currentVal,
      };
    });
  }
}

export function updateCollection(
  collection: Collection,
  questionIdx: number,
  questionKey: string,
  newVal: any,
  setCollection: (collection: any) => void,
  whichIntakeQuestions: string
) {
  const targetQuestion: SingleFormField = get(
    collection,
    [whichIntakeQuestions, questionIdx],
    {}
  );
  const modifiedQuestion: any = {
    ...targetQuestion,
    [questionKey]: newVal,
  };
  const newIntakeQuestionSet: SingleFormField[] = get(
    collection,
    [whichIntakeQuestions],
    []
  );
  newIntakeQuestionSet[questionIdx] = modifiedQuestion;

  setCollection((prevState: any) => {
    return { ...prevState, [whichIntakeQuestions]: newIntakeQuestionSet };
  });
}

export function updateFormFieldStates(
  currentVal: any,
  formFieldGroup: FormFieldGroup | undefined,
  question: SingleFormField
) {
  const setVals: any = get(formFieldGroup, ["setValues"], null);
  if (Boolean(setVals)) {
    setVals((prevState: {}) => {
      const returnVal: {} = {
        ...prevState,
        [question.label]: currentVal,
      };
      return returnVal;
    });
  }

  let currentValidatorMethods = question.validatorMethods;
  if (
    question?.isRequired &&
    question?.type !== "Checkbox" &&
    !currentValidatorMethods.includes(isNonEmptyString)
  ) {
    currentValidatorMethods?.push(isNonEmptyString);
  }

  const currentOpts = question?.autocompleteOptions;

  const usersCanAddCustomOptions: boolean | undefined =
    question?.usersCanAddCustomOptions;
  if (
    !usersCanAddCustomOptions &&
    question?.type === "Autocomplete" &&
    !currentValidatorMethods.includes(isValidOption)
  ) {
    currentValidatorMethods?.push(isValidOption);
  }

  if (
    !usersCanAddCustomOptions &&
    question?.type === "PrimaryAutocomplete" &&
    !currentValidatorMethods.includes(isValidOption)
  ) {
    currentValidatorMethods?.push(isValidOption);
  }

  if (
    question?.type === "URL" &&
    !currentValidatorMethods.includes(isValidUrl)
  ) {
    currentValidatorMethods?.push(isValidUrl);
  }

  if (
    question?.type === "YouTubeUrl" &&
    !currentValidatorMethods.includes(isValidYouTubeUrl)
  ) {
    currentValidatorMethods?.push(isValidYouTubeUrl);
  }

  if (
    question?.type === "Email" &&
    !currentValidatorMethods.includes(isValidEmail)
  ) {
    currentValidatorMethods?.push(isValidEmail);
  }

  const validCounter: number = reduce(
    currentValidatorMethods,
    (memo, validatorMethod) => {
      let incrementer = 1;
      if (validatorMethod) {
        incrementer = Number(validatorMethod(currentVal, currentOpts));
      }
      return memo + incrementer;
    },
    0
  ); // || defaultValidValue; // @TODO if the map value evaluates to false, will the default give us what we expect?
  const currentFormIsInvalid: boolean =
    validCounter < (currentValidatorMethods?.length || 0);

  // @TODO DECIDE WHETHER YOU WANTED TO SUBFUNCTIONALIZE THE VALIDATION STATE UPDATES

  const validationStateAndLabelExist: boolean = Boolean(
    formFieldGroup?.isInvalids && question?.label
  );

  validationStateAndLabelExist && formFieldGroup?.setIsInvalids
    ? formFieldGroup.setIsInvalids({
        ...formFieldGroup.isInvalids,
        [question.label]: currentFormIsInvalid,
      })
    : undefined;
}

export function clearAllOptionFields(
  preExistingVals: {},
  optionQueryStr: string
) {
  const purgedActualVals = reduce(
    preExistingVals,
    (memo, currentVal, currentKey) => {
      if (currentKey.startsWith(optionQueryStr)) {
        return { ...memo };
      } else {
        return { ...memo, [currentKey]: currentVal };
      }
    },
    {}
  );
  return purgedActualVals;
}

export function updateOptionFormFieldGroupWithOptionList(
  options: string[],
  setAutocompleteValues: (val: any) => void,
  stringForAutocompleteOptions: string
) {
  //first, remove all existing options
  const cleanedActualVals: {} = clearAllOptionFields(
    get(setAutocompleteValues, ["actualValues"]),
    stringForAutocompleteOptions
  );
  let newActualValues: {} = {};
  forEach(options, (option, optionIdx) => {
    newActualValues = {
      ...newActualValues,
      [stringForAutocompleteOptions + " " + (optionIdx + 1)]: option,
    };
  });
  if (setAutocompleteValues) {
    setAutocompleteValues({
      ...cleanedActualVals,
      ...newActualValues,
    });
  }
}

export function calculateWhetherCustomOptionValuesArePermitted(
  formFieldGroup: FormFieldGroup,
  questionIdx: number
) {
  const targetValue: boolean =
    formFieldGroup.actualValues["usersCanAddCustomOptions--" + questionIdx];
  return targetValue;
}
