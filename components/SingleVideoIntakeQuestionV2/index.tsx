import {
  Button,
  Checkbox,
  FormControlLabel,
  Grid,
  InputLabel,
  MenuItem,
  Select,
  TextField,
} from "@mui/material";
import { filter, get, map } from "lodash-es";
import { FormattedMessage, IntlShape, useIntl } from "react-intl";
import {
  Collection,
  FormFieldGroup,
  // QuestionValidity,
  SingleFormField,
} from "../../types";
import {
  capitalizeEachWord,
  convertCamelCaseToCapitalCase,
} from "../../utilities/textUtils";
import formFieldConfig from "../../formFieldConfig.json";
import {
  calculateCurrentAttributesToDisplay,
  updateCollection,
  updateFormFieldStates,
  updateIntakeQuestionFormField,
  updateIsRequiredChecked,
  updateIsRequiredUnchecked,
  updateUsersCanAddCustomOptionsChecked,
  updateUsersCanAddCustomOptionsUnchecked,
} from "../../utilities/singleFormFieldUtils";
import OptionSet from "../OptionSet";
import { isNonEmptyString } from "../../utilities/validators";
import {
  calculateShouldBeCheckbox,
  calculateShouldBeTextField,
  calculateShouldBeTypeDropdown,
  deleteSingleQuestionInCollection,
  transformQuestion,
  updateSingleQuestionInCollection,
} from "../../utilities/videoIntakeQuestionUtils";
import useUpdateCollectionVideoIntakeQuestions from "../../hooks/useUpdateCollectionVideoIntakeQuestions";
import { useQueryClient } from "@tanstack/react-query";
import { useEffect, useMemo, useState } from "react";

