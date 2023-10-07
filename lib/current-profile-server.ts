import { db } from "@/lib/db";
import { getAuth } from "@clerk/nextjs/server";

import { NextApiRequest } from "next";
import { NextRequest } from "next/server";

export const getCurrentProfileServer = async (req: NextRequest) => {
  const { userId } = getAuth(req);

  if (!userId) return null;

  const profile = await db.profile.findUnique({
    where: {
      userId,
    },
  });

  return profile;
};
