import { Collection, Db, MongoClient } from "mongodb";
import { NextApiRequest, NextApiResponse } from "next";
import clientPromise from "../../middleware/mongodb";
import { Collection as CollectionData } from "../../types";

const collection = async (req: NextApiRequest, res: NextApiResponse) => {
  try {
    const client: MongoClient = await clientPromise;
    const db: Db = client.db("videoAnnotator1");
    const coll: Collection<CollectionData> = db.collection("collection");
    if (req.method === "POST") {
      let { data }: { data: CollectionData } = req.body;

      const existingDocument = await coll.findOne({ id: data.id });
      if (existingDocument) {
        return res.status(409).json({ message: "Collection already exists" });
      }
      const result = await coll.insertOne(data);
      res.status(200).json({ message: "Collection saved successfully.", data });
    }
  } catch (e: any) {
    console.log(e);
    res.status(500).json({
      message: e.message,
    });
  }
};

export default collection;
