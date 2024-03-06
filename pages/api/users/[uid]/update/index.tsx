import { Collection, Db, MongoClient } from "mongodb";
import { NextApiRequest, NextApiResponse } from "next";
import clientPromise from "../../../../../middleware/mongodb";
import { UserRoles, User } from "../../../../../types";

const userRolesUpdate = async (req: NextApiRequest, res: NextApiResponse) => {
  const allowedMethods: string[] = ["PATCH"];
  if (!allowedMethods.includes(req?.method || "") || req.method === "OPTIONS") {
    return res.status(405).json({ message: "Method not allowed." });
  }

  try {
    const client: MongoClient = await clientPromise;
    const db: Db = client.db("videoAnnotator1");
    const coll: Collection<User> = db.collection("users");
    console.log("deleteMe got here b1");
    if (req.method === "PATCH") {
      let { uid, roles }: { uid: string; roles: UserRoles } = req.body;
      const newUser: User = { uid: uid, roles: roles };
      console.log("deleteMe newUser is: ");
      console.log(newUser);
      const result = await coll.updateOne(
        { uid: uid },
        { $set: { uid: uid, roles: roles } }, // @TODO research whether this would completely replace or not
        { upsert: true }
      );
      res.status(200).json({
        message: "User with new role(s) created successfully",
        data: newUser,
        result: result,
      });
    }
  } catch (error: any) {
    console.log(error);
    res.status(500).json({ message: error.message });
  }
};

export default userRolesUpdate;
