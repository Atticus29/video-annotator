import { Collection, Db, MongoClient } from "mongodb";
import { NextApiRequest, NextApiResponse } from "next";
import clientPromise from "../../../../../middleware/mongodb";
import {
  SingleFormField,
  Collection as CollectionData,
} from "../../../../../types";
import { get } from "lodash-es";

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
      let { data }: { data: SingleFormField[] } = req.body;
      const existingDocument = await coll.findOne({
        urlPath: get(data, ["urlPath"]),
      });
      if (existingDocument) {
        const result = await coll.updateOne(
          { urlPath: get(data, ["urlPath"]) },
          { individualIntakeQuestions: [...data] }
        );
        res.status(200).json({
          message: "Individual intake questions updated successfully",
          data: result,
        });
      }
    }
  } catch (e: any) {
    console.log(e);
    res.status(500).json({ message: e.message });
  }
};

export default individualIntakeQuestionCollectionUpdate;
