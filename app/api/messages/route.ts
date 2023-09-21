import { getCurrentProfile } from "@/lib/current-profile";
import { db } from "@/lib/db";
import { Message } from "@prisma/client";
import { NextRequest, NextResponse } from "next/server";

const MESSAGES_BATCH = 10;

export async function GET(req: NextRequest) {
  try {
    const profile = await getCurrentProfile();
    const { searchParams } = new URL(req.url);

    const cursor = searchParams.get("cursor");
    console.log(cursor);

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
      items: messages,
      nextCursor,
    });
  } catch (error) {
    console.log("/api/messages/", error);
    return new NextResponse("Could not get messages", { status: 500 });
  }
}
