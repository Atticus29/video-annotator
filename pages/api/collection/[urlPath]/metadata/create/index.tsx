import { Collection, Db, MongoClient } from "mongodb";
import { NextApiRequest, NextApiResponse } from "next";
import clientPromise from "../../../../../../middleware/mongodb";
import {
  CollectionMetadata,
  Collection as CollectionData,
} from "../../../../../../types";
import { excludeFromCollectionTableDisplay } from "../../../../../../constants";

const collectionMetadataPost = async (
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
      let {
        metadata,
        urlPath,
      }: {
        metadata: CollectionMetadata;
        urlPath: string;
      } = req.body;
      const existingDocument = await coll.findOne({
        "metadata.urlPath": urlPath,
      });
      if (!existingDocument) {
        const minimalCollection: CollectionData = {
          excludeFromDetailList: excludeFromCollectionTableDisplay,
          metadata: { ...metadata, urlPath: metadata.urlPath?.toLowerCase() },
        };
        const creationResult = await coll.insertOne(minimalCollection);
        res.status(200).json({
          message: "Collection with metadata created successfully",
          data: minimalCollection,
          result: creationResult,
        });
      } else {
        res
          .status(405)
          .json({ message: "Collection with that name already exists" });
      }
    }
  } catch (error: any) {
    console.log(error);
    res.status(500).json({ message: error.message });
  }
};

export default collectionMetadataPost;
