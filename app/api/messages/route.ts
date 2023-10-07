import { getCurrentProfile } from "@/lib/current-profile";
import { getCurrentProfileServer } from "@/lib/current-profile-server";
import { db } from "@/lib/db";
import { Message } from "@prisma/client";
import { NextRequest, NextResponse } from "next/server";

const MESSAGES_BATCH = 10;

export async function GET(req: NextRequest) {
  try {
    const profile = await getCurrentProfile();
    const { searchParams } = new URL(req.url);
    const cursor = searchParams.get("cursor");
    const channelId = searchParams.get("channelId");

    let messages: Message[] = [];

    if (cursor) {
      messages = await db.message.findMany({
        take: MESSAGES_BATCH,
        skip: 1,
        cursor: {
          id: cursor,
        },
        where: {
          channelId: channelId!,
          member: { profile: { id: profile!.id } },
        },
        include: {
          member: {
            include: {
              profile: true,
            },
          },
        },
        orderBy: {
          createdAt: "asc",
        },
      });
    } else {
      messages = await db.message.findMany({
        take: MESSAGES_BATCH,
        where: {
          channelId: channelId as string,
        },
        include: {
          member: {
            include: {
              profile: true,
            },
          },
        },
        orderBy: {
          createdAt: "desc",
        },
      });
    }

    let nextCursor = null;

    if (messages.length === MESSAGES_BATCH) {
      nextCursor = messages[MESSAGES_BATCH - 1].id;
    }
    return NextResponse.json({
      messages,
      nextCursor,
    });
  } catch (error) {
    console.log("/api/messages/", error);
    return new NextResponse("Could not get messages", { status: 500 });
  }
}

export async function POST(req: NextRequest) {
  try {
    console.log(req.nextUrl.searchParams);
    const serverId = req.nextUrl.searchParams.get("serverId");
    const channelId = req.nextUrl.searchParams.get("channelId");
    const profile = await getCurrentProfileServer(req);
    const { fileUrl, body: messageBody } = await req.json();

    if (!profile) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    if (!serverId) {
      return NextResponse.json({ error: "Server ID missing" }, { status: 400 });
    }

    if (!channelId) {
      return NextResponse.json(
        { error: "Channel ID missing" },
        { status: 400 }
      );
    }

    if (!messageBody) {
      return NextResponse.json(
        { error: "Message body missing" },
        { status: 400 }
      );
    }

    const server = await db.server.findFirst({
      where: {
        id: serverId as string,
        members: {
          some: {
            profileId: profile.id,
          },
        },
      },
      include: {
        members: true,
      },
    });

    if (!server) {
      return NextResponse.json({ error: "Server not found" }, { status: 404 });
    }

    const channel = await db.channel.findFirst({
      where: {
        id: channelId as string,
        serverId: serverId as string,
      },
    });

    if (!channel) {
      return NextResponse.json({ error: "Channel not found" }, { status: 404 });
    }

    const member = server.members.find(
      member => member.profileId === profile.id
    );

    if (!member) {
      return NextResponse.json({ error: "Member not found" }, { status: 404 });
    }

    const message = await db.message.create({
      data: {
        body: messageBody,
        fileUrl,
        channelId: channelId as string,
        memberId: member.id,
      },
      include: {
        member: {
          include: {
            profile: true,
          },
        },
      },
    });

    // const channelKey = `chat:${channelId}:messages`;

    return NextResponse.json(message, { status: 200 });
  } catch (error) {
    console.log("Could store message in db\n", error);
  }
}
