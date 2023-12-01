import { Collection, Db, MongoClient } from "mongodb";
import { NextApiRequest, NextApiResponse } from "next";
import clientPromise from "../../../../../middleware/mongodb";

const videoInCollection = async (req: NextApiRequest, res: NextApiResponse) => {
  const allowedMethods: string[] = ["GET"];

  if (!allowedMethods.includes(req.method || "") || req.method === "OPTIONS") {
    return res.status(405).json({ message: "Method not allowed." });
  }

  try {
    const { urlPath, videoId } = req.query;
    const client: MongoClient = await clientPromise;
    const db: Db = client.db("videoAnnotator1");
    const coll: Collection<Collection> =
      db.collection<Collection>("collections");

    if (req.method === "GET") {
      const collection = await coll.findOne({ urlPath: urlPath });
      if (collection) {
        const video = collection.videos.find((vid) => vid.URL === videoId); // @TOOD set an id instead
      }
    }
  } catch (e: any) {
    console.log(e);
    res.status(500).json({ message: e.message });
  }
};

export default videoInCollection;
