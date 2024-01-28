import { useRouter } from "next/router";
import IndividualIntakeQuestions from "../../../../../components/IndividualIntakeQuestions";

const UpdateIndividualIntakeQuestions: React.FC = () => {
  const router = useRouter();
  const collectionUrlBlob: string | string[] | undefined =
    router?.query?.urlPath;
  const collectionUrl: string =
    (Array.isArray(collectionUrlBlob)
      ? collectionUrlBlob.join()
      : collectionUrlBlob) || "";
  return <IndividualIntakeQuestions collectionUrl={collectionUrl} />;
};

export default UpdateIndividualIntakeQuestions;
