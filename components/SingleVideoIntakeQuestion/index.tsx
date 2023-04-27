import { Checkbox, FormControlLabel, Grid, TextField } from "@mui/material";
import { get } from "lodash-es";
import { FormattedMessage, IntlShape, useIntl } from "react-intl";
import { QuestionValidity, SingleFormField } from "../../types";
import { convertCamelCaseToCapitalCase } from "../../utilities/textUtils";

const SingleVideoIntakeQuestion: React.FC<{
  intakeQuestionEl: any;
  intakeQuestionKey: string;
  wholeQuestion: SingleFormField;
  intakeQuestionsInvalid: QuestionValidity[] | undefined;
  intakeQuestionIdx: number;
}> = ({
  intakeQuestionEl,
  intakeQuestionKey,
  wholeQuestion,
  intakeQuestionsInvalid,
  intakeQuestionIdx,
}) => {
  console.log("deleteMe intakeQuestionEl is: ");
  console.log(intakeQuestionEl);
  console.log("deleteMe wholeQuestion is: ");
  console.log(wholeQuestion);
  console.log("deleteMe intakeQuestionKey is: " + intakeQuestionKey);

  const onTheNoDisplayList: boolean = (
    wholeQuestion?.doNotDisplay || []
  ).includes(intakeQuestionKey);
  console.log("deleteMe onTheNoDisplayList is: " + onTheNoDisplayList);

  const onCheckboxList: boolean = (
    wholeQuestion?.shouldBeCheckboxes || []
  ).includes(intakeQuestionKey);

  console.log("deleteMe onCheckboxList is: " + onCheckboxList);

  const shouldBeTextField: boolean = !onTheNoDisplayList && !onCheckboxList;
  console.log("deleteMe shouldBeTextField is: " + shouldBeTextField);
  const shouldBeCheckbox: boolean = !onTheNoDisplayList && onCheckboxList;
  console.log("deleteMe shouldBeCheckbox is: " + shouldBeCheckbox);

  const intl: IntlShape = useIntl();
  const handleChange: (event: any) => void = (event: any) => {
    console.log("deleteMe handleChange entered");
    console.log("deleteMe event is: ");
    console.log(event);
  };

  return (
    <Grid item lg={12} sm={12}>
      {shouldBeTextField && (
        <TextField
          fullWidth
          data-testid={intakeQuestionKey + "-" + intakeQuestionEl}
          error={get(intakeQuestionsInvalid, [
            intakeQuestionIdx,
            intakeQuestionKey,
          ])}
          variant="filled"
          label={
            <FormattedMessage
              id={intakeQuestionKey.toUpperCase().replace(" ", "_")}
              defaultMessage="Unknown question key"
            />
          }
          required
          helperText={
            get(intakeQuestionsInvalid, [intakeQuestionIdx, intakeQuestionKey])
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
          value={intakeQuestionEl}
        ></TextField>
      )}
      {shouldBeCheckbox && (
        <FormControlLabel
          style={{ marginRight: 10 }}
          control={<Checkbox />} // @TODO LEFT OFF HERE
          value={intakeQuestionEl}
          onChange={handleChange}
          label={convertCamelCaseToCapitalCase(intakeQuestionKey)}
        />
      )}
    </Grid>
  );
};

export default SingleVideoIntakeQuestion;
