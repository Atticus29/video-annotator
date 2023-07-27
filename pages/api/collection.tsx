import { Collection, Db, MongoClient } from "mongodb";
import { NextApiRequest, NextApiResponse } from "next";
import clientPromise from "../../middleware/mongodb";
import { shamCollection } from "../../dummy_data/dummyCollection";

const collection = async (req: NextApiRequest, res: NextApiResponse) => {
  try {
    const client: MongoClient = await clientPromise;
    const db: Db = client.db("videoAnnotator1");
    const coll = db.collection("collection"); // @TODO add a type this
    if (req.method === "POST") {
      console.log("deleteMe got here a1");
      let { data } = req.body; // @TODO implement this
      //   data = shamCollection;
      const result = await coll.insertOne(data);
      console.log("deleteMe result is: ");
      console.log(result);
      res.status(200).json({ message: "TODO it worked", data });
      //   res.json();
    }
  } catch (e: any) {
    console.log(e);
    res
      .status(500)
      .json({ message: "TODO something went wrong", data: e.message });
  }
};

export default collection;
