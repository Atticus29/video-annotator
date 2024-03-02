import { useRouter } from "next/router";
import usePostCollectionVideoIntakeQuestions from "../../../../../hooks/usePostCollectionVideoIntakeQuestions";
import GenericIntakeQuestions from "../../../../../components/GenericIntakeQuestions";
import useUpdateCollectionVideoIntakeQuestions from "../../../../../hooks/useUpdateCollectionVideoIntakeQuestions";
import { Backdrop, CircularProgress } from "@mui/material";

const NewVideoIntakeQuestions: React.FC = () => {
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
          postHook={usePostCollectionVideoIntakeQuestions}
          updateHook={useUpdateCollectionVideoIntakeQuestions}
          intakeQuestionType="video"
          mode="create"
        />
      )}
    </>
  );
};

export default NewVideoIntakeQuestions;
