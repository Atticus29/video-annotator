import { useRouter } from "next/router";
import IndividualIntakeQuestions from "../../../../../components/IndividualIntakeQuestions";
import { Backdrop, CircularProgress } from "@mui/material";

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
        <IndividualIntakeQuestions
          collectionUrl={collectionUrl}
          mode="create"
        />
      )}
    </>
  );
};

export default NewIndividualIntakeQuestions;
