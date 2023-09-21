import { getCurrentProfileServer } from "@/lib/current-profile-server";
import { db } from "@/lib/db";
import { NextApiRequest } from "next";

export default async function handler(
  req: NextApiRequest,
  res: ServerIoResponse
) {
  if (req.method !== "POST") {
    return res.status(405).json({ error: "Method not allowed" });
  }

  try {
    const profile = await getCurrentProfileServer(req);
    const { body, fileUrl } = req.body;

    const { serverId, channelId } = req.query;

    if (!serverId || !body || !channelId) {
      return res
        .status(400)
        .json({ error: "server/channel ID or message body missing" });
    }

    const server = await db.server.findFirst({
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
    });

    if (!server) {
      return res.status(404).json({ message: "Server not found" });
    }

    const channel = await db.channel.findFirst({
      where: {
        id: channelId as string,
        serverId: serverId as string,
      },
    });

    if (!channel) {
      return res.status(404).json({ message: "Channel not found" });
    }

    const member = server.members.find(
      member => member.profileId === profile?.id
    );

    if (!member) {
      return res.status(404).json({ message: "Member not found" });
    }

    const message = await db.message.create({
      data: {
        body,
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

    const channelKey = `chat:${channelId}:messages`;

    res?.socket?.server?.io?.emit(channelKey, message);

    return res.status(200).json(message);
  } catch (error: any) {
    console.log("/api/socket/messages", error);
    return res.status(500).json({ message: error?.message });
  }
}
