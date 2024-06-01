import RoomObject from "./RoomObject.ts";

export interface UserTarget {
  $id: string;
  $createdAt: string;
  $updatedAt: string;
  name: string;
  userId: string;
  providerId: string | null;
  providerType: string;
  identifier: string;
}

export interface UserAuthObject {
  $id: string;
  $createdAt: string;
  $updatedAt: string;
  name: string;
  registration: string;
  status: boolean;
  labels: string[];
  passwordUpdate: string;
  email?: string | undefined;
  phone: string;
  emailVerification: boolean;
  phoneVerification: boolean;
  mfa: boolean;
  prefs: Record<string, unknown>;
  targets: UserTarget[];
  accessedAt: string;
}

export interface UserObject {
  name: string;
  avatar: string;
  $id: string;
  $createdAt: string;
  $updatedAt: string;
  $permissions: string[];
  rooms: RoomObject[];
  adminRooms: RoomObject[];
  $databaseId: string;
  $collectionId: string;
}

export interface UserCombinedObject extends UserAuthObject, UserObject {}
