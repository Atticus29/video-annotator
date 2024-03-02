import { get } from "lodash-es";
import { Collection, Db, MongoClient } from "mongodb";
import { NextApiRequest, NextApiResponse } from "next";
import clientPromise from "../../../../middleware/mongodb";

const IndividualsInCollection = async (
  req: NextApiRequest,
  res: NextApiResponse
) => {
  const allowedMethods: string[] = ["GET"];

  if (!allowedMethods.includes(req.method || "") || req.method === "OPTIONS") {
    return res.status(405).json({ message: "Method not allowed." });
  }

  try {
    const { urlPath } = req.query;
    const client: MongoClient = await clientPromise;
    const db: Db = client.db("videoAnnotator1");
    const coll: Collection<Collection> =
      db.collection<Collection>("collections");

    if (req.method === "GET") {
      const collection = await coll.findOne({
        "metadata.urlPath": urlPath,
      });
      if (collection) {
        const individuals = get(collection, ["individuals"]);
        if (individuals?.length > 0) {
          return res.status(200).json({ individuals });
        } else {
          return res.status(404).json({ message: "No individuals found." });
        }
      }
    }
  } catch (e: any) {
    console.log(e);
    res.status(500).json({ message: e.message });
  }
};

export default IndividualsInCollection;
