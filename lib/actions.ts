"use server";
import { z } from "zod";

export async function sendMessage(prevState: any, formData: FormData) {
  const schema = z.object({
    body: z.string(),
  });

  console.log("prevState", prevState);
  console.log("form data", formData);
}
