import { Db, MongoClient } from "mongodb";
import { NextApiRequest, NextApiResponse } from "next";
import clientPromise from "../../middleware/mongodb";

const testRead = async (_req: NextApiRequest, res: NextApiResponse) => {
  try {
    const client: MongoClient = await clientPromise;
    const db: Db = client.db("sample_airbnb");
    const listingsAndReivews: any[] = await db
      .collection("listingsAndReviews")
      .find({})
      .limit(10)
      .toArray();
    res.json(listingsAndReivews);
  } catch (e: any) {
    console.log(e);
  }
};

export default testRead;
