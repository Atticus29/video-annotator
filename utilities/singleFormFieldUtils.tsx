import { filter, forEach, get, map, reduce } from "lodash-es";
import { IntlShape } from "react-intl";
import formFieldConfig from "../formFieldConfig.json";
import { SingleFormField, Collection, FormFieldGroup } from "../types";
import {
  isNonEmptyString,
  isValidEmail,
  isValidUrl,
  isValidOption,
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
    // console.log("deleteMe currentIndex is: ");
    // console.log(currentIndex);
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
    // console.log("deleteMe originalWithOldRemoved is: ");
    // console.log(originalWithOldRemoved);
    return { ...originalWithOldRemoved, ...replacementValues };
  } else {
    return { ...originalFormFieldGroup.actualValues, ...replacementValues };
  }
}

export function updateIntakeQuestionFormField(
  currentVal: any,
  // wholeQuestionLabel: string,
  // question: SingleFormField,
  intakeQuestionKey: string,
  intakeQuestionIdx: number,
  formFieldGroup: FormFieldGroup
  // setFormFieldUpdater: (input: any) => void
) {
  console.log("deleteMe updateIntakeQuestionFormField is called");
  console.log("deleteMe currentVal is: ");
  console.log(currentVal);
  console.log("deleteMe intakeQuestionKey singleFormUtils is: ");
  console.log(intakeQuestionKey);
  console.log("deleteMe intakeQuestionIdx is: ");
  console.log(intakeQuestionIdx);
  // console.log("deleteMe formFieldGroup is: ");
  // console.log(formFieldGroup);
  // console.log("deleteMe e1 wholeQuestionLabel is: ");
  // console.log("e1: " + wholeQuestionLabel);
  // setFormFieldUpdater((prevState: number) => {
  //   return prevState++;
  // }); // this is just to kick off the re-render in vase the FormFieldGroup object is too complex to see updates in
  const valueSetter: ((input: any) => void) | undefined = get(formFieldGroup, [
    "setValues",
  ]);
  const invalidSetter: ((input: any) => void) | undefined = get(
    formFieldGroup,
    ["setIsInvalids"]
  );
  if (invalidSetter) {
    // console.log("deleteMe e1 intakeQuestionKey is: " + intakeQuestionKey);
    const isInvalid: boolean =
      intakeQuestionKey === "isRequired" ||
      intakeQuestionKey === "usersCanAddCustomOptions"
        ? false
        : !isNonEmptyString(currentVal);
    // console.log("deleteMe e2: isValid is: ");
    // console.log(isValid);
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

  // console.log("deleteMe updateFormField called.");
  // console.log("deleteMe question is: ");
  // console.log(question);
  // console.log("deleteMe intakeQuestionIdx is: ");
  // console.log(intakeQuestionIdx);
  // console.log("deleteMe formFieldGroup is: ");
  // console.log(formFieldGroup);
}

export function updateCollection(
  collection: Collection,
  questionIdx: number,
  questionKey: string,
  newVal: any,
  setCollection: (collection: any) => void,
  whichIntakeQuestions: string
) {
  // console.log("deleteMe got here x");
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
  defaultValidValue: boolean = false,
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
    question?.type === "URL" &&
    !currentValidatorMethods.includes(isValidUrl)
  ) {
    currentValidatorMethods?.push(isValidUrl);
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
  // console.log("deleteMe purgedActualVals is: ");
  // console.log(purgedActualVals);
  return purgedActualVals;
}

export function updateOptionFormFieldGroupWithOptionList(
  options: string[],
  // optionFormFieldGroup: FormFieldGroup,
  setAutocompleteValues: (val: any) => void,
  stringForAutocompleteOptions: string
) {
  // console.log("deleteMe entering updateOptionFormFieldGroupWithOptionList");
  // console.log("deleteMe setAutocompleteValues is: ");
  // console.log(setAutocompleteValues);
  // console.log("deleteMe options is: ");
  // console.log(options);
  //first, remove all existing options
  const cleanedActualVals: {} = clearAllOptionFields(
    get(setAutocompleteValues, ["actualValues"]),
    stringForAutocompleteOptions
  );
  if (setAutocompleteValues) {
    setAutocompleteValues(cleanedActualVals);
  }
  let newActualValues: {} = {};
  forEach(options, (option, optionIdx) => {
    // console.log("deleteMe current option is: ");
    // console.log(option);
    // console.log("deleteMe optionIdx is: ");
    // console.log(optionIdx);
    newActualValues = {
      ...newActualValues,
      [stringForAutocompleteOptions + " " + (optionIdx + 1)]: option,
    };
    // if (optionFormFieldGroup.setValues) {
    //   optionFormFieldGroup.setValues((prevState: {}) => {
    //     const returnVal = { ...prevState, ...newActualValue };
    //     return returnVal;
    //   });
    // }
  });
  if (setAutocompleteValues) {
    setAutocompleteValues({
      ...cleanedActualVals,
      ...newActualValues,
    });
  }

  // console.log("deleteMe setAutocompleteValues after is: ");
  // console.log(setAutocompleteValues);
}

export function calculateWhetherCustomOptionValuesArePermitted(
  optionFormFieldGroup: FormFieldGroup,
  intl: IntlShape
) {
  const canEndUserAddCustomOptionsValsArr: string[] = filter(
    optionFormFieldGroup?.actualValues || {},
    (_optionFormFieldGroupValue, optionFormFieldGroupKey) => {
      const targetString: string = intl.formatMessage({
        id: "CAN_END_USER_ADD_CUSTOM_OPTIONS_SHORT",
        defaultMessage:
          "Can video annotators in this collection add their own options?",
      });
      return optionFormFieldGroupKey.startsWith(targetString);
    }
  );
  const canEndUserAddCustomOptionsVals = get(
    canEndUserAddCustomOptionsValsArr,
    [0],
    true
  );

  return canEndUserAddCustomOptionsVals;
}

export function updateIsRequiredUnchecked(
  formFieldGroup: FormFieldGroup,
  formFieldGroupString: string,
  wholeQuestion: SingleFormField,
  collection: Collection,
  intakeQuestionIdx: number,
  intakeQuestionKey: string,
  intakeQuestionEl: any,
  setCollection: (collection: any) => void,
  whichIntakeQuestions: string
) {
  updateCheckboxGeneral(
    formFieldGroup,
    formFieldGroupString,
    wholeQuestion,
    collection,
    intakeQuestionIdx,
    intakeQuestionKey,
    intakeQuestionEl,
    setCollection,
    false,
    isNonEmptyString,
    whichIntakeQuestions
  );
}

export function updateIsRequiredChecked(
  formFieldGroup: FormFieldGroup,
  formFieldGroupString: string,
  wholeQuestion: SingleFormField,
  collection: Collection,
  intakeQuestionIdx: number,
  intakeQuestionKey: string,
  intakeQuestionEl: any,
  setCollection: (collection: any) => void,
  whichIntakeQuestions: string
) {
  updateCheckboxGeneral(
    formFieldGroup,
    formFieldGroupString,
    wholeQuestion,
    collection,
    intakeQuestionIdx,
    intakeQuestionKey,
    intakeQuestionEl,
    setCollection,
    true,
    isNonEmptyString,
    whichIntakeQuestions
  );
}

export function updateUsersCanAddCustomOptionsUnchecked(
  formFieldGroup: FormFieldGroup,
  formFieldGroupString: string,
  wholeQuestion: SingleFormField,
  collection: Collection,
  intakeQuestionIdx: number,
  intakeQuestionKey: string,
  intakeQuestionEl: any,
  setCollection: (collection: any) => void,
  whichIntakeQuestions: string
) {
  updateCheckboxGeneral(
    formFieldGroup,
    formFieldGroupString,
    wholeQuestion,
    collection,
    intakeQuestionIdx,
    intakeQuestionKey,
    intakeQuestionEl,
    setCollection,
    true,
    isValidOption,
    whichIntakeQuestions
  );
}

export function updateUsersCanAddCustomOptionsChecked(
  formFieldGroup: FormFieldGroup,
  formFieldGroupString: string,
  wholeQuestion: SingleFormField,
  collection: Collection,
  intakeQuestionIdx: number,
  intakeQuestionKey: string,
  intakeQuestionEl: any,
  setCollection: (collection: any) => void,
  whichIntakeQuestions: string
) {
  updateCheckboxGeneral(
    formFieldGroup,
    formFieldGroupString,
    wholeQuestion,
    collection,
    intakeQuestionIdx,
    intakeQuestionKey,
    intakeQuestionEl,
    setCollection,
    false,
    isValidOption,
    whichIntakeQuestions
  );
}

export function updateCheckboxGeneral(
  formFieldGroup: FormFieldGroup,
  formFieldGroupString: string,
  wholeQuestion: SingleFormField,
  collection: Collection,
  intakeQuestionIdx: number,
  intakeQuestionKey: string,
  intakeQuestionEl: any,
  setCollection: (collection: any) => void,
  checkVal: boolean,
  vaildatorMethodToFilter: (input: any, optionalInput?: any) => boolean,
  whichIntakeQuestions: string
) {
  const currentValForAutocomplete: string = get(
    collection,
    [formFieldGroupString, "actualValues", wholeQuestion?.label],
    ""
  );

  const isCustomOptionsUnchecked: boolean =
    intakeQuestionKey === "usersCanAddCustomOptions" && checkVal; // checkVal is true when unchecked currently. Wut. I dunno.
  const customOptValidityVal: boolean = isCustomOptionsUnchecked
    ? vaildatorMethodToFilter(
        currentValForAutocomplete,
        wholeQuestion?.autocompleteOptions
      )
    : true;
  let validityValue: boolean =
    intakeQuestionKey === "isRequired" ? checkVal : customOptValidityVal;

  const shouldReinstateValidator: boolean = checkVal === true;
  if (
    formFieldGroup &&
    formFieldGroup.setIsInvalids &&
    wholeQuestion &&
    wholeQuestion.label
  ) {
    formFieldGroup.setIsInvalids({
      ...formFieldGroup.isInvalids,
      [wholeQuestion.label]: validityValue,
    });
  }

  const targetQuestion: SingleFormField = get(
    collection,
    [whichIntakeQuestions, intakeQuestionIdx],
    {}
  );
  const currentValidatorMethods: ((input: any) => boolean)[] = get(
    targetQuestion,
    ["validatorMethods"],
    []
  );

  const filteredMethods = filter(
    currentValidatorMethods,
    (currentValidatorMethod) => {
      return currentValidatorMethod !== vaildatorMethodToFilter;
    }
  );

  const validatorMethodsWithFilteredMethodReinstated: ((
    input: any,
    options?: any
  ) => boolean)[] = [...filteredMethods, vaildatorMethodToFilter];

  const modifiedQuestion: any = {
    ...targetQuestion,
    [intakeQuestionKey]: !intakeQuestionEl,
    validatorMethods: shouldReinstateValidator
      ? validatorMethodsWithFilteredMethodReinstated
      : filteredMethods,
  };

  const newIntakeQuestionSet: SingleFormField[] = get(
    collection,
    [whichIntakeQuestions],
    []
  );
  newIntakeQuestionSet[intakeQuestionIdx] = modifiedQuestion;

  setCollection((prevState: any) => {
    let firstTimeIsCustomOptionsUncheckedInvalid = {};
    if (
      Object.keys(formFieldGroup?.isInvalids || {}).length === 0 &&
      isCustomOptionsUnchecked
    ) {
      // this is such a hack and I hate that it seems necessary
      firstTimeIsCustomOptionsUncheckedInvalid = {
        [wholeQuestion?.label]: !validityValue,
      };
    }
    const modifiedIsInvalids: any = {
      ...get(collection, [formFieldGroupString, "isInvalids"]),
      ...formFieldGroup?.isInvalids,
      ...firstTimeIsCustomOptionsUncheckedInvalid,
    };

    const modifiedFormFieldGroup: any = {
      ...get(collection, [formFieldGroupString]),
      isInvalids: modifiedIsInvalids,
    };

    return {
      ...prevState,
      [whichIntakeQuestions]: newIntakeQuestionSet,
      [formFieldGroupString]: modifiedFormFieldGroup,
    };
  });
}
