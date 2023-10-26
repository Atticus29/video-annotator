import { useEffect } from "react";
import { IntlShape, useIntl } from "react-intl";

const UnsavedChangesPrompt: React.FC = () => {
  const intl: IntlShape = useIntl();
  useEffect(() => {
    const handleBeforeUnload = (e: BeforeUnloadEvent) => {
      e.preventDefault();
      e.returnValue = intl.formatMessage({
        id: "UNSAVED_CHANGES_MESSAGE",
        defaultMessage:
          "You have unsaved changes on this page. Are you sure you want to proceed without saving?",
      });
    };
    window.onbeforeunload = handleBeforeUnload;
    return () => {
      window.onbeforeunload = null;
    };
  }, [intl]);
  return null;
};

export default UnsavedChangesPrompt;
