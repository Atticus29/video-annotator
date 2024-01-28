import { useRouter } from "next/router";
import IndividualIntake from "../../../../../components/IndividualIntake";
import IndividualIntakeQuestions from "../../../../../components/IndividualIntakeQuestions";

const NewIndividualIntakeQuestions: React.FC = () => {
  const router = useRouter();
  const collectionUrlBlob: string | string[] | undefined =
    router?.query?.urlPath;
  const collectionUrl: string =
    (Array.isArray(collectionUrlBlob)
      ? collectionUrlBlob.join()
      : collectionUrlBlob) || "";
  return (
    <IndividualIntakeQuestions collectionUrl={collectionUrl} mode="create" />
  );
};

export default NewIndividualIntakeQuestions;
