import { database, databases } from "./appwrite.ts";
import { UserObject } from "./interfaces/UserObject.ts";

export const getUserDBData = async (userId: string): Promise<UserObject> => {
  return await databases.getDocument(database, "users", userId);
};
