import { Collection, Db, MongoClient } from "mongodb";
import { NextApiRequest, NextApiResponse } from "next";
import clientPromise from "../../../../../middleware/mongodb";
import {
  SingleFormField,
  Collection as CollectionData,
} from "../../../../../types";
const collectionVideoIntakeQuestionsPost = async (
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
        videoIntakeQuestions,
        urlPath,
      }: { videoIntakeQuestions: SingleFormField[]; urlPath: string } =
        req.body;
      const targetVideoIntakeQuestions = await coll.findOne(
        {
          "metadata.urlPath": urlPath,
        },
        { projection: { videoIntakeQuestions: 1, _id: 0 } }
      );

      if (Object.keys(targetVideoIntakeQuestions || {}).length === 0) {
        const creationResult = await coll.updateOne(
          {
            "metadata.urlPath": urlPath,
          },
          { $set: { videoIntakeQuestions } }
        );
        res.status(200).json({
          message: "Video intake questions successfully added to collection",
          data: videoIntakeQuestions,
          result: creationResult,
        });
      } else {
        res.status(200).json({
          message: "Video intake questions already exist for this collection.",
          result: targetVideoIntakeQuestions,
          data: videoIntakeQuestions,
        });
      }
    }
  } catch (error: any) {
    console.log(error);
    res.status(500).json({ message: error.message });
  }
};
export default collectionVideoIntakeQuestionsPost;
