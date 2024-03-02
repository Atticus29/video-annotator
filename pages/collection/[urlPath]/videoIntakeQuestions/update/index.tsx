import GenericIntakeQuestions from "../../../../../components/GenericIntakeQuestions";
import { useRouter } from "next/router";
import usePostCollectionVideoIntakeQuestions from "../../../../../hooks/usePostCollectionVideoIntakeQuestions";
import useUpdateCollectionVideoIntakeQuestions from "../../../../../hooks/useUpdateCollectionVideoIntakeQuestions";

const UpdateVideoIntakeQuestions: React.FC = () => {
  const router = useRouter();
  const collectionUrlBlob: string | string[] | undefined =
    router?.query?.urlPath;
  const collectionUrl: string =
    (Array.isArray(collectionUrlBlob)
      ? collectionUrlBlob.join()
      : collectionUrlBlob) || "";
  return (
    <GenericIntakeQuestions
      collectionUrl={collectionUrl}
      postHook={usePostCollectionVideoIntakeQuestions}
      updateHook={useUpdateCollectionVideoIntakeQuestions}
      intakeQuestionType="video"
    />
  );
};

export default UpdateVideoIntakeQuestions;
