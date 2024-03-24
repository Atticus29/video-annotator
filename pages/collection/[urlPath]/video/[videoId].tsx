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
import CustomError from "../../../../components/CustomError";
import useGetVideo from "../../../../hooks/useGetVideo";

const SingleVideoView: React.FC = () => {
  const router: NextRouter = useRouter();
  const intl: IntlShape = useIntl();
  const localVideoId: string | string[] = router.query.videoId || "";
  let localVideoIdAsString: string =
    (Array.isArray(localVideoId) ? localVideoId.join() : localVideoId) || "";
  const localUrlPath: string | string[] | undefined = router.query.urlPath;
  let localUrlPathAsString: string =
    (Array.isArray(localUrlPath) ? localUrlPath.join() : localUrlPath) || "";
  const [showVideo, setShowVideo] = useState<boolean>(false);
  const { isLoading, isError, data, error } = useGetVideo(
    localUrlPathAsString,
    localVideoIdAsString
  );
  console.log("deleteMe data is: ");
  console.log(data);
  const [open, setOpen] = useState<boolean>(true);

  useEffect(() => {
    if (!isLoading) {
      setOpen(false);
    }
    if (!isLoading && data) {
      setShowVideo(true);
    }
  }, [isLoading, data]);

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
      {!isLoading && !showVideo && isError && (
        <CustomError
          errorMsg={
            intl.formatMessage({
              id: "VIDEO_NOT_FOUND",
              defaultMessage: "Video not found",
            }) +
            ": " +
            error
          }
        />
      )}
    </>
  );
};

export default SingleVideoView;
