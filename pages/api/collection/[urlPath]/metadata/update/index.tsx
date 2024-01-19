import { Collection, Db, MongoClient } from "mongodb";
import { NextApiRequest, NextApiResponse } from "next";
import clientPromise from "../../../../../../middleware/mongodb";
import {
  CollectionMetadata,
  Collection as CollectionData,
} from "../../../../../../types";

const collectionMetadataUpdate = async (
  req: NextApiRequest,
  res: NextApiResponse
) => {
  const allowedMethods: string[] = ["PATCH", "POST"];
  if (!allowedMethods.includes(req?.method || "") || req.method === "OPTIONS") {
    return res.status(405).json({ message: "Method not allowed." });
  }

  try {
    const client: MongoClient = await clientPromise;
    const db: Db = client.db("videoAnnotator1");
    const coll: Collection<CollectionData> = db.collection("collections");
    if (req.method === "PATCH") {
      let {
        metadata,
        urlPath,
      }: {
        metadata: CollectionMetadata;
        urlPath: string;
      } = req.body;
      const result = await coll.updateOne(
        { "metadata.urlPath": urlPath.toLowerCase() },
        {
          $set: {
            metadata: { ...metadata, urlPath: metadata.urlPath?.toLowerCase() },
          },
        }
      );
      if (result.modifiedCount < 1) {
        res
          .status(404)
          .json({ message: "Target collection was not found in the database" });
        // const minimalCollection: CollectionData = {
        //   excludeFromDetailList: [
        //     "_id",
        //     "id",
        //     "videoIntakeQuestions",
        //     "individualIntakeQuestions",
        //     "eventIntakeQuestions",
        //     "excludeFromDetailList",
        //     "videoQuestionsFormFieldGroup",
        //     "individualQuestionsFormFieldGroup",
        //     "eventQuestionsFormFieldGroup",
        //     "videos",
        //     "individuals",
        //   ],
        //   metadata: { ...metadata, urlPath: metadata.urlPath?.toLowerCase() },
        // };
        // const creationResult = await coll.insertOne(minimalCollection);
        // res.status(200).json({
        //   message: "Collection with metadata created successfully",
        //   data: minimalCollection,
        //   result: creationResult,
        // });
      } else {
        res.status(200).json({
          message: "Collection metadata updated successfully",
          data: metadata,
          // result: result,
        });
      }
    }
  } catch (error: any) {
    console.log(error);
    res.status(500).json({ message: error.message });
  }
};

export default collectionMetadataUpdate;
