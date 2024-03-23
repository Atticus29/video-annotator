import { Alert } from "@mui/material";
import Link from "next/link";
import { FormattedMessage } from "react-intl";
import { Collection } from "../../types";
import { get } from "lodash-es";

const CollectionAlertsWarning: React.FC<{ collectionData: Collection }> = ({
  collectionData,
}) => {
  return (
    <Alert severity="warning" style={{ marginBottom: "4vh" }}>
      <FormattedMessage
        id="YOUR_COLLECTION_IS_INCOMPLETE"
        defaultMessage="Your collection isn't ready for primetime yet. You must create individual intake questions, video intake questions, and event intake questions in order for users of your collection to be able to create and annotate videos in your collection first."
        values={{
          individualIntakeQuestions: get(
            collectionData,
            "individualIntakeQuestions"
          ) ? (
            ""
          ) : (
            <Link
              href={
                "/collection/" +
                collectionData?.metadata?.urlPath +
                "/individualIntakeQuestions/new"
              }
            >
              Individual Intake Questions
            </Link>
          ),
          videoIntakeQuestions: get(collectionData, "videoIntakeQuestions") ? (
            ""
          ) : (
            <Link
              href={
                "/collection/" +
                collectionData?.metadata?.urlPath +
                "/videoIntakeQuestions/new"
              }
            >
              Video Intake Questions
            </Link>
          ),
          eventIntakeQuestions: get(collectionData, "eventIntakeQuestions") ? (
            ""
          ) : (
            <Link
              href={
                "/collection/" +
                collectionData?.metadata?.urlPath +
                "/eventIntakeQuestions/new"
              }
            >
              Event Intake Questions
            </Link>
          ),
        }}
      />
    </Alert>
  );
};

export default CollectionAlertsWarning;
