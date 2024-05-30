import { UserObject } from "./UserObject.ts";
import RoomObject from "./RoomObject.ts";

export default interface MessageObject {
  $id: string;
  $createdAt: string;
  $updatedAt: string;
  $permissions: string[];
  author: UserObject;
  room: RoomObject;
  message: string | null;
  attachments: string[];
  $databaseId: string;
  $collectionId: string;
}
