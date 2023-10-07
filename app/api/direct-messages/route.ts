import { getCurrentProfileServer } from "@/lib/current-profile-server";
import { db } from "@/lib/db";
import { revalidatePath } from "next/cache";
import { NextRequest, NextResponse } from "next/server";

export async function GET(req: NextRequest) {
  console.log(req);
  return NextResponse.json({}, { status: 200 });
}

export async function POST(req: NextRequest, res: NextResponse) {
  // TODO: use zod for validation
  try {
    const profile = await getCurrentProfileServer(req);
    const { body, chatId, memberId, serverId } = await req.json();

    if (!profile) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    if (!chatId) {
      return NextResponse.json({ error: "Chat ID missing" }, { status: 400 });
    }

    if (!body) {
      return NextResponse.json({ error: "Body missing" }, { status: 400 });
    }

    const chat = await db.chat.findFirst({
      where: {
        id: chatId,
        OR: [
          {
            firstMember: {
              profileId: profile.id,
            },
          },
          {
            secondMember: {
              profileId: profile.id,
            },
          },
        ],
      },
      include: {
        firstMember: {
          include: {
            profile: true,
          },
        },
        secondMember: {
          include: { profile: true },
        },
      },
    });

    if (!chat) {
      return NextResponse.json({ error: "Chat not found" }, { status: 404 });
    }

    const interlocutor =
      chat.firstMember.profileId === profile.id
        ? chat.secondMember
        : chat.firstMember;

    const dm = await db.directMessage.create({
      data: {
        body,
        memberId: interlocutor.id,
        chatId,
      },
      include: { member: { include: { profile: true } } },
    });

    return NextResponse.json(dm, { status: 200 });
  } catch (error) {}
}
