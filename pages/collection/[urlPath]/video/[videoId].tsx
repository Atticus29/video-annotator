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
import YouTubePlayer from "../../../../components/YouTubePlayer";
import EventTableView from "../../../../components/EventTableView";
import FloatingStickyButton from "../../../../components/FloatingStickyButton";

const SingleVideoView: React.FC = () => {
  const router: NextRouter = useRouter();
  const intl: IntlShape = useIntl();
  const { urlPath, videoId } = router.query;
  const [showVideo, setShowVideo] = useState<boolean>(false);
  const { isLoading, isError, data, error } = useGetVideo(
    typeof urlPath === "string" ? urlPath : "",
    typeof videoId === "string" ? videoId : ""
  );
  const [open, setOpen] = useState<boolean>(true);
  const [backButtonLoading, setBackButtonLoading] = useState<boolean>(false);

  const handleNavigateClick: () => void = () => {
    setBackButtonLoading(true);
    router.push("/collection/" + (typeof urlPath === "string" ? urlPath : ""));
  };

  useEffect(() => {
    if (!isLoading) {
      setOpen(false);
    }
    if (!isLoading && data) {
      setShowVideo(true);
    }
  }, [isLoading, data]);

  const urlTargetKey: string = useMemo(() => {
    if (data) {
      return (
        Object.keys(data).find(
          (key) => key.endsWith("url") || key.endsWith("URL")
        ) || ""
      );
    } else {
      return "";
    }
  }, [data]);

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
      {showVideo && (
        <>
          <FloatingStickyButton
            handleNavigateClick={handleNavigateClick}
            buttonLoading={backButtonLoading}
          />
          <div
            style={{
              marginTop: "2rem",
              display: "flex",
              justifyContent: "center",
            }}
          >
            <YouTubePlayer
              collectionUrl={typeof urlPath === "string" ? urlPath : ""}
              videoUrl={data[urlTargetKey]}
              videoData={data}
            />
            <EventTableView
              videoData={data}
              collectionUrl={typeof urlPath === "string" ? urlPath : ""}
              styleOverrides={{ maxWidth: 500 }}
            />
          </div>
        </>
      )}
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
