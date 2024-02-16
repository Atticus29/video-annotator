import { Collection, Db, MongoClient } from "mongodb";
import { NextApiRequest, NextApiResponse } from "next";
import clientPromise from "../../../../../../middleware/mongodb";
import {
  CollectionMetadata,
  Collection as CollectionData,
  SingleFormField,
} from "../../../../../../types";

const collectionVideoIntakeQuestionsUpdate = async (
  req: NextApiRequest,
  res: NextApiResponse
) => {
  const allowedMethods: string[] = ["PATCH"];
  if (!allowedMethods.includes(req?.method || "") || req.method === "OPTIONS") {
    return res.status(405).json({ message: "Method not allowed." });
  }

  try {
    const client: MongoClient = await clientPromise;
    const db: Db = client.db("videoAnnotator1");
    const coll: Collection<CollectionData> = db.collection("collections");
    if (req.method === "PATCH") {
      let {
        videoIntakeQuestions,
        urlPath,
      }: {
        videoIntakeQuestions: SingleFormField[];
        urlPath: string;
      } = req.body;
      const result = await coll.updateOne(
        { "metadata.urlPath": urlPath.toLowerCase() },
        {
          $set: {
            videoIntakeQuestions: videoIntakeQuestions,
          },
        }
      );
      if (result.modifiedCount < 1) {
        res.status(404).json({
          message:
            "Video intake questions not updated. It's possible that the request was identical to the existing data.",
        });
      } else {
        res.status(200).json({
          message: "Video intake questions updated successfully.",
          data: videoIntakeQuestions,
          result: result,
        });
      }
    }
  } catch (error: any) {
    console.log(error);
    res.status(500).json({ message: error.message });
  }
};

export default collectionVideoIntakeQuestionsUpdate;
