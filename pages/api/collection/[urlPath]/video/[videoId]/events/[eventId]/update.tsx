import { Collection, Db, MongoClient } from "mongodb";
import { NextApiRequest, NextApiResponse } from "next";
import clientPromise from "../../../../../../../../middleware/mongodb";
import { Collection as CollectionData } from "../../../../../../../../types";

const collectionEventUpdate = async (
  req: NextApiRequest,
  res: NextApiResponse
) => {
  const allowedMethods: string[] = ["PATCH"];

  if (!allowedMethods.includes(req?.method || "") || req.method === "OPTIONS") {
    return res.status(405).json({ message: "Method not allowed." });
  }

  try {
    const client: MongoClient = await clientPromise;
    const db: Db = client.db("videoAnnotator1");
    const coll: Collection<CollectionData> = db.collection("collections");
    if (req.method === "PATCH") {
      //   let { updatedEventData } = req.body;
      const {
        collectionUrl,
        videoId,
        eventId,
        updatedEventData,
      }: {
        collectionUrl: string;
        videoId: string;
        eventId: string;
        updatedEventData: any;
      } = req.body;
      const result = await coll.updateOne(
        {
          "metadata.urlPath": collectionUrl,
          "videos.id": videoId,
          "videos.events.id": eventId,
        },
        {
          $set: {
            "videos.$[video].events.$[event]": {
              $mergeObjects: [{ ...updatedEventData }, { ...updatedEventData }],
            },
          },
        },
        {
          arrayFilters: [{ "video.id": videoId }, { "event.id": eventId }],
        }
      );

      res.status(200).json({
        message: "Event data successfully updated",
        data: updatedEventData,
        result: result,
      });
    }
  } catch (error: any) {
    console.log(error);
    res.status(500).json({ message: error.message });
  }
};

export default collectionEventUpdate;
