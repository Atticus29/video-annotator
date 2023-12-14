import { Collection, Db, MongoClient } from "mongodb";
import { NextApiRequest, NextApiResponse } from "next";
import clientPromise from "../../../../middleware/mongodb";
import { Collection as CollectionData } from "../../../../types";

const collectionUpdate = async (req: NextApiRequest, res: NextApiResponse) => {
  const allowedMethods = ["PATCH"];

  if (!allowedMethods.includes(req.method || "") || req.method === "OPTIONS") {
    return res.status(405).json({ message: "Method not allowed." });
  }

  try {
    const client: MongoClient = await clientPromise;
    const db: Db = client.db("videoAnnotator1");
    const coll: Collection<CollectionData> = db.collection("collections");
    if (req.method === "PATCH") {
      let { data }: { data: CollectionData } = req.body;
      const existingDocument = await coll.findOne({ urlPath: data.urlPath });
      if (existingDocument) {
        const result = await coll.replaceOne(
          { urlPath: data.urlPath },
          { ...data }
        );
        res
          .status(200)
          .json({ message: "Collection updated successfully.", data });
      }
    }
  } catch (e: any) {
    console.log(e);
    res.status(500).json({
      message: e.message,
    });
  }
};

export default collectionUpdate;
