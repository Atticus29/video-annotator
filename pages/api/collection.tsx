import { Collection, Db, MongoClient } from "mongodb";
import { NextApiRequest, NextApiResponse } from "next";
import clientPromise from "../../middleware/mongodb";
import { Collection as CollectionData } from "../../types";

const collection = async (req: NextApiRequest, res: NextApiResponse) => {
  const allowedMethods = ["GET", "POST"];

  if (!allowedMethods.includes(req.method || "") || req.method === "OPTIONS") {
    return res.status(405).json({ message: "Method not allowed." });
  }

  try {
    const client: MongoClient = await clientPromise;
    const db: Db = client.db("videoAnnotator1");
    const coll: Collection<CollectionData> = db.collection("collections");
    if (req.method === "POST") {
      let { data }: { data: CollectionData } = req.body;
      const existingDocument = await coll.findOne({
        "metadata.urlPath": data.metadata.urlPath?.toLowerCase(),
      });
      if (existingDocument) {
        return res
          .status(409)
          .json({ message: "Collection with that name already exists" });
      } else {
        const result = await coll.insertOne({
          ...data,
          metadata: {
            ...data.metadata,
            urlPath: data.metadata.urlPath?.toLowerCase(),
          },
        });
        res
          .status(200)
          .json({ message: "Collection saved successfully.", data });
      }
    }

    if (req.method === "GET") {
      const urlPath: string = req.query.urlPath as string;
      const targetDocument = await coll.findOne({
        "metadata.urlPath": urlPath.toLowerCase(),
      });
      res.status(200).json(targetDocument);
    }
  } catch (e: any) {
    console.log(e);
    res.status(500).json({
      message: e.message,
    });
  }
};

export default collection;
