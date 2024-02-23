import { Collection, Db, MongoClient } from "mongodb";
import { NextApiRequest, NextApiResponse } from "next";
import clientPromise from "../../../../../middleware/mongodb";
import {
  SingleFormField,
  Collection as CollectionData,
} from "../../../../../types";

const individualIntakeQuestionCollectionCreate = async (
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
        individualIntakeQuestions,
        urlPath,
      }: { individualIntakeQuestions: SingleFormField[]; urlPath: string } =
        req.body;
      const targetIndividualIntakeQuestions = await coll.findOne(
        {
          "metadata.urlPath": urlPath,
        },
        { projection: { individualIntakeQuestions: 1, _id: 0 } }
      );
      if (Object.keys(targetIndividualIntakeQuestions || {}).length === 0) {
        const creationResult = await coll.updateOne(
          {
            "metadata.urlPath": urlPath,
          },
          { $set: { individualIntakeQuestions } }
        );
        res.status(200).json({
          message:
            "Individual intake questions successfully added to collection.",
          data: individualIntakeQuestions,
          result: creationResult,
        });
      } else {
        res.status(200).json({
          message:
            "Individual intake questions already exist for this collection.",
        });
      }
    }
  } catch (error: any) {
    console.log(error);
    res.status(500).json({ message: error.message });
  }
};

export default individualIntakeQuestionCollectionCreate;
