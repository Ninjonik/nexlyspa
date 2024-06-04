import {ID, Permission, Role} from "appwrite";
import {storage} from "./appwrite.ts";

export default async function uploadMultipleFiles(files: File[]) {
    const fileIds = [];
    for (const file of files) {
        const response = await storage.createFile('attachments', ID.unique(), file, [
            Permission.read(Role.any()),
        ]);
        if (response && response.$id) {
            fileIds.push(response.$id);
        } else {
            console.error("Failed to upload file: ", file.name);
        }
    }
    return fileIds;
}