import { Collection, Db, MongoClient } from "mongodb";
import { NextApiRequest, NextApiResponse } from "next";
import clientPromise from "../../../../../middleware/mongodb";
import { User } from "../../../../../types";

const userRoleUpdate = async (req: NextApiRequest, res: NextApiResponse) => {
  const allowedMethods: string[] = ["PATCH"];
  if (!allowedMethods.includes(req?.method || "") || req.method === "OPTIONS") {
    return res.status(405).json({ message: "Method now allowed." });
  }
  try {
    const client: MongoClient = await clientPromise;
    const db: Db = client.db("videoAnnotator1");
    const coll: Collection<User> = db.collection<User>("users");
    if (req.method === "PATCH") {
      let { uid, role }: { uid: string; role: any } = req.body;

      const result = await coll.updateOne(
        { uid: uid, "roles.roleName": role.roleName }, // @TODO not only does this not work, but really, I just want to set the status to something different if it's not set to the desired setting already. And then I want to add an entry to the audit log accordingly
        {
          $set: { "roles.$": role },
        },
        { upsert: true }
      );
      if (result.modifiedCount < 1) {
        res.status(200).json({ message: "Role already existed for user." });
      } else {
        res.status(200).json({
          message: "Role successfully added to user",
          data: role,
          result: result,
        });
      }
    }
  } catch (error: any) {
    console.log(error);
    res.status(500).json({ message: error.message });
  }
};

export default userRoleUpdate;
