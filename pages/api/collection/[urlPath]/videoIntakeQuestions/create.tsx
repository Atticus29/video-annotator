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

  const client: MongoClient = await clientPromise;
  const db: Db = client.db("videoAnnotator1");
  const coll: Collection<CollectionData> = db.collection("collections");
  let {
    videoIntakeQuestions,
    urlPath,
  }: { videoIntakeQuestions: SingleFormField[]; urlPath: string } = req.body;
  try {
    if (req.method === "POST") {
      const targetVideoIntakeQuestions = await coll.findOne(
        {
          "metadata.urlPath": urlPath,
        },
        { projection: { videoIntakeQuestions: 1 } }
      );
      // const targetVideoIntakeQuestions = true;

      if (!Boolean(targetVideoIntakeQuestions)) {
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
        });
      }
    }
  } catch (error: any) {
    console.log(error);
    console.log("deleteMe got here d1");
    console.log(videoIntakeQuestions);
    console.log(urlPath);
    res.status(500).json({ message: error.message });
  }
};
export default collectionVideoIntakeQuestionsPost;
