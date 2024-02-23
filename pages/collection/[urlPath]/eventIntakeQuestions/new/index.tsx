import { useRouter } from "next/router";
import EventIntakeQuestions from "../../../../../components/EventIntakeQuestions";
import { Backdrop, CircularProgress } from "@mui/material";

const NewEventIntakeQuestions: React.FC = () => {
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
        <EventIntakeQuestions collectionUrl={collectionUrl} mode="create" />
      )}
    </>
  );
};

export default NewEventIntakeQuestions;
