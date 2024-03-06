import { ReactNode, SyntheticEvent, useEffect, useState } from "react";
import { FormattedMessage, IntlShape, useIntl } from "react-intl";

import {
  Autocomplete,
  AutocompleteRenderInputParams,
  Checkbox,
  FormControlLabel,
  Link,
  TextField,
  Tooltip,
  Typography,
} from "@mui/material";
import DeleteIcon from "@mui/icons-material/Delete";
import { DatePicker } from "@mui/x-date-pickers/DatePicker";
import { filter, get, reduce } from "lodash-es";
import dayjs from "dayjs";

import { FormFieldGroup, SingleFormField, Collection } from "../../types";
import {
  updateFormFieldStates,
  updateOptionFormFieldGroupWithOptionList,
} from "../../utilities/singleFormFieldUtils";

const SingleFormField: React.FC<{
  question: SingleFormField | undefined;
  formFieldGroup: FormFieldGroup | undefined;
  areAutocompleteOptionsDeletable?: boolean;
  stringForAutocompleteOptions?: string;
  setAutocompleteValues?: (val: any) => void;
}> = ({
  question,
  formFieldGroup,
  areAutocompleteOptionsDeletable = false,
  stringForAutocompleteOptions = "Option",
  setAutocompleteValues,
}) => {
  const intl: IntlShape = useIntl();
  const [localVal, setLocalVal] = useState<string | null>(null);
  const questionLabel: string | undefined = get(question, ["label"]);
  const currentIsInvalid: boolean = questionLabel
    ? get(formFieldGroup, ["isInvalids", questionLabel], false)
    : false;

  useEffect(() => {
    // set default values. In the case of checkbox, this is needed for correct behavior. In the case of Date, it's a bandaid for resolving the missing value red box/required upon initial load issue
    if (
      question?.type === "Checkbox" &&
      !get(formFieldGroup, ["actualValues", question?.label])
    ) {
      updateFormFieldStates(false, formFieldGroup, question);
    }

    if (
      question?.type === "Date" &&
      !get(formFieldGroup, ["actualValues", question?.label])
    ) {
      updateFormFieldStates(dayjs(), formFieldGroup, question);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const handleTextChange: (
    event: React.ChangeEvent<HTMLInputElement>
  ) => void = (event: React.ChangeEvent<HTMLInputElement>) => {
    const currentVal: any = event?.currentTarget?.value;
    if (question) {
      setLocalVal(currentVal);
      updateFormFieldStates(currentVal, formFieldGroup, question); // Note that this controlled stuff needs to be set AFTER the local useState. Otherwise, there are weird cursor placement issues. See https://dev.to/kwirke/solving-caret-jumping-in-react-inputs-36ic. Update March 1, 2024 - after the refactor using tanStack query, I no longer am sure whether this is true. @TODO confirm.
    }
  };

  const handleAutocompleteChange: (
    event: SyntheticEvent<Element, Event>,
    newValue: any
  ) => void = (_event: SyntheticEvent<Element, Event>, newValue: any) => {
    if (question) {
      if (newValue) {
        updateFormFieldStates(newValue, formFieldGroup, question);
      } else {
        updateFormFieldStates("", formFieldGroup, question); // otherwise, there is an error
      }
    }
  };

  const handleCheckChange: (event: any) => void = (event: any) => {
    const currentVal: any = event?.target?.checked;
    if (question) {
      updateFormFieldStates(currentVal, formFieldGroup, question);
    }
  };

  const handleDateChange: (newValue: {}) => void = (newValue: {}) => {
    if (question) {
      updateFormFieldStates(newValue, formFieldGroup, question);
    }
  };

  const autocompleteExtras: {} = question?.autocompleteExtras || {};

  const handleDeleteClick: () => void = () => {
    // @TODO maybe experiment with putting this in some kind of utility file now that other complexities have been resolved... look for async issues when deleting middle options from autocomplete in VideoIntakeQuestions for instance if you try this
    const currentActualValues = get(formFieldGroup, ["actualValues"]);
    const filteredAcutalValues = reduce(
      currentActualValues,
      (memo, currentActualValue, currentKey) => {
        if (question?.label !== currentKey) {
          return { ...memo, [currentKey]: currentActualValue };
        } else {
          return { ...memo };
        }
      },
      {}
    );

    // Now, we have to rename some of the labels, because, say, if Option 2 got removed, the old Option 3 should become the new Option 2.
    const autoCompleteVals: string[] = filter(
      filteredAcutalValues || {},
      (_optionFormFieldGroupValue, optionFormFieldGroupKey) => {
        return optionFormFieldGroupKey.startsWith(stringForAutocompleteOptions);
      }
    );

    if (setAutocompleteValues) {
      updateOptionFormFieldGroupWithOptionList(
        autoCompleteVals,
        setAutocompleteValues,
        stringForAutocompleteOptions
      );
    }
  };

  const leavingFeedbackLink = (
    <Link href="/me">
      <FormattedMessage
        id="LEAVING_FEEDBACK"
        defaultMessage="leaving feedback"
      />
    </Link>
  );

  switch (question?.type) {
    case "URL":
      return (
        <TextField
          required={question?.isRequired}
          fullWidth
          data-testid={question?.testId}
          error={currentIsInvalid}
          variant="filled"
          label={question?.label}
          helperText={
            currentIsInvalid
              ? intl.formatMessage({
                  id: question?.invalidInputMessage || "FIELD_CANNOT_BE_BLANK",
                  defaultMessage: "Cannot be blank",
                })
              : ""
          }
          style={{ marginBottom: 10, maxWidth: 400 }}
          onChange={handleTextChange}
          value={localVal}
        ></TextField>
      );
    case "Email":
      return (
        <TextField
          required={question?.isRequired}
          fullWidth
          data-testid={question?.testId}
          error={currentIsInvalid}
          variant="filled"
          label={question?.label}
          helperText={
            currentIsInvalid
              ? intl.formatMessage({
                  id: question?.invalidInputMessage || "FIELD_CANNOT_BE_BLANK",
                  defaultMessage: "Cannot be blank",
                })
              : ""
          }
          style={{ marginBottom: 10, maxWidth: 400 }}
          onChange={handleTextChange}
          value={localVal}
        ></TextField>
      );
    case "Text":
      return (
        <span style={{ display: "inline-flex" }}>
          <TextField
            required={question?.isRequired}
            fullWidth
            data-testid={question?.testId}
            error={currentIsInvalid}
            variant="filled"
            label={question?.label}
            helperText={
              currentIsInvalid
                ? intl.formatMessage({
                    id:
                      question?.invalidInputMessage || "FIELD_CANNOT_BE_BLANK",
                    defaultMessage: "Cannot be blank",
                  })
                : ""
            }
            style={{ marginBottom: 10, maxWidth: 400 }}
            onChange={handleTextChange}
            value={get(formFieldGroup, ["actualValues", question?.label], "")}
          ></TextField>
          {areAutocompleteOptionsDeletable && formFieldGroup && (
            <Tooltip
              title={intl.formatMessage({
                id: "DELETE",
                defaultMessage: "Delete",
              })}
            >
              <span style={{ marginTop: 14, marginLeft: 3 }}>
                <DeleteIcon onClick={handleDeleteClick} />
              </span>
            </Tooltip>
          )}
        </span>
      );
    case "Checkbox":
      return (
        <div
          style={{ display: "flex", alignItems: "center", marginBottom: 10 }}
        >
          <FormControlLabel
            style={{ marginRight: 10 }}
            control={<Checkbox />}
            value={get(formFieldGroup, ["actualValues", question.label])}
            onChange={handleCheckChange}
            label={question?.label}
          />
        </div>
      );
    case "Date":
      return (
        <div style={{ marginBottom: 10, maxWidth: 400 }}>
          <DatePicker
            data-testid={question?.testId}
            label={question?.label}
            onChange={(newValue) => {
              handleDateChange(newValue);
            }}
            value={get(formFieldGroup, ["actualValues", question?.label])}
          ></DatePicker>
        </div>
      );
    case "Autocomplete":
      return (
        <Autocomplete
          renderInput={function (
            params: AutocompleteRenderInputParams
          ): ReactNode {
            return (
              <TextField
                {...params}
                required={question?.isRequired}
                label={question?.label}
                error={currentIsInvalid}
                helperText={
                  currentIsInvalid
                    ? intl.formatMessage({
                        id:
                          question?.invalidInputMessage ||
                          "FIELD_CANNOT_BE_BLANK",
                        defaultMessage: "Cannot be blank",
                      })
                    : ""
                }
              />
            );
          }}
          options={question?.autocompleteOptions || []}
          data-testid={question?.testId}
          style={{ marginBottom: 10, maxWidth: 400 }}
          value={get(formFieldGroup, ["actualValues", question?.label], "")}
          onChange={handleAutocompleteChange}
          freeSolo={question?.usersCanAddCustomOptions}
          {...autocompleteExtras}
          inputValue={get(
            formFieldGroup,
            ["actualValues", question?.label],
            ""
          )}
          onInputChange={handleAutocompleteChange}
        ></Autocomplete>
      );

    case "Number":
      return (
        <TextField
          required={question?.isRequired}
          fullWidth
          type="number"
          data-testid={question?.testId}
          error={currentIsInvalid}
          variant="filled"
          label={question?.label}
          helperText={
            currentIsInvalid
              ? intl.formatMessage({
                  id: question?.invalidInputMessage || "FIELD_CANNOT_BE_BLANK",
                  defaultMessage: "Cannot be blank",
                })
              : ""
          }
          style={{ marginBottom: 10, maxWidth: 400 }}
          onChange={handleTextChange}
          value={get(formFieldGroup, ["actualValues", question?.label], "")}
        ></TextField>
      );
    default:
      return (
        <Typography>
          <FormattedMessage
            id="SOMETHING_WENT_WRONG_CONTACT_DEVELOPER"
            defaultMessage="Something went wrong. Alert a developer by leaving feedback"
            values={{ leavingFeedback: leavingFeedbackLink }}
          />
        </Typography>
      );
  }
};

export default SingleFormField;
