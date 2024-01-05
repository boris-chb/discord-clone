import { getCurrentProfile } from "@/lib/current-profile";
import { db } from "@/lib/db";
import { MemberRole } from "@prisma/client";
import { NextRequest, NextResponse } from "next/server";

export async function PATCH(
  req: NextRequest,
  { params: { channelId } }: { params: { channelId: string } }
) {
  try {
    const { searchParams } = new URL(req.url);
    const { name, type } = await req.json();

    const profile = await getCurrentProfile();
    const serverId = searchParams.get("serverId");

    if (!profile) return new NextResponse("Unauthorized", { status: 401 });
    if (!serverId) return new NextResponse("ServerID missing", { status: 400 });
    if (!channelId) return new NextResponse("Channel missing", { status: 400 });
    if (name === "general")
      return new NextResponse('Name cannot be "General"', { status: 400 });

    const server = await db.server.update({
      where: {
        id: serverId,
        members: {
          some: {
            profileId: profile.id,
            role: { in: [MemberRole.Admin, MemberRole.Moderator] },
          },
        },
      },
      data: {
        channels: {
          update: {
            where: {
              id: channelId,
              NOT: {
                name: "general",
              },
            },
            data: {
              name,
              type,
            },
          },
        },
      },
    });

    return NextResponse.json(server);
  } catch (error) {
    console.log("Could not UPDATE channel", error);
    return new NextResponse("Internal Server Error", { status: 500 });
  }
}

export async function DELETE(
  req: NextRequest,
  { params: { channelId } }: { params: { channelId: string } }
) {
  try {
    const { searchParams } = new URL(req.url);

    const profile = await getCurrentProfile();
    const serverId = searchParams.get("serverId");

    if (!profile) return new NextResponse("Unauthorized", { status: 401 });
    if (!serverId) return new NextResponse("ServerID missing", { status: 400 });
    if (!channelId) return new NextResponse("Channel missing", { status: 400 });

    const server = await db.server.update({
      where: {
        id: serverId,
        members: {
          some: {
            profileId: profile.id,
            role: { in: [MemberRole.Admin, MemberRole.Moderator] },
          },
        },
      },
      data: {
        channels: {
          delete: {
            id: channelId,
            name: {
              not: "general",
            },
          },
        },
      },
    });

    return NextResponse.json(server);
  } catch (error) {
    console.log("Could not DELETE channel", error);
    return new NextResponse("Internal Server Error", { status: 500 });
  }
}
