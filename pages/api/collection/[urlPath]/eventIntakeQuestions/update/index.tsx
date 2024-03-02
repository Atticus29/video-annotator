import { Collection, Db, MongoClient } from "mongodb";
import { NextApiRequest, NextApiResponse } from "next";
import clientPromise from "../../../../../../middleware/mongodb";
import {
  SingleFormField,
  Collection as CollectionData,
} from "../../../../../../types";

const collectionEventIntakeQuestionsUpdate = async (
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
        eventIntakeQuestions,
        urlPath,
      }: { eventIntakeQuestions: SingleFormField[]; urlPath: string } =
        req.body;
      const result = await coll.updateOne(
        { "metadata.urlPath": urlPath.toLowerCase() },
        {
          $set: {
            eventIntakeQuestions: eventIntakeQuestions,
          },
        }
      );
      if (result.modifiedCount < 1) {
        res.status(200).json({
          message: "Nothing changed.",
        });
      } else {
        res.status(200).json({
          message: "Event intake questions updated successfully.",
          data: eventIntakeQuestions,
          result: result,
        });
      }
    }
  } catch (error: any) {
    console.log(error);
    res.status(500).json({ message: error.message });
  }
};

export default collectionEventIntakeQuestionsUpdate;
