import { NextApiRequest, NextApiResponse } from "next";
import { Collection as CollectionData } from "../../../../../types";
import { Collection, Db, MongoClient } from "mongodb";
import clientPromise from "../../../../../middleware/mongodb";

const createVideo = async (req: NextApiRequest, res: NextApiResponse) => {
  const allowedMethods: string[] = ["POST"];

  if (!allowedMethods.includes(req?.method || "") || req.method === "OPTIONS") {
    return res.status(405).json({ message: "Method not allowed." });
  }
  try {
    const client: MongoClient = await clientPromise;
    const db: Db = client.db("videoAnnotator1");
    const coll: Collection<CollectionData> = db.collection("collections");
    if (req.method === "POST") {
      let {
        collectionUrl,
        videoData,
      }: { collectionUrl: string; videoData: any } = req.body;
      const result = await coll.updateOne(
        { "metadata.urlPath": collectionUrl },
        { $push: { videos: videoData } }
      );
      res.status(200).json({
        message: "Video data successfully addded to collection",
        data: videoData,
        result: result,
      });
    }
  } catch (error: any) {
    console.log(error);
    res.status(500).json({ message: error.message });
  }
};

export default createVideo;
