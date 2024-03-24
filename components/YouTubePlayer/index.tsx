import {
  Backdrop,
  Button,
  CircularProgress,
  Dialog,
  DialogContent,
} from "@mui/material";
import React, { useState } from "react";
import YouTube from "react-youtube";
import useGetCollection from "../../hooks/useGetCollection";
import CustomError from "../CustomError";
import EventIntake from "../EventIntake";
import { EventMetadata } from "../../types";
import useFirebaseAuth from "../../hooks/useFirebaseAuth";

const YouTubePlayer: React.FC<{
  videoUrl?: string;
  videoId?: string;
  videoData: any;
  collectionUrl: string;
}> = ({ videoUrl, videoId, videoData, collectionUrl }) => {
  const { user } = useFirebaseAuth();
  const {
    data: collection,
    isLoading: isCollectionLoading, //@TODO implement
    isError: isCollectionError,
    errorMsg: collectionErrorMsg,
  } = useGetCollection(collectionUrl);

  const [showAnnotationDialog, setShowAnnotationDialog] =
    useState<boolean>(false);

  const [eventMetadata, setEventMetadata] = useState<EventMetadata>({
    annotatorId: user?.id || "no_user",
    startTime: 0,
    endTime: 0,
    upvotes: 0,
    downvotes: 0,
    flaggedVotes: 0,
  });

  const openAnnotationDialog: () => void = () => {
    onPauseVideo();
    setAnnotationBegun(true);
    setEventMetadata({
      annotatorId: user?.id || "no_user",
      startTime: player.getCurrentTime(),
      endTime: player.getCurrentTime() + 30, // @TODO a reasonable default?
      upvotes: 0,
      downvotes: 0,
      flaggedVotes: 0,
    });
    setShowAnnotationDialog(true);
  };

  const [annotationBegun, setAnnotationBegun] = useState<boolean>(false);

  const handleCreateAnnotationDialogClose: () => void = () => {
    setShowAnnotationDialog(false);
  };

  const handleCreateAnnotationManualDialogClose: () => void = () => {
    setAnnotationBegun(false);
    setShowAnnotationDialog(false);
  };

  const handleEndOfEvent: () => void = () => {
    // @TODO update the event
    setAnnotationBegun(false);
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
              onClick={onPauseVideo}
            >
              Pause
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
          </section>
          <section id="annotation-panel" style={{ marginTop: "1rem" }}>
            <Button
              disabled={annotationBegun}
              style={{ marginRight: "1rem" }}
              variant="contained"
              onClick={openAnnotationDialog}
            >
              Begin {collection?.metadata?.nameOfEvent}
            </Button>
            <Button
              disabled={!annotationBegun}
              style={{ marginRight: "1rem" }}
              variant="contained"
              onClick={handleEndOfEvent}
            >
              End {collection?.metadata?.nameOfEvent}
            </Button>
          </section>
        </div>
      )}
      {!isCollectionLoading && isCollectionError && (
        <CustomError errorMsg={collectionErrorMsg} />
      )}
      <Dialog
        open={showAnnotationDialog}
        onClose={handleCreateAnnotationManualDialogClose}
      >
        <DialogContent>
          <EventIntake
            collection={collection}
            onCloseDialogSuccess={handleCreateAnnotationDialogClose}
            onCloseDialogReset={handleCreateAnnotationManualDialogClose}
            videoId={videoData?.id}
            eventMetadata={eventMetadata}
          ></EventIntake>
        </DialogContent>
      </Dialog>
    </>
  );
};

export default YouTubePlayer;
