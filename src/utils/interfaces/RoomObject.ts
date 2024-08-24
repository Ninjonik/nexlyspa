import MessageObject from "./MessageObject.ts";
import { UserObject } from "./UserObject.ts";

export default interface RoomObject {
  name: string;
  closed: boolean;
  description: string;
  avatar: string;
  call: boolean;
  users: UserObject[];
  admin?: UserObject;
  $id: string;
  $createdAt: string;
  $updatedAt: string;
  $permissions: string[];
  messages: MessageObject[];
  $databaseId: string;
  $collectionId: string;
}

export interface RoomObjectArray {
  [roomId: string]: RoomObject;
}

export interface RoomObjectArray {}
