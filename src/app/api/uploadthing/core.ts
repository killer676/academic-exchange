import { createUploadthing, type FileRouter } from "uploadthing/next";

const f = createUploadthing();

// FileRouter for your app, can contain multiple file routes
export const ourFileRouter = {
    // Define as many file routes as you like, each with a unique route slug
    resourceUploader: f({
        pdf: { maxFileSize: "8MB", maxFileCount: 1 },
        image: { maxFileSize: "8MB", maxFileCount: 1 },
        "application/msword": { maxFileSize: "8MB", maxFileCount: 1 },
        "application/vnd.openxmlformats-officedocument.wordprocessingml.document": { maxFileSize: "8MB", maxFileCount: 1 },
        "application/vnd.ms-powerpoint": { maxFileSize: "8MB", maxFileCount: 1 },
        "application/vnd.openxmlformats-officedocument.presentationml.presentation": { maxFileSize: "8MB", maxFileCount: 1 },
    })
        // Set permissions and file types for this file route
        .middleware(async ({ req }) => {
            // This code runs on your server before upload
            // You can add authentication checks here if needed
            return {}; // Whatever is returned here is accessible in onUploadComplete as `metadata`
        })
        .onUploadComplete(async ({ metadata, file }) => {
            // This code runs on your server after upload
            console.log("Upload complete for file:", file.name);
            console.log("File URL:", file.url);

            // Return the file URL to the client
            return { url: file.url };
        }),
} satisfies FileRouter;

export type OurFileRouter = typeof ourFileRouter;
