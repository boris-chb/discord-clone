import { db } from "@/lib/db";

export const getOrCreateChat = async (
  firstMemberId: string,
  secondMemberId: string,
) => {
  let chat =
    (await findChat(firstMemberId, secondMemberId)) ||
    (await findChat(secondMemberId, firstMemberId));

  if (!chat) {
    chat = await createNewChat(firstMemberId, secondMemberId);
  }

  return chat;
};

const findChat = async (firstMemberId: string, secondMemberId: string) => {
  try {
    const chat = await db.chat.findFirst({
      where: {
        AND: [{ firstMemberId }, { secondMemberId }],
      },
      include: {
        firstMember: {
          include: {
            profile: true,
          },
        },
        secondMember: {
          include: {
            profile: true,
          },
        },
      },
    });

    return chat;
  } catch (error) {
    return null;
  }
};

const createNewChat = async (firstMemberId: string, secondMemberId: string) => {
  try {
    const newChat = await db.chat.create({
      data: {
        firstMemberId,
        secondMemberId,
      },
      include: {
        firstMember: {
          include: {
            profile: true,
          },
        },
        secondMember: {
          include: {
            profile: true,
          },
        },
      },
    });

    return newChat;
  } catch (error) {
    return null;
  }
};
