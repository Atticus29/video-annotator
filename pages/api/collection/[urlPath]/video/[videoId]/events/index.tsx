import { Collection, Db, MongoClient } from "mongodb";
import { NextApiRequest, NextApiResponse } from "next";
import clientPromise from "../../../../../../../middleware/mongodb";
import { Collection as CollectionData } from "../../../../../../../types";
import { get } from "lodash-es";

const eventsForVideoInCollection = async (
  req: NextApiRequest,
  res: NextApiResponse
) => {
  const allowedMethods: string[] = ["GET"];

  if (!allowedMethods.includes(req.method || "") || req.method === "OPTIONS") {
    return res.status(405).json({ message: "Method not allowed." });
  }

  try {
    const { urlPath, videoId } = req.query;
    // console.log("deleteMe videoId is: " + videoId);

    // let urlPathAsString: string =
    //   (Array.isArray(urlPath) ? urlPath.join() : urlPath) ||
    //   "";
    // let videoIdAsString: string =
    //   (Array.isArray(videoId) ? videoId.join() : videoId) || "";

    console.log("deleteMe videoId is: " + videoId);
    console.log("deleteMe urlPath is: " + urlPath);
    const client: MongoClient = await clientPromise;
    const db: Db = client.db("videoAnnotator1");
    const coll: Collection<CollectionData> = db.collection("collections");

    if (req.method === "GET" && urlPath && videoId) {
      console.log("deleteMe got here e1");
      const collection = await coll.findOne({
        "metadata.urlPath": urlPath,
      });
      console.log("deleteMe collection is: ");
      console.log(collection);

      if (collection) {
        const video = collection?.videos?.find(
          (vid) => get(vid, ["id"]) === videoId
        );
        if (video && get(video, ["events"])) {
          return res.status(200).json({ events: get(video, ["events"]) });
        } else {
          return res
            .status(404)
            .json({ message: "Events not found for the video." });
        }
      } else {
        return res.status(404).json({
          message: "Collection not found when searching for events in video.",
        });
      }
    }
  } catch (error: any) {
    console.log(error);
    res.status(500).json({ message: "Internal server error." });
  }
};

export default eventsForVideoInCollection;
