import { getCurrentProfileServer } from "@/lib/current-profile-server";
import { getCurrentProfile } from "@/lib/current-profile";
import { NextRequest, NextResponse } from "next/server";
import { MemberRole } from "@prisma/client";
import { revalidatePath } from "next/cache";
import { v4 as uuidv4, v4 } from "uuid";
import { db } from "@/lib/db";

export async function GET(req: NextRequest) {
  const profile = await getCurrentProfileServer(req);

  try {
    const servers = await db.server.findMany({
      where: {
        members: {
          some: {
            // we always have a profile since we go through set up on '/'
            // if they don't have one, we always create it, profile can't be null!
            profileId: profile!.id,
          },
        },
      },
      include: {
        channels: {
          where: {
            name: "general",
          },
          orderBy: {
            createdAt: "asc",
          },
        },
      },
    });

    return NextResponse.json({ servers }, { status: 200 });
  } catch (error) {
    console.log("Error fetching servers", error);
  }
}

export async function POST(req: NextRequest) {
  try {
    const { name, imageUrl } = await req.json();
    const profile = await getCurrentProfile();
    if (!profile) {
      return new NextResponse("Unauthorized", { status: 401 });
    }

    const server = await db.server.create({
      data: {
        profileId: profile.id,
        name,
        imageUrl,
        inviteCode: uuidv4().slice(0, 8),
        channels: {
          create: [{ name: "general", profileId: profile.id }],
        },
        members: {
          create: [{ profileId: profile.id, role: MemberRole.Admin }],
        },
      },
    });

    // revalidatePath(`/`);
    return NextResponse.json(server);
  } catch (e) {
    console.log("Could not create server", e);
    return new NextResponse("Could not Create Server", { status: 500 });
  }
}
