import {storage} from "./appwrite.ts";

export default function getAvatar(fileId: string): string{
    const avatar = storage.getFilePreview(
        "avatars",
        fileId
    )
    return avatar.toString();
}