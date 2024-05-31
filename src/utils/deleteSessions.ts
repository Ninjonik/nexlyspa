import { account } from "./appwrite.ts";

export const deleteSessions = async () => {
  try {
    await account.deleteSessions();
  } catch (error) {
    /* empty */
  }
};
