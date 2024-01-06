import { getAuth } from "@clerk/nextjs/server";
import { db } from "@/lib/db";

import { NextRequest } from "next/server";
import { NextApiRequest } from "next";

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
