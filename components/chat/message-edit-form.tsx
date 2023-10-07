"use client";

import { Button } from "@/components/ui/button";
import { Form, FormControl, FormField, FormItem } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { zodResolver } from "@hookform/resolvers/zod";
import axios from "axios";
import queryString from "query-string";
import { useEffect } from "react";
import { useForm } from "react-hook-form";
import { z } from "zod";

interface MessageEditFormProps {
  body: string;
  toggleEdit: (isEditing: boolean) => void;
  id: string;
}
const formSchema = z.object({
  body: z.string().min(1),
});
export default function MessageEditForm({
  body,
  toggleEdit,
  id,
}: MessageEditFormProps) {
  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      body,
    },
  });

  const isLoading = form.formState.isLoading;

  useEffect(
    () => form.reset({ body }),
    // eslint-disable-next-line
    [body]
  );

  const onEditMessage = async (values: z.infer<typeof formSchema>) => {
    try {
      const url = queryString.stringifyUrl({
        url: `/api/messages`,
      });

      await axios.patch(url, values);
      form.reset();
      toggleEdit(false);
    } catch (error) {
      console.log(error);
    }
  };

  return (
    <Form {...form}>
      <form
        className="flex items-center w-full gap-x-2 pt-2"
        onSubmit={form.handleSubmit(onEditMessage)}
      >
        <FormField
          control={form.control}
          name="body"
          render={({ field }) => (
            <FormItem className="flex-1">
              <FormControl>
                <div className="relative w-full">
                  <Input
                    disabled={isLoading}
                    className="p-2 bg-zinc-200/90 dark:bg-zinc-700/75 border-none border-0 focus-visible:ring-0 focus-visible:ring-offset-0 text-zinc-600 dark:text-zinc-200"
                    placeholder="Edited message"
                    {...field}
                  />
                </div>
              </FormControl>
            </FormItem>
          )}
        />
        <Button disabled={isLoading} size="sm" variant="primary">
          Save
        </Button>
      </form>
      <span className="text-[10px] mt-1 text-zinc-400">
        Press ENTER to save or ESC to cancel.
      </span>
    </Form>
  );
}
