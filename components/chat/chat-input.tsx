"use client";

import { useSocket } from "@/components/providers/socket-provider";
import { Button } from "@/components/ui/button";
import { Form, FormControl, FormField, FormItem } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { useChatStore } from "@/state/store";
import { zodResolver } from "@hookform/resolvers/zod";
import axios from "axios";
import { ArrowRightCircle, Plus, Smile } from "lucide-react";
import queryString from "query-string";
import { useEffect } from "react";
import { useForm } from "react-hook-form";
import * as z from "zod";

interface ChatInputProps {
  apiUrl: string;
  name: string;
  serverId: string;
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
  serverId,
  type,
}: ChatInputProps) {
  const { socket } = useSocket();
  const { addMessage, addDm } = useChatStore();
  const form = useForm<z.infer<typeof formSchema>>({
    defaultValues: {
      body: "",
    },
    resolver: zodResolver(formSchema),
  });

  const roomId = `${type}:${id}`;

  // join chat room
  useEffect(() => {
    socket?.emit("join-room", roomId);

    return () => {
      socket?.emit("leave-room", roomId);
    };

    //eslint-disable-next-line
  }, [roomId]);

  const onSubmit = async (values: z.infer<typeof formSchema>) => {
    try {
      const url = queryString.stringifyUrl({
        url: apiUrl,
        query: { serverId, channelId: id },
      });

      form.reset();

      const { data: message } = await axios.post(url, {
        serverId,
        chatId: id,
        ...values,
      });

      if (type === "channel") {
        addMessage(message);
      } else if (type === "chat") {
        addDm(message);
      }

      console.log("emitting message", message, roomId);
      socket?.emit(`send-message`, { message, roomId });
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
