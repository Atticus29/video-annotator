import { useRouter } from "next/router";
import { Backdrop, CircularProgress } from "@mui/material";
import GenericIntakeQuestions from "../../../../../components/GenericIntakeQuestions";
import useUpdateCollectionEventIntakeQuestions from "../../../../../hooks/useUpdateCollectionEventIntakeQuestions";
import usePostCollectionEventIntakeQuestions from "../../../../../hooks/usePostCollectionEventIntakeQuestions";

const NewEventIntakeQuestions: React.FC = () => {
  console.log("deleteMe NewEventIntakeQuestions renders");
  const router = useRouter();
  const collectionUrlBlob: string | string[] | undefined =
    router?.query?.urlPath;
  const collectionUrl: string =
    (Array.isArray(collectionUrlBlob)
      ? collectionUrlBlob.join()
      : collectionUrlBlob) || "";
  return (
    <>
      <Backdrop
        sx={{ color: "#fff", zIndex: (theme) => theme.zIndex.drawer + 1 }}
        open={!collectionUrl}
      >
        <CircularProgress color="inherit" />
      </Backdrop>
      {Boolean(collectionUrl) && (
        <GenericIntakeQuestions
          collectionUrl={collectionUrl}
          mode="create"
          intakeQuestionType="event"
          postHook={usePostCollectionEventIntakeQuestions}
          updateHook={useUpdateCollectionEventIntakeQuestions}
        />
      )}
    </>
  );
};

export default NewEventIntakeQuestions;
