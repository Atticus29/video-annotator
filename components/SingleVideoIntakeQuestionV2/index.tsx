import {
  Checkbox,
  FormControlLabel,
  Grid,
  InputLabel,
  MenuItem,
  Select,
  TextField,
} from "@mui/material";
import { map } from "lodash-es";
import { FormattedMessage, IntlShape, useIntl } from "react-intl";
import { FormFieldGroup, SingleFormField } from "../../types";
import {
  capitalizeEachWord,
  convertCamelCaseToCapitalCase,
} from "../../utilities/textUtils";
import formFieldConfig from "../../formFieldConfig.json";
import {
  replaceFormFieldValuesWith,
  updateIntakeQuestionFormField,
} from "../../utilities/singleFormFieldUtils";
import OptionSet from "../OptionSet";
import {
  calculateShouldBeCheckbox,
  calculateShouldBeTextField,
  calculateShouldBeTypeDropdown,
  transformActualValueObjIntoIntakeQuestions,
  transformIntakeQuestionsIntoActualValueObj,
  transformQuestion,
} from "../../utilities/videoIntakeQuestionUtils";
import { useMemo, useState } from "react";

const SingleVideoIntakeQuestionV2: React.FC<{
  intakeQuestionEl: any;
  intakeQuestionKey: string;
  intakeQuestionIdx: number;
  formFieldGroup: FormFieldGroup;
}> = ({
  intakeQuestionEl,
  intakeQuestionKey,
  intakeQuestionIdx,
  formFieldGroup,
}) => {
  const types: string[] =
    map(formFieldConfig, (configEntry) => configEntry?.type) || [];

  const shouldBeTypeDropdown: boolean = useMemo(() => {
    return calculateShouldBeTypeDropdown(
      transformActualValueObjIntoIntakeQuestions(formFieldGroup.actualValues)[
        intakeQuestionIdx
      ],
      intakeQuestionKey
    );
  }, [formFieldGroup.actualValues, intakeQuestionIdx, intakeQuestionKey]);

  const shouldBeTextField: boolean = useMemo(() => {
    return calculateShouldBeTextField(
      transformActualValueObjIntoIntakeQuestions(formFieldGroup.actualValues)[
        intakeQuestionIdx
      ],
      intakeQuestionKey
    );
  }, [formFieldGroup.actualValues, intakeQuestionIdx, intakeQuestionKey]);

  const shouldBeCheckbox: boolean = useMemo(() => {
    const reconstitutedTotipotentQuestion: SingleFormField =
      transformActualValueObjIntoIntakeQuestions(formFieldGroup.actualValues)[
        intakeQuestionIdx
      ];
    return calculateShouldBeCheckbox(
      reconstitutedTotipotentQuestion,
      intakeQuestionKey
    );
  }, [formFieldGroup.actualValues, intakeQuestionIdx, intakeQuestionKey]);

  const intl: IntlShape = useIntl();
  const [currentQuestionType, setCurrentQuestionType] =
    useState<string>(intakeQuestionEl);

  const handleQuestionChange: (event: any) => void = (event: any) => {
    const currentVal: any = event?.currentTarget?.value || event?.target?.value;
    setCurrentQuestionType(currentVal);

    const transformedQuestion: SingleFormField = transformQuestion(
      transformActualValueObjIntoIntakeQuestions(formFieldGroup.actualValues)[
        intakeQuestionIdx
      ],
      currentVal
    );

    const transformedQuestionAsActualValueObj =
      transformIntakeQuestionsIntoActualValueObj(
        [transformedQuestion],
        intakeQuestionIdx
      );

    const replacementActualValues: {} = replaceFormFieldValuesWith(
      formFieldGroup,
      transformedQuestionAsActualValueObj
    );

    const formFieldGroupSetter = formFieldGroup.setValues;
    if (formFieldGroupSetter) {
      formFieldGroupSetter(replacementActualValues);
    }
  };

  const handleChange: (event: any) => void = (event: any) => {
    // if the change is in the TYPE field, this should
    // 1) automatically modify other parts of the SingleFormField
    // 2) change what options are visible/available in the video intake questions section

    const currentVal: any = event?.currentTarget?.value || event?.target?.value;

    updateIntakeQuestionFormField(
      currentVal,
      intakeQuestionKey,
      intakeQuestionIdx,
      formFieldGroup
    );
  };

  const handleCheckChange: (
    event: React.ChangeEvent<HTMLInputElement>
  ) => void = (event: React.ChangeEvent<HTMLInputElement>) => {
    const currentVal: any = event?.target?.checked || false;

    updateIntakeQuestionFormField(
      currentVal,
      intakeQuestionKey,
      intakeQuestionIdx,
      formFieldGroup
    );
  };

  const typeElements = map(types, (type: string) => {
    return (
      <MenuItem key={type} value={type}>
        {type}
      </MenuItem>
    );
  });

  const shouldBeOptionField = intakeQuestionKey === "autocompleteOptions";

  return (
    <>
      <Grid item lg={12} sm={12}>
        {shouldBeOptionField && (
          <OptionSet
            key={intakeQuestionIdx}
            question={
              transformActualValueObjIntoIntakeQuestions(
                formFieldGroup.actualValues
              )[intakeQuestionIdx]
            }
            questionIdx={intakeQuestionIdx}
            formFieldGroup={formFieldGroup}
            targetFormFieldIdx={intakeQuestionIdx}
            whichIntakeQuestions={"videoIntakeQuestions"}
            stringForAutocompleteOptions="Option"
          />
        )}
        {shouldBeTextField && (
          <TextField
            fullWidth
            data-testid={intakeQuestionKey + "-" + intakeQuestionEl}
            error={
              formFieldGroup?.isInvalids[
                intakeQuestionKey + "--" + intakeQuestionIdx
              ] || false
            }
            variant="filled"
            label={
              <FormattedMessage
                id={intakeQuestionKey.toUpperCase().replace(" ", "_")}
                defaultMessage="Unknown question key"
              />
            }
            required
            helperText={
              formFieldGroup?.isInvalids[
                intakeQuestionKey + "--" + intakeQuestionIdx
              ] || false
                ? intl.formatMessage(
                    {
                      id: "GENERIC_CANNOT_BE_BLANK",
                      defaultMessage: "Field cannot be blank",
                    },
                    { name: capitalizeEachWord(intakeQuestionKey) }
                  )
                : ""
            }
            style={{ marginBottom: 10, maxWidth: 400 }}
            onChange={handleChange}
            value={
              formFieldGroup.actualValues[
                intakeQuestionKey + "--" + intakeQuestionIdx
              ]
            }
          ></TextField>
        )}
        {shouldBeTypeDropdown && (
          <>
            <InputLabel id={intakeQuestionKey + "-" + intakeQuestionEl}>
              <FormattedMessage id="TYPE" defaultMessage="Type" />
            </InputLabel>
            <Select
              labelId={intakeQuestionKey + "-" + intakeQuestionEl}
              id={intakeQuestionKey + "-" + intakeQuestionEl + "-select"}
              value={currentQuestionType}
              label="This should not be seen"
              onChange={handleQuestionChange} //this is currently assuming that the only dropdown is a question type change
              style={{ marginBottom: 10 }}
            >
              {types && typeElements}
            </Select>
          </>
        )}
        {shouldBeCheckbox && (
          <FormControlLabel
            style={{ marginRight: 10 }}
            control={
              <Checkbox
                checked={
                  formFieldGroup.actualValues[
                    intakeQuestionKey + "--" + intakeQuestionIdx
                  ]
                }
                onChange={handleCheckChange}
              />
            }
            value={
              formFieldGroup.actualValues[
                intakeQuestionKey + "--" + intakeQuestionIdx
              ]
            }
            label={convertCamelCaseToCapitalCase(intakeQuestionKey)}
          />
        )}
      </Grid>
    </>
  );
};

export default SingleVideoIntakeQuestionV2;
