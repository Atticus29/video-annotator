import { useRouter } from "next/router";
import GenericIntakeQuestions from "../../../../../components/GenericIntakeQuestions";
import usePostCollectionIndividualIntakeQuestions from "../../../../../hooks/usePostCollectionIndividualIntakeQuestions";
import useUpdateCollectionIndividualIntakeQuestions from "../../../../../hooks/useUpdateCollectionIndividualIntakeQuestions";

const UpdateIndividualIntakeQuestions: React.FC = () => {
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
      postHook={usePostCollectionIndividualIntakeQuestions}
      updateHook={useUpdateCollectionIndividualIntakeQuestions}
      intakeQuestionType="individual"
    />
  );
};

export default UpdateIndividualIntakeQuestions;
