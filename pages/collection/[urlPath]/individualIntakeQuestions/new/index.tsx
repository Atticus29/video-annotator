import { useRouter } from "next/router";
import { Backdrop, CircularProgress } from "@mui/material";
import GenericIntakeQuestions from "../../../../../components/GenericIntakeQuestions";
import usePostCollectionIndividualIntakeQuestions from "../../../../../hooks/usePostCollectionIndividualIntakeQuestions";
import useUpdateCollectionIndividualIntakeQuestions from "../../../../../hooks/useUpdateCollectionIndividualIntakeQuestions";

const NewIndividualIntakeQuestions: React.FC = () => {
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
          postHook={usePostCollectionIndividualIntakeQuestions}
          updateHook={useUpdateCollectionIndividualIntakeQuestions}
          intakeQuestionType={""}
        />
      )}
    </>
  );
};

export default NewIndividualIntakeQuestions;
