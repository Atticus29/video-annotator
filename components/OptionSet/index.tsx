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
import { SingleFormField, FormFieldGroup } from "../../types";
import {
  calculateWhetherCustomOptionValuesArePermitted,
  updateIntakeQuestionFormField,
  updateOptionFormFieldGroupWithOptionList,
} from "../../utilities/singleFormFieldUtils";
import { isNonEmptyString } from "../../utilities/validators";
import InfoIcon from "../InfoIcon";
import SingleFormFieldComponent from "../SingleFormField";

const OptionSet: React.FC<{
  question: SingleFormField;
  questionIdx: number;
  formFieldGroup: FormFieldGroup;
  stringForAutocompleteOptions: string;
}> = ({
  question,
  questionIdx,
  formFieldGroup,
  stringForAutocompleteOptions,
}) => {
  const intl: IntlShape = useIntl();
  const checkBoxLabel: string = intl.formatMessage({
    id: "CAN_END_USER_ADD_CUSTOM_OPTIONS_SHORT",
    defaultMessage:
      "Can video annotators in this collection add their own options?",
  });

  let initialOptions: string[] = get(question, ["autocompleteOptions"], []);

  const seedAutocompleteVals: {} = reduce(
    initialOptions,
    (memo, option, optionIdx) => ({
      ...memo,
      [stringForAutocompleteOptions + " " + String(optionIdx + 1)]: option,
    }),
    {}
  );

  const [autocompleteValues, setAutocompleteValues] = useState<{}>(
    seedAutocompleteVals
  );
  const [invalidOptions, setInvalidOptions] = useState<{}>({});
  const optionFormFieldGroup: FormFieldGroup = useMemo(() => {
    return {
      title: "OptionFormFieldGroup",
      setValues: setAutocompleteValues,
      actualValues: autocompleteValues,
      isInvalids: invalidOptions,
      setIsInvalids: setInvalidOptions,
    };
  }, [invalidOptions, autocompleteValues]);

  useEffect(() => {
    const autoCompleteVals: string[] = filter(
      optionFormFieldGroup?.actualValues || {},
      (_optionFormFieldGroupValue, optionFormFieldGroupKey) => {
        return optionFormFieldGroupKey.startsWith(stringForAutocompleteOptions); // @TODO prevent the collection owner from making labels that start with Option??? Or at least test for wonky behavior
      }
    );
    updateIntakeQuestionFormField(
      autoCompleteVals,
      "autocompleteOptions",
      questionIdx,
      formFieldGroup
    );

    const canEndUserAddCustomOptionsVals =
      calculateWhetherCustomOptionValuesArePermitted(
        formFieldGroup,
        questionIdx,
        intl
      );

    updateIntakeQuestionFormField(
      canEndUserAddCustomOptionsVals,
      "usersCanAddCustomOptions",
      questionIdx,
      formFieldGroup
    );
  }, [
    formFieldGroup,
    intl,
    optionFormFieldGroup,
    questionIdx,
    stringForAutocompleteOptions,
  ]);
  const onlyAutocompletes: {} = filter(
    autocompleteValues,
    (_autocompleteValue, autoCompleteValueKey) => {
      return autoCompleteValueKey.startsWith(stringForAutocompleteOptions);
    }
  );
  const mappableOpts: string[] = Object.values(onlyAutocompletes);

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
      return currentFormFieldForOption;
    }
  );

  const optionFormFields = map(formFieldSet, (optionFormField, optionIdx) => {
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
    const currentOptions: string[] = Object.values(autocompleteValues) || [];
    updateOptionFormFieldGroupWithOptionList(
      [...currentOptions, ""],
      optionFormFieldGroup.setValues,
      stringForAutocompleteOptions
    );
  };

  const handleCheckChange: (
    event: React.ChangeEvent<HTMLInputElement>
  ) => void = (event: React.ChangeEvent<HTMLInputElement>) => {
    updateIntakeQuestionFormField(
      event.target.checked,
      checkBoxLabel ===
        "Can video annotators in this collection add their own options?"
        ? "usersCanAddCustomOptions"
        : checkBoxLabel, // @TODO change this
      questionIdx,
      formFieldGroup
    );
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
