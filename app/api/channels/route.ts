import { getCurrentProfile } from "@/lib/current-profile";
import { db } from "@/lib/db";
import { MemberRole } from "@prisma/client";
import { NextRequest, NextResponse } from "next/server";
import { v4 } from "uuid";

export async function POST(req: NextRequest) {
  try {
    const profile = await getCurrentProfile();
    const { name, type } = await req.json();
    const { searchParams } = new URL(req.url);

    const serverId = searchParams.get("serverId");

    if (!profile || !serverId || name.toLowerCase() === "general")
      return new NextResponse("Something went wrong", { status: 400 });

    const server = await db.server.update({
      where: {
        id: serverId,
        members: {
          some: {
            profileId: profile.id,
            role: {
              in: [MemberRole.Admin, MemberRole.Moderator],
            },
          },
        },
      },
      data: {
        channels: {
          create: {
            id: v4().slice(0, 8),
            profileId: profile.id,
            name,
            type,
          },
        },
      },
    });

    return NextResponse.json(server);
  } catch (error) {
    console.log("[POST] /api/channels/", error);
    return new NextResponse("Could not create channel", { status: 500 });
  }
}
