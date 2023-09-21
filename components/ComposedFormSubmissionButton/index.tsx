import { Button } from "@mui/material";
import { useEffect, useState } from "react";
import { FormattedMessage } from "react-intl";
import { FormFieldGroup, SingleFormField, Collection } from "../../types";
import CustomError from "../Error";
import { map, filter, reduce } from "lodash-es";
import { calculateAllRequiredsHaveValues } from "../../utilities/composedFormSubmissionButtonUtils";

const ComposedFormSubmissionButton: React.FC<{
  questionsOfConcern: SingleFormField[];
  formFieldGroupOfConcern: FormFieldGroup;
  collection: Collection;
}> = ({ questionsOfConcern, formFieldGroupOfConcern, collection }) => {
  const [allRequiredValid, setAllRequiredValid] = useState<boolean>(true);

  useEffect(() => {
    const totalInvalidCount: number = reduce(
      Object.values(formFieldGroupOfConcern?.isInvalids || []),
      (memo: any, entry: any) => {
        return Number(entry) + Number(memo);
      },
      0
    );

    setAllRequiredValid(
      totalInvalidCount < 1 &&
        calculateAllRequiredsHaveValues(
          questionsOfConcern,
          formFieldGroupOfConcern
        )
    );
  }, [questionsOfConcern, formFieldGroupOfConcern, allRequiredValid]);

  const handleFormSubmission: () => void = () => {
    console.log("deleteMe handleFormSubmission entered");
    console.log("deleteMe formFieldGroupOfConcern?.actualValues is: ");
    console.log(formFieldGroupOfConcern?.actualValues);
    // @TODO send this to the database. Use the `collection` variable
  };

  const error: string = "";

  return (
    <>
      <Button
        style={{ marginBottom: 10 }}
        data-testid={"submit-button"}
        variant="contained"
        disabled={!allRequiredValid}
        onClick={handleFormSubmission}
      >
        <FormattedMessage id="SUBMIT" defaultMessage="Submit" />
      </Button>
      {error && <CustomError errorMsg={error} />}
    </>
  );
};

export default ComposedFormSubmissionButton;
