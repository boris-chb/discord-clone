"use client";

import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";

import { Button } from "@/components/ui/button";

import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";

import FileUpload from "@/components/file-upload";

import { zodResolver } from "@hookform/resolvers/zod";
import { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import * as z from "zod";
import { Input } from "../ui/input";
import { cn } from "@/lib/utils";
import axios from "axios";
import { useRouter } from "next/navigation";

const formSchema = z.object({
  name: z.string().min(1, { message: "Server name is required." }),
  imageUrl: z.string().min(1, {
    message: "Server image is required.",
  }),
});

interface InitialModalProps {}

const InitialModal: React.FC<InitialModalProps> = () => {
  const [isMounted, setIsMounted] = useState(false);
  const router = useRouter();

  const form = useForm({
    resolver: zodResolver(formSchema),
    defaultValues: {
      name: "",
      imageUrl: "",
    },
  });

  useEffect(() => setIsMounted(true), []);

  if (!isMounted) return null;

  const isLoading = form.formState.isSubmitting;

  const onSubmit = async (values: z.infer<typeof formSchema>) => {
    try {
      await axios.post("/api/server", values);
      form.reset();
      router.refresh();
      window.location.reload();
    } catch (e) {
      console.log(e);
    }
  };

  return (
    <Dialog open>
      <DialogContent className="bg-white text-black overflow-hidden">
        <DialogHeader className="pt-8 px-6">
          <DialogTitle className="text-2xl text-center font-bold">
            Set up your server
          </DialogTitle>
          <DialogDescription>
            Give your server a personality by choosing a name and cover image.
          </DialogDescription>
        </DialogHeader>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
            <div className="space-y-8 px-6">
              <div className="flex items-center justify-center text-center">
                <FormField
                  control={form.control}
                  name="imageUrl"
                  render={({ field }) => (
                    <FormItem>
                      <FormControl>
                        <FileUpload
                          endpoint="serverImage"
                          value={field.value}
                          onChange={field.onChange}
                        />
                      </FormControl>
                    </FormItem>
                  )}
                />
              </div>
              <FormField
                control={form.control}
                name="name"
                render={({ field, fieldState }) => (
                  <FormItem>
                    <FormLabel className="uppercase text-xs font-bold text-zinc-500 dark:text-secondary/70 pl-1">
                      Server Name
                    </FormLabel>
                    <FormControl>
                      <Input
                        className={cn(
                          "bg-zinc-300/50 focus-visible:ring-0 text-black focus-visible:ring-offset-0 border-0",
                          fieldState.invalid && "border border-red-800"
                        )}
                        disabled={isLoading}
                        placeholder="Choose a name for your server"
                        {...field}
                      />
                    </FormControl>
                    <FormMessage className="text-xs text-red-800" />
                  </FormItem>
                )}
              />
            </div>
            <DialogFooter className="bg-gray-100 px-6 py-4">
              <Button variant={"primary"} disabled={isLoading}>
                Create
              </Button>
            </DialogFooter>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
};

export default InitialModal;
