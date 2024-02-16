import {
  Button,
  Checkbox,
  FormControlLabel,
  Paper,
  Typography,
} from "@mui/material";
import { filter, get, map, reduce } from "lodash-es";
import React, { useEffect, useMemo } from "react";
import { useState } from "react";
import { FormattedMessage, IntlShape, useIntl } from "react-intl";
import { SingleFormField, Collection, FormFieldGroup } from "../../types";
import {
  calculateWhetherCustomOptionValuesArePermitted,
  updateCollection,
  updateIntakeQuestionFormField,
  updateOptionFormFieldGroupWithOptionList,
  updateUsersCanAddCustomOptionsChecked,
  updateUsersCanAddCustomOptionsUnchecked,
} from "../../utilities/singleFormFieldUtils";
import { isNonEmptyString } from "../../utilities/validators";
import InfoIcon from "../InfoIcon";
import SingleFormFieldComponent from "../SingleFormField";

const OptionSet: React.FC<{
  question: SingleFormField;
  questionIdx: number;
  formFieldGroup: FormFieldGroup;
  // formFieldGroupString: string;
  // collection: Collection;
  targetFormFieldIdx: number;
  // setCollection: (collection: Collection) => void;
  whichIntakeQuestions: string;
  stringForAutocompleteOptions: string;
}> = ({
  question,
  questionIdx,
  formFieldGroup,
  // collection,
  targetFormFieldIdx,
  // setCollection,
  whichIntakeQuestions,
  stringForAutocompleteOptions,
}) => {
  const intl: IntlShape = useIntl();
  const checkBoxLabel: string = intl.formatMessage({
    id: "CAN_END_USER_ADD_CUSTOM_OPTIONS_SHORT",
    defaultMessage:
      "Can video annotators in this collection add their own options?",
  });

  let initialOptions: string[] = get(question, ["autocompleteOptions"], []);
  // console.log("deleteMe initialOptions are: ");
  // console.log(initialOptions);

  const seedAutocompleteVals: {} = reduce(
    initialOptions,
    (memo, option, optionIdx) => ({
      ...memo,
      [stringForAutocompleteOptions + " " + String(optionIdx + 1)]: option,
    }),
    {}
  );
  // console.log("deleteMe seedAutocompleteVals are: ");
  // console.log(seedAutocompleteVals);

  // const [canAddOptions, setCanAddOptions] = useState<boolean>(true);

  const [autocompleteValues, setAutocompleteValues] = useState<{}>(
    seedAutocompleteVals
  );
  const [invalidOptions, setInvalidOptions] = useState<{}>({});
  const optionFormFieldGroup: FormFieldGroup = useMemo(() => {
    // console.log("deleteMe autocompleteValues updated and is now:");
    // console.log(autocompleteValues);
    return {
      title: "OptionFormFieldGroup",
      setValues: setAutocompleteValues,
      actualValues: autocompleteValues,
      isInvalids: invalidOptions,
      setIsInvalids: setInvalidOptions,
    };
  }, [invalidOptions, autocompleteValues]);

  // useEffect(() => {
  //   updateOptionFormFieldGroupWithOptionList(
  //     options,
  //     // optionFormFieldGroup,
  //     setAutocompleteValues,
  //     stringForAutocompleteOptions
  //   );

  //   const newKey: string = intl.formatMessage({
  //     id: "CAN_END_USER_ADD_CUSTOM_OPTIONS_SHORT",
  //     defaultMessage:
  //       "Can video annotators in this collection add their own options?",
  //   });

  //   const canEndUserAddCustomOptionsVals =
  //     calculateWhetherCustomOptionValuesArePermitted(
  //       optionFormFieldGroup,
  //       intl
  //     );

  //   if (optionFormFieldGroup?.setValues) {
  //     optionFormFieldGroup.setValues((prevState: {}) => {
  //       return { ...prevState, [newKey]: canEndUserAddCustomOptionsVals };
  //     });
  //   }
  //   // eslint-disable-next-line react-hooks/exhaustive-deps
  // }, []);

  useEffect(() => {
    // console.log("deleteMe optionFormFieldGroup updates");
    const autoCompleteVals: string[] = filter(
      optionFormFieldGroup?.actualValues || {},
      (_optionFormFieldGroupValue, optionFormFieldGroupKey) => {
        return optionFormFieldGroupKey.startsWith(stringForAutocompleteOptions); // @TODO prevent the collection owner from making labels that start with Option??? Or at least test for wonky behavior
      }
    );
    // console.log("deleteMe e1 whichIntakeQuestions is: ");
    // console.log(whichIntakeQuestions);
    updateIntakeQuestionFormField(
      autoCompleteVals,
      // question?.label,
      "autocompleteOptions",
      questionIdx,
      formFieldGroup
    );
    // updateCollection(
    //   collection, // collection
    //   targetFormFieldIdx, //questionIdx
    //   "autocompleteOptions", // questionKey
    //   autoCompleteVals, //newVal
    //   setCollection, //setCollection
    //   whichIntakeQuestions // whichIntakeQuestions
    // );

    const canEndUserAddCustomOptionsVals =
      calculateWhetherCustomOptionValuesArePermitted(
        formFieldGroup,
        questionIdx,
        intl
      );
    console.log("deleteMe canEndUserAddCustomOptionsVals is: ");
    console.log(canEndUserAddCustomOptionsVals);

    updateIntakeQuestionFormField(
      canEndUserAddCustomOptionsVals,
      // question?.label,
      "usersCanAddCustomOptions",
      questionIdx,
      formFieldGroup
    );
    // updateCollection(
    //   collection,
    //   targetFormFieldIdx, //questionIdx
    //   "usersCanAddCustomOptions", //questionKey
    //   canEndUserAddCustomOptionsVals, //newVal
    //   setCollection,
    //   whichIntakeQuestions
    // );
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [optionFormFieldGroup]);
  const onlyAutocompletes: {} = filter(
    autocompleteValues,
    (_autocompleteValue, autoCompleteValueKey) => {
      return autoCompleteValueKey.startsWith(stringForAutocompleteOptions);
    }
  );
  const mappableOpts: string[] = Object.values(onlyAutocompletes);
  // console.log("deleteMe mappableOpts are: ");
  // console.log(mappableOpts);

  const formFieldSet: SingleFormField[] = map(
    mappableOpts,
    (_option: string, optionIdx: number) => {
      const currentFormFieldForOption = {
        label: stringForAutocompleteOptions + " " + (optionIdx + 1),
        type: "Text",
        language: question?.language,
        isRequired: true,
        shouldBeCheckboxes: [],
        invalidInputMessage: "FIELD_CANNOT_BE_BLANK",
        validatorMethods: [isNonEmptyString],
      };
      return currentFormFieldForOption; // @TODO fix... no longer sure what's wrong with this.
    }
  );

  const optionFormFields = map(formFieldSet, (optionFormField, optionIdx) => {
    // console.log("deleteMe optionFormField in map loop is: ");
    // console.log(optionFormField);
    const key: string = "option-" + (optionIdx + 1);
    return (
      <>
        <SingleFormFieldComponent
          key={key}
          question={optionFormField}
          formFieldGroup={optionFormFieldGroup}
          areAutocompleteOptionsDeletable={true}
          setAutocompleteValues={optionFormFieldGroup.setValues}
          stringForAutocompleteOptions={stringForAutocompleteOptions}
        />
      </>
    );
  });

  const handleAddAnotherOption: () => void = () => {
    console.log(
      "deleteMe autocompleteValues going into handleAddAnotherOption are: "
    );
    console.log(autocompleteValues);
    // options.push("");
    // console.log(
    //   "deleteMe before calling updateOptionFormFieldGroupWithOptionList options is now: "
    // );
    // console.log(options);
    const currentOptions: string[] = Object.values(autocompleteValues) || [];
    updateOptionFormFieldGroupWithOptionList(
      [...currentOptions, ""],
      // optionFormFieldGroup,
      optionFormFieldGroup.setValues,
      stringForAutocompleteOptions
    );
  };

  const handleCheckChange: (
    event: React.ChangeEvent<HTMLInputElement>
  ) => void = (event: React.ChangeEvent<HTMLInputElement>) => {
    console.log("deleteMe handleCheckChange called:");
    // console.log(checkBoxLabel);
    // console.log("deleteMe and value is: ");
    // console.log(event?.target?.checked);
    // const newActualValue: {} = {
    //   [checkBoxLabel]: event.target.checked,
    // };
    // console.log("deleteMe newActualValue is: ");
    // console.log(newActualValue);

    // console.log("deleteMe checkBoxLabel is: ");
    // console.log(checkBoxLabel);

    // console.log("deleteMe questionIdx is: " + questionIdx);
    // console.log("deleteMe question is: ");
    // console.log(question);
    // console.log("deleteMe whichIntakeQuestions is:");
    // console.log(whichIntakeQuestions);

    updateIntakeQuestionFormField(
      event.target.checked,
      checkBoxLabel ===
        "Can video annotators in this collection add their own options?"
        ? "usersCanAddCustomOptions"
        : checkBoxLabel, // @TODO change this
      questionIdx,
      // optionFormFieldGroup
      formFieldGroup
    );

    // // setCanAddOptions((prev) => !prev);
    // if (optionFormFieldGroup?.setValues) {
    //   optionFormFieldGroup.setValues((prevState: {}) => {
    //     return { ...prevState, ...newActualValue };
    //   });
    // }
    // console.log("deleteMe optionFormFieldGroup after updating is: ");
    // console.log(optionFormFieldGroup.actualValues);
    // if (!canAddOptions === true) {
    //   // console.log(
    //   //   "deleteMe updateUsersCanAddCustomOptionsChecked here (canAddOptions is true)"
    //   // );
    //   // updateUsersCanAddCustomOptionsChecked(
    //   //   optionFormFieldGroup,
    //   //   formFieldGroupString,
    //   //   formField,
    //   //   collection,
    //   //   targetFormFieldIdx,
    //   //   "usersCanAddCustomOptions",
    //   //   !canAddOptions,
    //   //   setCollection,
    //   //   whichIntakeQuestions
    //   // );
    // } else if (!canAddOptions === false) {
    //   // console.log(
    //   //   "deleteMe updateUsersCanAddCustomOptionsChecked here (canAddOptions is false)"
    //   // );
    //   // updateUsersCanAddCustomOptionsUnchecked(
    //   //   optionFormFieldGroup,
    //   //   formFieldGroupString,
    //   //   formField,
    //   //   collection,
    //   //   targetFormFieldIdx,
    //   //   "usersCanAddCustomOptions",
    //   //   !canAddOptions,
    //   //   setCollection,
    //   //   whichIntakeQuestions
    //   // );
    // }
  };

  return (
    <>
      <Paper
        elevation={8}
        style={{
          margin: "auto",
          marginTop: "3vh",
          paddingBottom: "10vh",
          paddingTop: "3vh",
          paddingLeft: "3vw",
          paddingRight: "3vw",
        }}
      >
        <Typography style={{ marginBottom: 10 }}>
          Options for {question?.label}
          {/* @TODO internationalize Options for */}
        </Typography>
        {optionFormFields}
        <Button
          variant="contained"
          onClick={handleAddAnotherOption}
          style={{ marginBottom: 10 }}
        >
          <FormattedMessage
            id="ADD_ANOTHER_OPTION"
            defaultMessage="Add another option"
          />
        </Button>
      </Paper>
      <div style={{ display: "flex", alignItems: "center", marginTop: 20 }}>
        <div
          style={{ display: "flex", alignItems: "center", marginBottom: 10 }}
        >
          <FormControlLabel
            style={{ marginRight: 10 }}
            control={
              <Checkbox
                checked={get(
                  formFieldGroup,
                  [
                    "actualValues",
                    (checkBoxLabel ===
                    "Can video annotators in this collection add their own options?"
                      ? "usersCanAddCustomOptions"
                      : checkBoxLabel) +
                      "--" +
                      questionIdx,
                  ],
                  true
                )}
                onChange={handleCheckChange}
              />
            }
            // value={get(
            //   optionFormFieldGroup,
            //   ["actualValues", checkBoxLabel],
            //   true
            // )}
            label={checkBoxLabel}
          />
        </div>
        <InfoIcon
          messageId="CAN_END_USER_ADD_CUSTOM_OPTIONS"
          defaultMessage="Can the people annotating videos in this collection add their own candidates to this list? You as the collection owner will be able to approve, merge, or remove these later."
        />
      </div>
    </>
  );
};

export default OptionSet;
