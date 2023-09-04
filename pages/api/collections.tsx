import { Collection, Db, MongoClient } from "mongodb";
import { NextApiRequest, NextApiResponse } from "next";
import clientPromise from "../../middleware/mongodb";
import { Collection as CollectionData } from "../../types";

const collection = async (req: NextApiRequest, res: NextApiResponse) => {
  const allowedMethods = ["GET"];

  if (!allowedMethods.includes(req.method || "") || req.method === "OPTIONS") {
    return res.status(405).json({ message: "Method not allowed." });
  }

  try {
    const client: MongoClient = await clientPromise;
    const db: Db = client.db("videoAnnotator1");
    const coll: Collection<CollectionData> = db.collection("collection");
    let { data }: { data: CollectionData } = req.body;
    if (req.method === "GET") {
      const targetDocuments = await coll.find({}).toArray();
      res.status(200).json(targetDocuments);
    }
  } catch (e: any) {
    console.log(e);
    res.status(500).json({
      message: e.message,
    });
  }
};

export default collection;
