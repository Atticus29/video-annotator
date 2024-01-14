import { Collection, Db, MongoClient } from "mongodb";
import { NextApiRequest, NextApiResponse } from "next";
import { get } from "lodash-es";
import clientPromise from "../../../../../../middleware/mongodb";
import {
  SingleFormField,
  Collection as CollectionData,
} from "../../../../../../types";

const individualIntakeQuestionCollectionUpdate = async (
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
        individualIntakeQuestions,
        urlPath,
      }: { individualIntakeQuestions: SingleFormField[]; urlPath: string } =
        req.body;
      const result = await coll.updateOne(
        { "metadata.urlPath": urlPath },
        { $set: { individualIntakeQuestions: individualIntakeQuestions } }
      );
      if (result.modifiedCount < 1) {
        res.status(404).json({ message: "Collection could not be found" });
      } else {
        res.status(200).json({
          message: "Individual intake questions updated successfully",
          data: individualIntakeQuestions,
        });
      }
    }
  } catch (error: any) {
    console.log(error);
    res.status(500).json({ message: error.message });
  }
};

export default individualIntakeQuestionCollectionUpdate;
