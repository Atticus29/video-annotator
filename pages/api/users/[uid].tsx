import { Collection, Db, MongoClient } from "mongodb";
import { NextApiRequest, NextApiResponse } from "next";
import clientPromise from "../../../middleware/mongodb";
import { UserWithRoles } from "../../../types";

const UserRoles = async (req: NextApiRequest, res: NextApiResponse) => {
  const allowedMethods: string[] = ["GET"];

  if (!allowedMethods.includes(req.method || "") || req.method === "OPTIONS") {
    return res.status(405).json({ message: "Method not allowed." });
  }

  if (req.method === "GET") {
    try {
      const client: MongoClient = await clientPromise;
      const db: Db = client.db("videoAnnotator1");
      const coll: Collection<UserWithRoles> =
        db.collection<UserWithRoles>("users");
      const { uid } = req.query;
      const userWithRoles = await coll.findOne({ uid: uid });
      if (userWithRoles) {
        return res.status(200).json({ userWithRoles });
      } else {
        return res.status(404).json({ messsage: "No user found" });
      }
    } catch (error: any) {
      console.log(error);
      res.status(500).json({ message: error.message });
    }
  }
};
