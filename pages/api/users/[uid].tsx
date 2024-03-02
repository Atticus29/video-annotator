import { Collection, Db, MongoClient } from "mongodb";
import { NextApiRequest, NextApiResponse } from "next";
import clientPromise from "../../../middleware/mongodb";
import { User } from "../../../types";

const UserRoles = async (req: NextApiRequest, res: NextApiResponse) => {
  console.log("deleteMe got here d1 and req is: ");
  console.log(req);

  const allowedMethods: string[] = ["GET"];

  if (!allowedMethods.includes(req.method || "") || req.method === "OPTIONS") {
    return res.status(405).json({ message: "Method not allowed." });
  }

  if (req.method === "GET") {
    try {
      const client: MongoClient = await clientPromise;
      const db: Db = client.db("videoAnnotator1");
      const coll: Collection<User> = db.collection<User>("users");
      const { uid } = req.query;
      console.log("deleteMe got here c1 and uid is: ");
      console.log(uid);
      const user = await coll.findOne({ uid: uid });
      if (user) {
        return res.status(200).json({ user });
      } else {
        return res.status(404).json({ messsage: "No user found" });
      }
    } catch (error: any) {
      console.log(error);
      res.status(500).json({ message: error.message });
    }
  }
};

export default UserRoles;
