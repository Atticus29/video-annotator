import { useMemo } from "react";
import VideoIntakeQuestions from "../../../../../components/VideoIntakeQuestions";
import useGetCollection from "../../../../../hooks/useGetCollection";
import { FormFieldGroup } from "../../../../../types";
import { useRouter } from "next/router";

const UpdateVideoIntakeQuestions: React.FC = () => {
  const router = useRouter();
  const collectionUrlBlob: string | string[] | undefined =
    router?.query?.urlPath;
  const collectionUrl: string =
    (Array.isArray(collectionUrlBlob)
      ? collectionUrlBlob.join()
      : collectionUrlBlob) || "";
  return (
    <VideoIntakeQuestions collectionUrl={collectionUrl}></VideoIntakeQuestions>
  );
};

export default UpdateVideoIntakeQuestions;
