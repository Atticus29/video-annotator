import { Alert } from "@mui/material";
import { get } from "lodash-es";
import Link from "next/link";
import { FormattedMessage } from "react-intl";
import { Collection } from "../../types";

const CollectionAlertsInfo: React.FC<{ collectionData: Collection }> = ({
  collectionData,
}) => {
  return (
    <Alert severity="info" style={{ marginBottom: "4vh" }}>
      <FormattedMessage
        id="EDIT_COLLECTION_INTAKE_QUESTIONS"
        defaultMessage="You have edit access to this collection. Edit your individual intake questions, video intake questions, and event intake questions here:"
        values={{
          individualIntakeQuestions: get(
            collectionData,
            "individualIntakeQuestions"
          ) ? (
            <Link
              href={
                "/collection/" +
                collectionData?.metadata?.urlPath +
                "/individualIntakeQuestions/update"
              }
            >
              Individual Intake Questions
            </Link>
          ) : (
            ""
          ),
          videoIntakeQuestions: get(collectionData, "videoIntakeQuestions") ? (
            <Link
              href={
                "/collection/" +
                collectionData?.metadata?.urlPath +
                "/videoIntakeQuestions/update"
              }
            >
              Video Intake Questions
            </Link>
          ) : (
            ""
          ),
          eventIntakeQuestions: get(collectionData, "eventIntakeQuestions") ? (
            <Link
              href={
                "/collection/" +
                collectionData?.metadata?.urlPath +
                "/eventIntakeQuestions/update"
              }
            >
              Event Intake Questions
            </Link>
          ) : (
            ""
          ),
        }}
      />
    </Alert>
  );
};

export default CollectionAlertsInfo;
