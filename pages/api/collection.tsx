import { Collection, Db, MongoClient } from "mongodb";
import { NextApiRequest, NextApiResponse } from "next";
import clientPromise from "../../middleware/mongodb";
import { Collection as CollectionData } from "../../types";

const collection = async (req: NextApiRequest, res: NextApiResponse) => {
  try {
    const client: MongoClient = await clientPromise;
    const db: Db = client.db("videoAnnotator1");
    const coll: Collection<CollectionData> = db.collection("collection"); // @TODO add a type this
    if (req.method === "POST") {
      let { data }: { data: CollectionData } = req.body;
      const result = await coll.insertOne(data);
      res.status(200).json({ message: "Collection saved successfully.", data });
    }
  } catch (e: any) {
    console.log(e);
    res.status(500).json({
      message: "Something went wrong saving the collection.",
      data: e.message,
    });
  }
};

export default collection;
