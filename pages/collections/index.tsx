import { Backdrop, CircularProgress } from "@mui/material";
import axios from "axios";
import { useEffect, useState } from "react";
import { useQuery } from "react-query";
import DataTable from "../../components/DataTable";
import CustomError from "../../components/Error";

const Collections: React.FC = () => {
  const [localError, setLocalError] = useState<string>("");
  const { isLoading, isError, data, error } = useQuery("", async () => {
    try {
      const response = await axios.get("/api/collections", {});
      console.log("deleteMe response is: ");
      console.log(response);
      return response?.data;
    } catch (e: any) {
      console.log("deleteMe error is: ");
      console.log(e);
      setLocalError(e?.message);
    }
  });
  const [open, setOpen] = useState<boolean>(isLoading);

  useEffect(() => {
    setOpen(isLoading);
  }, [isLoading]);

  useEffect(() => {
    console.log("deleteMe error is: ");
    console.log(error);
  }, [error]);

  useEffect(() => {
    console.log("deleteMe isError is: ");
    console.log(isError);
  }, [isError]);

  const handleClose = () => {
    setOpen(false);
  };

  console.log("deleteMe data is: ");
  console.log(data);
  const shouldShowTable: boolean = !isError && !isLoading && Boolean(data);
  return (
    <>
      {shouldShowTable && (
        <DataTable
          tableTitle="Testing"
          data={data}
          colNamesToDisplay={{ name: "Collection name" }}
        ></DataTable>
      )}
      {localError && <CustomError errorMsg={localError} />}
      <Backdrop
        sx={{ color: "#fff", zIndex: (theme) => theme.zIndex.drawer + 1 }}
        open={open}
        // onClick={handleClose}
      >
        <CircularProgress color="inherit" />
      </Backdrop>
    </>
  );
};

export default Collections;
