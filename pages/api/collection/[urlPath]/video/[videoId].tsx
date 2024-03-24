import { find, get } from "lodash-es";
import { Collection, Db, MongoClient } from "mongodb";
import { NextApiRequest, NextApiResponse } from "next";
import clientPromise from "../../../../../middleware/mongodb";

import { Collection as CollectionData } from "../../../../../types";
import { sanitizeString } from "../../../../../utilities/textUtils";

const videoInCollection = async (req: NextApiRequest, res: NextApiResponse) => {
  const allowedMethods: string[] = ["GET"];

  if (!allowedMethods.includes(req.method || "") || req.method === "OPTIONS") {
    return res.status(405).json({ message: "Method not allowed." });
  }

  try {
    const { urlPath, videoId } = req.query;

    let urlPathAsString: string =
      (Array.isArray(urlPath)
        ? sanitizeString(urlPath.join())
        : sanitizeString(urlPath)) || "";
    const client: MongoClient = await clientPromise;
    const db: Db = client.db("videoAnnotator1");
    const coll: Collection<CollectionData> = db.collection("collections");

    if (req.method === "GET" && urlPathAsString && videoId) {
      const collection = await coll.findOne({
        "metadata.urlPath": urlPathAsString.toLowerCase(),
      });
      if (collection) {
        const videos = get(collection, ["videos"]);
        const video = find(videos, (vid) => get(vid, ["id"]) === videoId);
        if (video) {
          return res.status(200).json({ video });
        } else {
          return res.status(404).json({ message: "Video not found." });
        }
      }
    }
  } catch (e: any) {
    console.log(e);
    res.status(500).json({ message: e.message });
  }
};

export default videoInCollection;
