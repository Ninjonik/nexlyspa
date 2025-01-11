import { useEffect } from "react";
import { database, databases } from "../utils/appwrite.ts";
import { useUserContext } from "../utils/UserContext.tsx";

const updateUserHeatbeat = async (userId: string) => {
  await databases.updateDocument(database, "users", userId, {
    lastSeen: new Date(),
  });
};

const HeartbeatService = () => {
  const { user } = useUserContext();

  useEffect(() => {
    const interval = setInterval(() => {
      if (user) {
        console.info("Updating user heartbeat");
        updateUserHeatbeat(user.$id);
      } else {
        console.log("NOT USER:", user);
      }
    }, 60 * 1000);

    return () => clearInterval(interval);
  }, [user]);

  return null;
};

export default HeartbeatService;
