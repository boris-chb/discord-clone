import { createUploadthing, type FileRouter } from "uploadthing/next";
import { auth as _auth } from "@clerk/nextjs";

const f = createUploadthing();

const auth = () => {
  const { userId } = _auth();
  if (!userId) throw new Error("Unauthorized");

  return { userId };
};

// FileRouter for your app, can contain multiple FileRoutes
export const ourFileRouter = {
  // Define as many FileRoutes as you like, each with a unique routeSlug
  serverImage: f({ image: { maxFileSize: "4MB", maxFileCount: 1 } })
    // Set permissions and file types for this FileRoute
    .middleware(auth)
    .onUploadComplete(async ({ metadata, file }) => {
      // This code RUNS ON YOUR SERVER after upload
      console.log("Upload complete for userId:", metadata.userId);

      console.log("file url", file.url);
    }),
  messageFile: f(["image", "pdf"])
    .middleware(auth)
    .onUploadComplete(() => {}),
} satisfies FileRouter;

export type OurFileRouter = typeof ourFileRouter;
