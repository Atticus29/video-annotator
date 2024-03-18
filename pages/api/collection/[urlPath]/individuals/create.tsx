import { Collection, Db, MongoClient } from "mongodb";
import { NextApiRequest, NextApiResponse } from "next";
import clientPromise from "../../../../../middleware/mongodb";
import { Collection as CollectionData } from "../../../../../types";

const collectionIndividualsCreate = async (
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
      const {
        collectionUrl,
        individualData,
      }: { collectionUrl: string; individualData: any } = req.body;

      const result = await coll.updateOne(
        { "metadata.urlPath": collectionUrl },
        { $push: { individuals: individualData } }
      );

      res.status(200).json({
        message: "Individual data successfully added to collection",
        data: individualData,
        result: result,
      });
    }
  } catch (error: any) {
    console.log(error);
    res.status(500).json({ message: error.message });
  }
};

export default collectionIndividualsCreate;
