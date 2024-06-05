import { storage } from "./appwrite.ts";

export default function getFileDownload(bucket: string, file: string) {
  const response = storage.getFileDownload(bucket, file);
  if (response && response.href) {
    return response.href;
  } else {
    console.error("Failed to get file download: ", file);
    return null;
  }
}
