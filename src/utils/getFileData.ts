import { Models } from "appwrite";
import { storage } from "./appwrite.ts";

export interface getFileDataResult {
  preview: string | null;
  file: Models.File | null;
  extension: string | null;
}

export default async function getFileData(
  bucket: string,
  file: string,
): Promise<getFileDataResult> {
  const responsePreview = storage.getFilePreview(bucket, file);
  const responseFile = await storage.getFile(bucket, file);
  const fileExtension =
    responseFile.name.split(".").pop()?.toLowerCase() || "png";
  if (responsePreview && responsePreview.href && responseFile) {
    return {
      preview: responsePreview.href,
      file: responseFile,
      extension: fileExtension,
    };
  } else {
    console.error("Failed to get file preview: ", file);
    return {
      preview: null,
      file: null,
      extension: null,
    };
  }
}
