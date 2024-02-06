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
import { convertCamelCaseToCapitalCase } from "../../utilities/textUtils";
import formFieldConfig from "../../formFieldConfig.json";
import {
  calculateCurrentAttributesToDisplay,
  updateCollection,
  updateFormFieldStates,
  updateIsRequiredChecked,
  updateIsRequiredUnchecked,
  updateUsersCanAddCustomOptionsChecked,
  updateUsersCanAddCustomOptionsUnchecked,
} from "../../utilities/singleFormFieldUtils";
import OptionSet from "../OptionSet";
import { isNonEmptyString } from "../../utilities/validators";
import {
  deleteSingleQuestionInCollection,
  transformQuestion,
  updateSingleQuestionInCollection,
} from "../../utilities/videoIntakeQuestionUtils";
import useUpdateCollectionVideoIntakeQuestions from "../../hooks/useUpdateCollectionVideoIntakeQuestions";
import { useQueryClient } from "@tanstack/react-query";
import { useState } from "react";

const SingleVideoIntakeQuestion: React.FC<{
  intakeQuestionEl: any;
  intakeQuestionKey: string;
  wholeQuestion: SingleFormField;
  intakeQuestionsInvalid: {};
  intakeQuestionIdx: number;
  collectionUrl: string;
  collection: Collection;
  setCollection: (collection: any) => void;
  formFieldGroup: FormFieldGroup;
}> = ({
  intakeQuestionEl,
  intakeQuestionKey,
  wholeQuestion,
  intakeQuestionsInvalid,
  intakeQuestionIdx,
  collection,
  setCollection,
  collectionUrl,
  formFieldGroup,
}) => {
  // console.log("deleteMe got here a1");
  // const queryClient = useQueryClient();
  // const {
  //   mutate: updateVideoIntakeQuestions,
  //   isPending,
  //   error,
  //   isError,
  // } = useUpdateCollectionVideoIntakeQuestions();
  const types: string[] =
    map(formFieldConfig, (configEntry) => configEntry?.type) || [];

  const onTheNoDisplayList: boolean = (
    wholeQuestion?.doNotDisplay || []
  ).includes(intakeQuestionKey);

  const currentAttributesToDisplay: string[] =
    calculateCurrentAttributesToDisplay(wholeQuestion);

  const onTheDisplayListForThisQuestionType: boolean =
    currentAttributesToDisplay.includes(intakeQuestionKey);

  const onCheckboxList: boolean = (
    wholeQuestion?.shouldBeCheckboxes || []
  ).includes(intakeQuestionKey);

  const shouldBeTypeDropdown: boolean =
    intakeQuestionKey === "type" && onTheDisplayListForThisQuestionType;
  const shouldBeTextField: boolean =
    !onTheNoDisplayList &&
    !onCheckboxList &&
    !shouldBeTypeDropdown &&
    onTheDisplayListForThisQuestionType;
  const shouldBeCheckbox: boolean =
    !onTheNoDisplayList &&
    onCheckboxList &&
    !shouldBeTypeDropdown &&
    onTheDisplayListForThisQuestionType;

  const intl: IntlShape = useIntl();
  const [currentQuestionType, setCurrentQuestionType] =
    useState<string>(intakeQuestionEl);

  const handleQuestionChange: (event: any) => void = (event: any) => {
    const currentVal: any = event?.currentTarget?.value || event?.target?.value;
    setCurrentQuestionType(currentVal);

    const transformedQuestion: SingleFormField = transformQuestion(
      wholeQuestion,
      currentVal
    );

    const newIntakeQuestionSet: SingleFormField[] = get(
      collection,
      ["videoIntakeQuestions"],
      []
    );
    newIntakeQuestionSet[intakeQuestionIdx] = transformedQuestion;

    // updateVideoIntakeQuestions(
    //   // @TODO maybe put this part under control of a save button
    //   {
    //     collectionUrl,
    //     collectionVideoIntakeQuestions: newIntakeQuestionSet,
    //   },
    //   {
    //     onSuccess: (responseData: any) => {
    //       console.log("deleteMe responseData of successful update:");
    //       console.log(responseData);
    //       queryClient.invalidateQueries({
    //         queryKey: ["singleCollection", collectionUrl],
    //       });
    //     },
    //     onError: (error) => {
    //       console.error("Mutation error", error);
    //     },
    //   }
    // );

    updateSingleQuestionInCollection(
      setCollection,
      intakeQuestionIdx,
      transformedQuestion,
      newIntakeQuestionSet,
      // collection?.videoIntakeQuestions || [],
      "videoIntakeQuestions"
    );
  };

  const [currentValue, setCurrentValue] = useState<any>(intakeQuestionEl);

  const handleChange: (event: any) => void = (event: any) => {
    // if the change is in the TYPE field, this should
    // 1) automatically modify other parts of the SingleFormField
    // 2) change what options are visible/available in the video intake questions section

    const currentVal: any = event?.currentTarget?.value || event?.target?.value;
    setCurrentValue(currentVal);

    console.log("deleteMe currentVal is: ");
    console.log(currentVal);

    updateCollection(
      collection,
      intakeQuestionIdx,
      intakeQuestionKey,
      currentVal,
      setCollection,
      "videoIntakeQuestions"
    );

    const targetQuestion: SingleFormField = get(
      collection,
      ["videoIntakeQuestions", intakeQuestionIdx],
      {}
    );
    const modifiedQuestion: any = {
      ...targetQuestion,
      [intakeQuestionKey]: currentVal,
    };
    const newIntakeQuestionSet: SingleFormField[] = get(
      collection,
      ["videoIntakeQuestions"],
      []
    );
    newIntakeQuestionSet[intakeQuestionIdx] = modifiedQuestion;

    // updateVideoIntakeQuestions(
    //   // @TODO maybe put this part under control of a save button
    //   {
    //     collectionUrl,
    //     collectionVideoIntakeQuestions: newIntakeQuestionSet,
    //   },
    //   {
    //     onSuccess: (responseData: any) => {
    //       console.log("deleteMe responseData of successful update:");
    //       console.log(responseData);
    //       queryClient.invalidateQueries({
    //         queryKey: ["singleCollection", collectionUrl],
    //       });
    //     },
    //     onError: (error) => {
    //       console.error("Mutation error", error);
    //     },
    //   }
    // );
  };

  const handleCheckChange: (event: any) => void = (_event: any) => {
    if (intakeQuestionKey === "isRequired" && !intakeQuestionEl === false) {
      // isRequired is being set to false. This means that we need to remove the isNonEmptyString method from the validationMethods array for this question
      updateIsRequiredUnchecked(
        formFieldGroup,
        "videoQuestionsFormFieldGroup",
        wholeQuestion,
        collection,
        intakeQuestionIdx,
        intakeQuestionKey,
        intakeQuestionEl,
        setCollection,
        "videoIntakeQuestions"
      );
    } else if (
      intakeQuestionKey === "isRequired" &&
      !intakeQuestionEl === true
    ) {
      updateIsRequiredChecked(
        formFieldGroup,
        "videoQuestionsFormFieldGroup",
        wholeQuestion,
        collection,
        intakeQuestionIdx,
        intakeQuestionKey,
        intakeQuestionEl,
        setCollection,
        "videoIntakeQuestions"
      );
    } else {
      updateCollection(
        collection,
        intakeQuestionIdx,
        intakeQuestionKey,
        !intakeQuestionEl,
        setCollection,
        "videoIntakeQuestions"
      );
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
        {shouldBeOptionField && (
          <OptionSet
            key={intakeQuestionIdx}
            question={wholeQuestion}
            formFieldGroup={formFieldGroup}
            // formFieldGroupString={"videoQuestionsFormFieldGroup"}
            // collection={collection}
            targetFormFieldIdx={intakeQuestionIdx}
            // setCollection={setCollection}
            whichIntakeQuestions={"videoIntakeQuestions"}
            stringForAutocompleteOptions="Option"
          />
        )}
        {shouldBeTextField && (
          <TextField
            fullWidth
            data-testid={intakeQuestionKey + "-" + intakeQuestionEl}
            error={get(intakeQuestionsInvalid, [intakeQuestionKey])}
            variant="filled"
            label={
              <FormattedMessage
                id={intakeQuestionKey.toUpperCase().replace(" ", "_")}
                defaultMessage="Unknown question key"
              />
            }
            required
            helperText={
              get(intakeQuestionsInvalid, [intakeQuestionKey])
                ? intl.formatMessage(
                    {
                      id: "GENERIC_CANNOT_BE_BLANK",
                      defaultMessage: "Field cannot be blank",
                    },
                    { name: "Question" + intakeQuestionKey } // @TODO internationalize this, too
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
            value={currentValue} // @TODO LEFT OFF HERE should be intakeQuestionEl or something
            onChange={handleCheckChange}
            label={convertCamelCaseToCapitalCase(intakeQuestionKey)}
          />
        )}
      </Grid>
    </>
  );
};

export default SingleVideoIntakeQuestion;
