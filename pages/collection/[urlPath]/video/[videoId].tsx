import {
  Backdrop,
  Button,
  CircularProgress,
  Dialog,
  DialogContent,
  DialogContentText,
  DialogTitle,
} from "@mui/material";
import axios from "axios";
import { get, map, reduce } from "lodash-es";
import { NextRouter, useRouter } from "next/router";
import { useEffect, useMemo, useState } from "react";
import { FormattedMessage, IntlShape, useIntl } from "react-intl";
import { QueryFunctionContext, useQuery, useQueryClient } from "react-query";
import { excludeFromCollectionTableDisplay } from "../../constants";
import useGetCollection from "../../hooks/useGetCollection";
import { convertCamelCaseToCapitalCase } from "../../utilities/textUtils";

const SingleVideoView: React.FC = () => {
  const queryClient = useQueryClient();
  const router: NextRouter = useRouter();
  const intl: IntlShape = useIntl();
  const localVideoId: string | string[] | undefined = router.query.vidId;
  console.log("deleteMe localVideoId is: ");
  console.log(localVideoId);
  const localUrlPath: string | string[] | undefined = router.query.urlPath;
  let localUrlPathAsString: string =
    (Array.isArray(localUrlPath) ? localUrlPath.join() : localUrlPath) || "";
  console.log("deleteMe localUrlPathAsString is: ");
  console.log(localUrlPathAsString);
  //   const [calculatedHeight, setCalculatedHeight] = useState<number>(9.4);
  //   const [showCollection, setShowCollection] = useState<boolean>(false);
  const { isLoading, isError, data, error } = useGetVideo(
    localUrlPathAsString,
    localVideoId
  );

  const [open, setOpen] = useState<boolean>(isLoading);
  const [createVideoDialogOpen, setCreateVideoDialogOpen] =
    useState<boolean>(false);

  useEffect(() => {
    setOpen(isLoading);
    if (!isLoading && !isError && data) {
      const numRows: number = data?.videos?.length || 1;
      setCalculatedHeight(9.4 + 2.51 * (numRows - 1));
    }
    if (!isLoading && !isError && data) {
      setShowCollection(true);
    }
    if (!isLoading && !isError && !data) {
      setShowCollection(false);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isLoading, data, isError, createVideoDialogOpen]);

  const handleNewVideoClick = () => {
    setCreateVideoDialogOpen(true);
  };

  const handleCreateVideoDialogClose = () => {
    setCreateVideoDialogOpen(false);
    console.log("deleteMe got here c1");
    const queryKey = ["singleCollection", localUrlPathAsString];
    const queryCache = queryClient.getQueryCache();
    let queryState = queryCache.find(queryKey);
    if (queryState) {
      console.log(`Before Query with key ${queryKey} is in the cache.`);
    } else {
      console.log(`Before Query with key ${queryKey} is NOT in the cache.`);
    }
    // queryClient.invalidateQueries();
    queryClient.invalidateQueries({
      queryKey: queryKey,
    });
    queryState = queryCache.find(queryKey);
    if (queryState) {
      console.log(`After Query with key ${queryKey} is in the cache.`);
    } else {
      console.log(`After Query with key ${queryKey} is NOT in the cache.`);
    }
  };

  const colNamesToDisplay: {} = useMemo(() => {
    if (data && data.videoIntakeQuestions) {
      // console.log("deleteMe data?.videoIntakeQuestions is: ");
      // console.log(data?.videoIntakeQuestions);
      return reduce(
        data?.videoIntakeQuestions,
        (memo: {}, intakeQuestion: any) => {
          return {
            ...memo,
            [intakeQuestion?.label]: intakeQuestion?.label,
          };
        },
        {}
      );
    } else {
      return {};
    }
  }, [data]);

  // console.log("deleteMe colNamesToDisplay is: ");
  // console.log(colNamesToDisplay);

  // @TODO figure out how to pluralize data.nameOfVideo below
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
      {showCollection && (
        <>
          <Dialog
            open={createVideoDialogOpen}
            onClose={handleCreateVideoDialogClose}
          >
            <DialogContent>
              <VideoIntake
                collection={data}
                onCloseDialog={handleCreateVideoDialogClose}
              ></VideoIntake>
            </DialogContent>
          </Dialog>
          <CollectionDetailsView
            collection={data}
            showEditButton={false}
          ></CollectionDetailsView>
          <DataTable
            tableTitle={data?.nameOfVideo + "s"}
            data={data?.videos}
            colNamesToDisplay={colNamesToDisplay}
            actionButtonsToDisplay={{ edit: "Edit", view: "View" }}
            // actionUrls={{edit: }}
            styleOverrides={{ minHeight: 0, height: calculatedHeight + "rem" }}
          ></DataTable>
          <Button
            data-testid={"new-video-add-button"}
            variant="contained"
            onClick={handleNewVideoClick}
          >
            <FormattedMessage
              id="ADD_NEW_VIDEO_TO_COLLECTION"
              defaultMessage="Add New {videoName}"
              values={{ videoName: data?.nameOfVideo }}
            />
          </Button>
        </>
      )}
      {!isLoading && !showCollection && (
        <CustomError
          errorMsg={intl.formatMessage({
            id: "COLLECTION_NOT_FOUND",
            defaultMessage: "Collection not found",
          })}
        />
      )}
    </>
  );
};

export default CollectionView;
