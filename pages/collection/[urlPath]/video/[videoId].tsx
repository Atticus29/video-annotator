import {
  Backdrop,
  Button,
  CircularProgress,
  Dialog,
  DialogContent,
} from "@mui/material";
import axios from "axios";
import { get, map, reduce } from "lodash-es";
import { NextRouter, useRouter } from "next/router";
import { useEffect, useMemo, useState } from "react";
import { FormattedMessage, IntlShape, useIntl } from "react-intl";
import { QueryFunctionContext, useQuery, useQueryClient } from "react-query";
import CustomError from "../../../../components/Error";
import useGetVideo from "../../../../hooks/useGetVideo";

const SingleVideoView: React.FC = () => {
  const queryClient = useQueryClient();
  const router: NextRouter = useRouter();
  const intl: IntlShape = useIntl();
  const localVideoId: string = router.query.videoId;
  console.log("deleteMe localVideoId is: ");
  console.log(localVideoId);
  const localUrlPath: string | string[] | undefined = router.query.urlPath;
  let localUrlPathAsString: string =
    (Array.isArray(localUrlPath) ? localUrlPath.join() : localUrlPath) || "";
  console.log("deleteMe localUrlPathAsString is: ");
  console.log(localUrlPathAsString);
  //   const [calculatedHeight, setCalculatedHeight] = useState<number>(9.4);
  const [showVideo, setShowVideo] = useState<boolean>(false);
  const { isLoading, isError, data, error } = useGetVideo(
    localUrlPathAsString,
    localVideoId
  );
  const [open, setOpen] = useState<boolean>(true);

  useEffect(() => {
    if (!isLoading) {
      setOpen(false);
    }
    if (!isLoading && data) {
      setShowVideo(true);
    }
  }, [isLoading, data]);
  console.log("deleteMe data is: ");
  console.log(data);

  return (
    <>
      {isLoading && (
        <Backdrop
          sx={{ color: "#fff", zIndex: (theme) => theme.zIndex.drawer + 1 }}
          open={open}
        >
          <CircularProgress color="inherit" />
        </Backdrop>
      )}
      {showVideo && <p>Got here hi TODO fill me in</p>}
      {!isLoading && !showVideo && (
        <CustomError
          errorMsg={intl.formatMessage({
            id: "VIDEO_NOT_FOUND",
            defaultMessage: "Video not found",
          })}
        />
      )}
    </>
  );
};

export default SingleVideoView;
