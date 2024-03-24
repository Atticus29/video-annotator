import { Collection, Db, MongoClient } from "mongodb";
import { NextApiRequest, NextApiResponse } from "next";
import { Collection as CollectionData } from "../../../../../../../types";
import clientPromise from "../../../../../../../middleware/mongodb";

const collectionEventCreate = async (
  req: NextApiRequest,
  res: NextApiResponse
) => {
  const allowedMethods: string[] = ["POST"];

  if (!allowedMethods.includes(req?.method || "") || req.method === "OPTIONS") {
    return res.status(405).json({ message: "Method not allowed." });
  }

  try {
    const client: MongoClient = await clientPromise;
    const db: Db = client.db("videoAnnotator1");
    const coll: Collection<CollectionData> = db.collection("collections");

    if (req.method === "POST") {
      const {
        collectionUrl,
        videoId,
        eventData,
      }: { collectionUrl: string; videoId: string; eventData: any } = req.body;

      const result = await coll.updateOne(
        {
          "metadata.urlPath": collectionUrl,
          videos: { $elemMatch: { id: videoId } },
        },
        { $push: { "videos.$.events": eventData } }
      );

      res.status(200).json({
        message: "Event data successfully added to video",
        data: eventData,
        result: result,
      });
    }
  } catch (error: any) {
    console.log(error);
    res.status(500).json({ message: error.message });
  }
};

export default collectionEventCreate;
