"use client";

import { Form, FormControl, FormField, FormItem } from "@/components/ui/form";
import { useSocket } from "@/components/providers/socket-provider";
import { ArrowRightCircle, Plus, Smile } from "lucide-react";
import { zodResolver } from "@hookform/resolvers/zod";
import { Member, Profile } from "@prisma/client";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useChatStore } from "@/state/store";
import { useParams } from "next/navigation";
import { useForm } from "react-hook-form";
import queryString from "query-string";
import axios from "axios";
import { v4 } from "uuid";
import * as z from "zod";

interface ChatInputProps {
  apiUrl: string;
  name: string;
  serverId: string;
  currentUser: Member & { profile: Profile };
  id: string;
  type: "chat" | "channel";
}

const formSchema = z.object({
  body: z.string().min(1),
});

export default function ChatInput({
  apiUrl,
  name,
  id,
  type,
  currentUser,
}: ChatInputProps) {
  const { socket } = useSocket();
  const { addMessage, addDm } = useChatStore();
  const form = useForm<z.infer<typeof formSchema>>({
    defaultValues: {
      body: "",
    },
    resolver: zodResolver(formSchema),
  });

  const { serverId, channelId }: { serverId: string; channelId: string } =
    useParams();

  const onSubmit = async (values: z.infer<typeof formSchema>) => {
    try {
      const body = form.getValues("body");
      const msg = {
        id: v4(),
        body,
        fileUrl: "",
        createdAt: new Date(),
        updatedAt: new Date(),
        deleted: false,
        isUpdated: false,
        channelId,
        memberId: currentUser.id,
        member: currentUser,
      };

      socket?.emit("send-message", msg);
      addMessage(msg);
      form.reset();

      const url = queryString.stringifyUrl({
        url: apiUrl,
        query: { serverId, channelId: id },
      });

      const { data: message } = await axios.post(url, {
        serverId,
        chatId: id,
        body,
      });
    } catch (error) {
      console.log(error);
    }
  };

  return (
    <Form {...form}>
      <form
        // action={}
        onSubmit={form.handleSubmit(onSubmit)}
      >
        <FormField
          control={form.control}
          name="body"
          render={({ field, formState }) => (
            <FormItem>
              <FormControl>
                <div className="relative p-4 pb-6">
                  <Button
                    onClick={() => {}}
                    className="absolute top-7 left-8 h-[24px] w-[24px] bg-zinc-500 dark:bg-zinc-400 hover:bg-zinc-600 dark:hover:bg-zinc-300 transition rounded-full p-1 flex items-center justify-center"
                  >
                    <Plus className="text-white dark:text-black" />
                  </Button>
                  <Input
                    autoComplete="off"
                    disabled={formState.isLoading}
                    className="px-14 py-6 bg-zinc-200/90 dark:bg-zinc-700/75 border-none focus-visible:ring-0 focus-visible:ring-offset-0 text-zinc-600 dark:text-zinc-200"
                    placeholder={`Message ${
                      type === "chat" ? name : "#" + name
                    }`}
                    {...field}
                  />
                  <div className="absolute top-7 right-8">
                    {field.value ? (
                      <ArrowRightCircle
                        size={28}
                        className="text-indigo-400/80 cursor-pointer hover:text-indigo-600 transition"
                        onClick={form.handleSubmit(onSubmit)}
                      />
                    ) : (
                      <Smile />
                    )}
                  </div>
                </div>
              </FormControl>
            </FormItem>
          )}
        />
      </form>
    </Form>
  );
}
