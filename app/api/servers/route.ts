import { getCurrentProfile } from "@/lib/current-profile";
import { db } from "@/lib/db";
import { MemberRole } from "@prisma/client";
import { NextRequest, NextResponse } from "next/server";
import { v4 as uuidv4, v4 } from "uuid";

export async function POST(req: NextRequest) {
  try {
    const { name, imageUrl } = await req.json();
    const profile = await getCurrentProfile();
    if (!profile) {
      return new NextResponse("Unauthorized", { status: 401 });
    }

    const server = await db.server.create({
      data: {
        id: v4().slice(0, 8),
        profileId: profile.id,
        name,
        imageUrl,
        inviteCode: uuidv4().slice(0, 8),
        channels: {
          create: [{ name: "general", profileId: profile.id }],
        },
        members: {
          create: [{ profileId: profile.id, role: MemberRole.ADMIN }],
        },
      },
    });

    return NextResponse.json(server);
  } catch (e) {
    console.log("Could not create server");
    return new NextResponse("INTERNAL ERROR", { status: 500 });
  }
}
