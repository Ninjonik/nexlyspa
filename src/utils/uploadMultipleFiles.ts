import { ID, Permission, Role } from "appwrite";
import { storage } from "./appwrite.ts";
import fireToast from "./fireToast.ts";

export default async function uploadMultipleFiles(files: File[]) {
  const fileIds = [];
  for (const file of files) {
    try {
      const response = await storage.createFile(
        "attachments",
        ID.unique(),
        file,
        [Permission.read(Role.any())],
      );
      if (response && response.$id) {
        fileIds.push(response.$id);
      } else {
        throw new Error("Failed to upload file");
      }
    } catch (e) {
      fireToast(
        "error",
        `${file.name} couldn't be uploaded due to being an unsupported file type.`,
      );
      console.error("Failed to upload file: ", file.name);
    }
  }
  return fileIds;
}
