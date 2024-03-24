import {
  Backdrop,
  Button,
  CircularProgress,
  Dialog,
  DialogContent,
} from "@mui/material";
import { dataTagSymbol } from "@tanstack/react-query";
import React, { useState } from "react";
import YouTube from "react-youtube";
import useGetCollection from "../../hooks/useGetCollection";
import CustomError from "../CustomError";
import EventIntake from "../EventIntake";

const YouTubePlayer: React.FC<{
  videoUrl?: string;
  videoId?: string;
  videoData: any;
  collectionUrl: string;
}> = ({ videoUrl, videoId, videoData, collectionUrl }) => {
  const {
    data: collection,
    isLoading: isCollectionLoading, //@TODO implement
    isError: isCollectionError,
    errorMsg: collectionErrorMsg,
  } = useGetCollection(collectionUrl);

  const [showAnnotationDialog, setShowAnnotationDialog] =
    useState<boolean>(false);

  const openAnnotationDialog: () => void = () => {
    setShowAnnotationDialog(true);
  };

  const handleCreateAnnotationDialogClose: () => void = () => {
    setShowAnnotationDialog(false);
  };

  const [player, setPlayer] = useState<any>(null);

  const onReady = (event: any) => {
    console.log("deleteMe onReady called");
    // Access to player in all event handlers via event.target
    setPlayer(event.target);
  };

  const onPlayVideo = () => {
    player.playVideo();
  };

  const onPauseVideo = () => {
    player.pauseVideo();
  };

  // const onSeekTo = (seconds: number) => {
  //   player.seekTo(seconds);
  // };

  const extractId: (url: string) => string = (url: string) => {
    console.log("deleteMe extractId entered");
    const match = url.match(
      /(?:youtu\.be\/|youtube\.com\/(?:embed\/|v\/|watch\?v=|.*[?&]v=))([^&?\s]+)/
    );

    if (match && match[1]) {
      console.log("deleteMe returning: ");
      console.log(match[1]);
      return match[1];
    } else {
      // Return empty string or throw an error, depending on your use case
      return "";
    }
  };

  const rewindVideo: (duration: number) => void = (duration: number) => {
    const currentTime = player.getCurrentTime();
    player.seekTo(Math.max(0.5, currentTime - duration));
  };

  const fastForwardVideo: (duration: number) => void = (duration: number) => {
    const currentTime = player.getCurrentTime();
    player.seekTo(Math.max(0.5, currentTime + duration));
  };

  return (
    <>
      <Backdrop
        sx={{ color: "#fff", zIndex: (theme) => theme.zIndex.drawer + 1 }}
        open={isCollectionLoading || !player}
      >
        <CircularProgress color="inherit" />
      </Backdrop>
      {!isCollectionLoading && !isCollectionError && (
        <div>
          <YouTube
            videoId={videoId || extractId(videoUrl || "")}
            onReady={onReady}
          />
          <section style={{ marginTop: "1rem" }} id="button-panel">
            <Button
              style={{ marginRight: "1rem" }}
              variant="contained"
              onClick={onPlayVideo}
            >
              Play
            </Button>
            <Button
              style={{ marginRight: "1rem" }}
              variant="contained"
              onClick={() => rewindVideo(3)}
            >
              Rewind 3 Seconds
            </Button>
            <Button
              style={{ marginRight: "1rem" }}
              variant="contained"
              onClick={() => fastForwardVideo(3)}
            >
              Fastforward 3 Seconds
            </Button>
            <Button variant="contained" onClick={onPauseVideo}>
              Pause
            </Button>
          </section>
          <section id="annotation-panel" style={{ marginTop: "1rem" }}>
            <Button
              style={{ marginRight: "1rem" }}
              variant="contained"
              onClick={openAnnotationDialog}
            >
              Begin {collection?.metadata?.nameOfEvent}
            </Button>
          </section>
        </div>
      )}
      {!isCollectionLoading && isCollectionError && (
        <CustomError errorMsg={collectionErrorMsg} />
      )}
      <Dialog
        open={showAnnotationDialog}
        onClose={handleCreateAnnotationDialogClose}
      >
        <DialogContent>
          <EventIntake
            collection={collection}
            onCloseDialog={handleCreateAnnotationDialogClose}
            videoId={videoData?.id}
          ></EventIntake>
        </DialogContent>
      </Dialog>
    </>
  );
};

export default YouTubePlayer;
