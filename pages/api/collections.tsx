import { Collection, Db, MongoClient } from "mongodb";
import { NextApiRequest, NextApiResponse } from "next";
import clientPromise from "../../middleware/mongodb";
import { User as UserData } from "firebase/auth";
import { Collection as CollectionData } from "../../types";

const collections = async (req: NextApiRequest, res: NextApiResponse) => {
  const allowedMethods = ["GET"];

  if (!allowedMethods.includes(req.method || "") || req.method === "OPTIONS") {
    return res.status(405).json({ message: "Method not allowed." });
  }

  try {
    const client: MongoClient = await clientPromise;
    const db: Db = client.db("videoAnnotator1");
    const coll: Collection<CollectionData> = db.collection("collection");
    // let { data }: { data: UserData } = req.body;
    const email: string = req.query.email as string;
    if (req.method === "GET") {
      const targetDocuments = await coll
        .find({ createdByEmail: email })
        .toArray(); // @TODO filter by current user or public
      res.status(200).json(targetDocuments);
    }
  } catch (e: any) {
    console.log(e);
    res.status(500).json({
      message: e.message,
    });
  }
};

export default collections;
