import { Button } from "@mui/material";
import { useEffect, useState } from "react";
import { FormattedMessage } from "react-intl";
import { FormFieldGroup, SingleFormField, Collection } from "../../types";
import CustomError from "../Error";
import { map, filter, reduce, get } from "lodash-es";
import { calculateAllRequiredsHaveValues } from "../../utilities/composedFormSubmissionButtonUtils";

const ComposedFormSubmissionButton: React.FC<{
  questionsOfConcern: SingleFormField[];
  formFieldGroupOfConcern: FormFieldGroup | undefined;
  collection: Collection;
  collectionPropToUpdate?: string;
}> = ({
  questionsOfConcern,
  formFieldGroupOfConcern,
  collection,
  collectionPropToUpdate,
}) => {
  // console.log(
  //   "deleteMe questionsOfConcern in ComposedFormSubmissionButton are: "
  // );
  // console.log(questionsOfConcern);
  // console.log("deleteMe formFieldGroupOfConcern in the same are: ");
  // console.log(formFieldGroupOfConcern);
  // console.log("deleteMe collection in the same is: ");
  // console.log(collection);
  const [allRequiredValid, setAllRequiredValid] = useState<boolean>(true);

  useEffect(() => {
    if (formFieldGroupOfConcern) {
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
    }
  }, [questionsOfConcern, formFieldGroupOfConcern, allRequiredValid]);

  const handleFormSubmission: () => void = () => {
    console.log("deleteMe handleFormSubmission entered");
    console.log("deleteMe formFieldGroupOfConcern?.actualValues is: ");
    console.log(formFieldGroupOfConcern?.actualValues);
    console.log("deleteMe entire formFieldGroupOfConcern is: ");
    console.log(formFieldGroupOfConcern);
    console.log("deleteMe and collection is: ");
    console.log(collection);
    if (collectionPropToUpdate === "videos") {
      const currentVideos: {}[] = get(collection, ["videos"], []);
      const updatedVideos: {}[] = [
        ...currentVideos,
        formFieldGroupOfConcern?.actualValues,
      ];
      const updatedCollection = { ...collection, videos: updatedVideos };
      // @TODO call the collection update api LEFT OFF HERE
    }
    // @TODO send this to the database. Use the `collection` variable... actually, depending on which intake this is, the db save MIGHT behave differently. I.e., is this a video save? An individual?
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