const SingleVideoIntakeQuestionV2: React.FC<{
  intakeQuestionEl: any;
  intakeQuestionKey: string;
  wholeQuestion: SingleFormField;
  intakeQuestionsInvalid: {};
  intakeQuestionIdx: number;
  collectionUrl: string;
  //   collection: Collection;
  //   setCollection: (collection: any) => void;
  formFieldGroup: FormFieldGroup;
}> = ({
  intakeQuestionEl,
  intakeQuestionKey,
  wholeQuestion,
  intakeQuestionsInvalid,
  intakeQuestionIdx,
  //   collection,
  //   setCollection,
  collectionUrl,
  formFieldGroup,
}) => {
  const [isInvalid, setIsinvalid] = useState<boolean>(false);
  useEffect(() => {
    console.log("deleteMe formFieldGroup is now: ");
    console.log(formFieldGroup);
    console.log("deleteMe intakeQuestionKey is: ");
    console.log(intakeQuestionKey);
    const currentIsInvalid: boolean =
      formFieldGroup?.isInvalids[intakeQuestionKey] || false;

    console.log("deleteMe currentIsInvalid is: ");
    console.log(currentIsInvalid);
    setIsinvalid(currentIsInvalid);
  }, [formFieldGroup, intakeQuestionKey]);

  const [localQuestion, setLocalQuestion] =
    useState<SingleFormField>(wholeQuestion);
  // const [formFieldUpdater, setFormFieldUpdater] = useState<number>(0);

  const types: string[] =
    map(formFieldConfig, (configEntry) => configEntry?.type) || [];

  const shouldBeTypeDropdown: boolean = calculateShouldBeTypeDropdown(
    localQuestion,
    intakeQuestionKey
  );

  const shouldBeTextField: boolean = useMemo(() => {
    return calculateShouldBeTextField(localQuestion, intakeQuestionKey);
  }, [localQuestion, intakeQuestionKey]);

  const shouldBeCheckbox: boolean = useMemo(() => {
    // console.log("deleteMe re-evaluated:");
    // console.log("deleteMe localQuestion is: ");
    // console.log(localQuestion);
    return calculateShouldBeCheckbox(localQuestion, intakeQuestionKey);
  }, [localQuestion, intakeQuestionKey]);

  // console.log("deleteMe shouldBeCheckbox is: ");
  // console.log(shouldBeCheckbox);

  const intl: IntlShape = useIntl();
  const [currentQuestionType, setCurrentQuestionType] =
    useState<string>(intakeQuestionEl);

  const handleQuestionChange: (event: any) => void = (event: any) => {
    const currentVal: any = event?.currentTarget?.value || event?.target?.value;
    setCurrentQuestionType(currentVal);

    const transformedQuestion: SingleFormField = transformQuestion(
      localQuestion,
      currentVal
    );

    // console.log("deleteMe transformedQuestion in handleQuestionChange is: ");
    // console.log(transformedQuestion);

    setLocalQuestion(transformedQuestion);

    // const newIntakeQuestionSet: SingleFormField[] = get(
    //   collection,
    //   ["videoIntakeQuestions"],
    //   []
    // );
    // newIntakeQuestionSet[intakeQuestionIdx] = transformedQuestion;

    // updateSingleQuestionInCollection(
    //   setCollection,
    //   intakeQuestionIdx,
    //   transformedQuestion,
    //   newIntakeQuestionSet,
    //   // collection?.videoIntakeQuestions || [],
    //   "videoIntakeQuestions"
    // );
  };

  const [currentValue, setCurrentValue] = useState<any>(intakeQuestionEl);

  const handleChange: (event: any) => void = (event: any) => {
    // if the change is in the TYPE field, this should
    // 1) automatically modify other parts of the SingleFormField
    // 2) change what options are visible/available in the video intake questions section

    const currentVal: any = event?.currentTarget?.value || event?.target?.value;
    setCurrentValue(currentVal);
    console.log("deleteMe intakeQuestionKey is: ");
    console.log(intakeQuestionKey);
    console.log("deleteMe intakeQuestionEl is: ");
    console.log(intakeQuestionEl);
    // console.log("deleteMe currentVal is: ");
    // console.log(currentVal);

    updateIntakeQuestionFormField(
      currentVal,
      intakeQuestionKey,
      intakeQuestionIdx,
      formFieldGroup
      // setFormFieldUpdater
    );

    // console.log("deleteMe formFieldGroup is now: ");
    // console.log(formFieldGroup);

    // updateCollection(
    //   collection,
    //   intakeQuestionIdx,
    //   intakeQuestionKey,
    //   currentVal,
    //   setCollection,
    //   "videoIntakeQuestions"
    // );

    // const targetQuestion: SingleFormField = get(
    //   collection,
    //   ["videoIntakeQuestions", intakeQuestionIdx],
    //   {}
    // );
    // const modifiedQuestion: any = {
    //   ...targetQuestion,
    //   [intakeQuestionKey]: currentVal,
    // };
    // const newIntakeQuestionSet: SingleFormField[] = get(
    //   collection,
    //   ["videoIntakeQuestions"],
    //   []
    // );
    // newIntakeQuestionSet[intakeQuestionIdx] = modifiedQuestion;
  };

  const handleCheckChange: (event: any) => void = (_event: any) => {
    console.log("deleteMe handleCheckChange called");
    if (intakeQuestionKey === "isRequired" && !intakeQuestionEl === false) {
      // isRequired is being set to false. This means that we need to remove the isNonEmptyString method from the validationMethods array for this question
      //   updateIsRequiredUnchecked(
      //     formFieldGroup,
      //     "videoQuestionsFormFieldGroup",
      //     localQuestion,
      //     collection,
      //     intakeQuestionIdx,
      //     intakeQuestionKey,
      //     intakeQuestionEl,
      //     setCollection,
      //     "videoIntakeQuestions"
      //   );
    } else if (
      intakeQuestionKey === "isRequired" &&
      !intakeQuestionEl === true
    ) {
      //   updateIsRequiredChecked(
      //     formFieldGroup,
      //     "videoQuestionsFormFieldGroup",
      //     localQuestion,
      //     collection,
      //     intakeQuestionIdx,
      //     intakeQuestionKey,
      //     intakeQuestionEl,
      //     setCollection,
      //     "videoIntakeQuestions"
      //   );
    } else {
      //   updateCollection(
      //     collection,
      //     intakeQuestionIdx,
      //     intakeQuestionKey,
      //     !intakeQuestionEl,
      //     setCollection,
      //     "videoIntakeQuestions"
      //   );
    }
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
        {/* {shouldBeOptionField && ( // @TODO comment this back in a refactor
          <OptionSet
            key={intakeQuestionIdx}
            formField={localQuestion}
            formFieldGroupString={"videoQuestionsFormFieldGroup"}
            collection={collection} //@TODO update this as well
            targetFormFieldIdx={intakeQuestionIdx}
            setCollection={setCollection} //@TODO update this as well
            whichIntakeQuestions={"videoIntakeQuestions"}
          />
        )} */}
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
                    { name: capitalizeEachWord(intakeQuestionKey) } // @TODO internationalize this, too
                  )
                : ""
            }
            style={{ marginBottom: 10, maxWidth: 400 }}
            onChange={handleChange}
            value={currentValue}
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
              label="TODO deleteMe"
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
            control={<Checkbox checked={intakeQuestionEl} />}
            value={currentValue}
            onChange={handleCheckChange}
            label={convertCamelCaseToCapitalCase(intakeQuestionKey)}
          />
        )}
      </Grid>
    </>
  );
};

export default SingleVideoIntakeQuestionV2;
