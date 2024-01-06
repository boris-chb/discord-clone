import { getCurrentProfileServer } from "@/lib/current-profile-server";
import { getCurrentProfile } from "@/lib/current-profile";
import { NextRequest, NextResponse } from "next/server";
import { MemberRole, Message } from "@prisma/client";
import { revalidatePath } from "next/cache";
import { db } from "@/lib/db";

const MESSAGES_BATCH = 10;

type CheckMissingParam = (
  param: unknown,
  paramName: string,
) => NextResponse | undefined;

const checkMissingParam: CheckMissingParam = (param, paramName) => {
  if (!param) {
    return NextResponse.json(
      { error: `${paramName} missing` },
      { status: 400 },
    );
  }
};

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
    console.time(`\n${"-".repeat(10)}\nsendMessage\n${"-".repeat(10)}`);

    // {channelId => '123', serverId => '234'}
    console.log(req.nextUrl.searchParams);
    const serverId = req.nextUrl.searchParams.get("serverId");
    const channelId = req.nextUrl.searchParams.get("channelId");
    const { fileUrl, body: messageBody } = await req.json();
    const profile = await getCurrentProfileServer(req);

    checkMissingParam(profile, "Profile");

    checkMissingParam(serverId, "Server ID");

    checkMissingParam(channelId, "Server ID");

    checkMissingParam(messageBody, "Message Body");

    const [server, channel] = await Promise.all([
      db.server.findFirst({
        where: {
          id: serverId as string,
          members: {
            some: {
              profileId: profile!.id,
            },
          },
        },
        include: {
          members: true,
        },
      }),
      db.channel.findFirst({
        where: {
          id: channelId as string,
          serverId: serverId as string,
        },
      }),
    ]);

    if (!server || !channel) {
      return NextResponse.json(
        { error: "Server or Channel not found" },
        { status: 404 },
      );
    }

    const member = server.members.find(
      member => member.profileId === profile!.id,
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
    console.timeEnd(`\n${"-".repeat(10)}\nsendMessage\n${"-".repeat(10)}`);
    return NextResponse.json(message, { status: 200 });
  } catch (error) {
    console.log("Could store message in db\n", error);
  }
}

export async function PATCH(req: NextRequest) {
  const { body } = await req.json();
  const { searchParams } = new URL(req.url);
  const messageId = searchParams.get("messageId") as string;
  const serverId = searchParams.get("serverId") as string;

  try {
    const profile = await getCurrentProfileServer(req);

    if (!profile) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const member = await db.member.findFirst({
      where: {
        profileId: profile.id,
        serverId,
      },
    });

    console.log(member?.profileId);
    console.log(profile.id);

    if (member?.profileId !== profile.id) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const updatedMsg = await db.message.update({
      data: {
        body,
      },
      where: {
        id: messageId,
      },
    });

    return NextResponse.json({ updatedMsg }, { status: 200 });
  } catch (e) {
    console.log(
      `\n\n[PATCH] /api/message\n messageId=${messageId}\nserverId=${serverId}\n\n`,
      e,
    );
    return NextResponse.json(
      {
        messageId,
        serverId,
      },
      { status: 500 },
    );
  }
}

export async function DELETE(req: NextRequest) {
  const { searchParams } = new URL(req.url);
  const messageId = searchParams.get("messageId") as string;
  const serverId = searchParams.get("serverId") as string;

  try {
    const profile = await getCurrentProfileServer(req);

    if (!profile) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const member = await db.member.findFirst({
      where: {
        profileId: profile.id,
        serverId,
      },
    });

    if (!member) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    if (
      member.role !== MemberRole.Admin &&
      member.role !== MemberRole.Moderator
    ) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const foundMsg = await db.message.delete({
      where: {
        id: messageId as string,
      },
    });

    return NextResponse.json({ foundMsg }, { status: 200 });
  } catch (e) {
    console.log(
      `\n\n[DELETE] /api/message\n messageId=${messageId}\nserverId=${serverId}\n\n`,
      e,
    );
    return NextResponse.json(
      {
        messageId,
        serverId,
      },
      { status: 500 },
    );
  }

  // return { status: 400 };
}
