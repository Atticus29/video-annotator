import { useEffect, useMemo, useState } from "react";

import { Button, Grid } from "@mui/material";
import { filter, get, map, reduce } from "lodash-es";

import {
  Collection,
  FormFieldGroup,
  SingleFormField as SingleFormFieldType,
} from "../../types";
import InfoPanel from "../InfoPanel";
import InfoPanelBody from "../InfoPanel/InfoPanelBody";
import SingleFormField from "../SingleFormField";
import useFirebaseAuth from "../../hooks/useFirebaseAuth";
import { FormattedMessage, IntlShape, useIntl } from "react-intl";
import SaveOrUpdateButtonWithValidation from "../SaveOrUpdateButtonWithValidation";
import usePostEvent from "../../hooks/usePostEvent";
import { useQueryClient } from "@tanstack/react-query";

const EventIntake: React.FC<{
  collection: Collection;
  videoId: string;
  onCloseDialog?: () => void;
}> = ({ collection, videoId, onCloseDialog }) => {
  const intl: IntlShape = useIntl();
  const defaultEventName: string = intl.formatMessage({
    id: "EVENT",
  });
  const { user, authError } = useFirebaseAuth();

  const requiredQuestions: any[] =
    filter(
      get(collection, ["eventIntakeQuestions"], []),
      (question: SingleFormFieldType) => question.isRequired
    ) || [];

  const requiredInvalidVals: {} = reduce(
    requiredQuestions,
    (memo, question) => {
      return { ...memo, [question.label]: true };
    },
    {}
  );

  const [localCollection, setLocalCollection] = useState<Collection>();
  const [eventQuestionFormValues, setEventQuestionFormValues] = useState<{}>(
    {}
  );
  const [
    areEventQuestionFormValuesInvalid,
    setAreEventQuestionFormValuesInvalid,
  ] = useState<{}>(requiredInvalidVals);
  const [eventCreated, setEventCreated] = useState<boolean>(false);
  const queryClient = useQueryClient();

  useEffect(() => {
    if (eventCreated) {
      queryClient.invalidateQueries({
        queryKey: ["eventsFor", collection?.metadata?.urlPath],
      });
      if (onCloseDialog) onCloseDialog();
    }
  }, [collection?.metadata?.urlPath, eventCreated, onCloseDialog, queryClient]);

  const eventQuestionsFormFieldGroup: FormFieldGroup = useMemo(() => {
    return {
      title: "VideoFormFieldGroupForTheLocalCollection",
      setValues: setEventQuestionFormValues,
      actualValues: eventQuestionFormValues,
      isInvalids: areEventQuestionFormValuesInvalid,
      setIsInvalids: setAreEventQuestionFormValuesInvalid,
    };
  }, [areEventQuestionFormValuesInvalid, eventQuestionFormValues]);

  useEffect(() => {
    const initialCollection = { ...collection };
    initialCollection.eventQuestionsFormFieldGroup =
      eventQuestionsFormFieldGroup;
    setLocalCollection(initialCollection);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [user]);

  const titleId: string = intl.formatMessage(
    {
      id: "SUBMIT_NEW_EVENT",
      defaultMessage: "Creeate a New {eventName}",
    },
    {
      eventName: collection.metadata.nameOfEvent || defaultEventName,
    }
  );

  const bodyId: string = intl.formatMessage(
    {
      id: "EVENT_INTAKE_DETAILS",
      defaultMessage:
        "To add a {eventName} to the {videoName}, fill out the form below.",
    },
    {
      eventName: collection.metadata.nameOfEvent?.toLowerCase(),
      videoName: collection.metadata.nameOfVideo?.toLowerCase(),
    }
  );

  return (
    <InfoPanel
      titleId={titleId}
      titleDefault={titleId}
      textOverrides={{ textAlign: "center" }}
      styleOverrides={{ maxHeight: 1000 }}
    >
      <InfoPanelBody bodyId={bodyId} bodyDefault={bodyId} />
      <Grid container>
        {map(
          localCollection?.eventIntakeQuestions,
          (intakeQuestion, intakeQuestionIdx) => {
            if (intakeQuestion) {
              return (
                <Grid item lg={12} sm={12} key={intakeQuestionIdx}>
                  <SingleFormField
                    question={intakeQuestion}
                    formFieldGroup={eventQuestionsFormFieldGroup}
                    key={intakeQuestionIdx}
                  />
                </Grid>
              );
            }
          }
        )}
        {localCollection?.eventQuestionsFormFieldGroup &&
          localCollection?.eventIntakeQuestions && (
            <>
              <Grid item lg={12} sm={12}>
                <SaveOrUpdateButtonWithValidation
                  disabled={!Boolean(collection)}
                  buttonTitle="CREATE"
                  successMsg={intl.formatMessage({
                    id: "EVENT_SUCCESSFULLY_CREATED",
                    defaultMessage: "Event successfully created",
                  })}
                  failMsg={intl.formatMessage({
                    id: "EVENT_CREATION_FAILED",
                    defaultMessage: "Event creation failed",
                  })}
                  usePostOrUseUpdate={usePostEvent}
                  mutationData={{
                    collectionUrl: collection?.metadata?.urlPath,
                    videoId: videoId,
                    eventData: eventQuestionsFormFieldGroup?.actualValues || [],
                  }}
                  actualValues={eventQuestionsFormFieldGroup.actualValues}
                  invalidValues={eventQuestionsFormFieldGroup.isInvalids}
                  setParentStateOnSuccess={setEventCreated}
                  queryKeysToInvalidate={[
                    ["singleCollection", collection?.metadata?.urlPath || ""],
                  ]}
                />
              </Grid>
              <Grid item lg={12} sm={12}>
                <Button variant="contained" onClick={onCloseDialog}>
                  <FormattedMessage id="CLOSE" defaultMessage="Close" />
                </Button>
              </Grid>
            </>
          )}
      </Grid>
    </InfoPanel>
  );
};
export default EventIntake;
