import { useEffect, useRef } from "react";
import { database, databases } from "../utils/appwrite.ts";
import { useUserContext } from "../utils/UserContext.tsx";

const updateUserHeatbeat = async (userId: string) => {
  await databases.updateDocument(database, "users", userId, {
    lastSeen: new Date(),
  });
};

const HeartbeatService = () => {
  const { user } = useUserContext();
  const hasInitialized = useRef(false);

  const updateHeartbeat = async () => {
    if (user) {
      console.info("Updating user heartbeat");
      await updateUserHeatbeat(user.$id);
    } else {
      console.log("NOT USER:", user);
    }
  };

  useEffect(() => {
    if (!user || !user.$id) return;

    if (!hasInitialized.current) {
      updateHeartbeat();
      hasInitialized.current = true;
    }

    const interval = setInterval(updateHeartbeat, 60 * 1000);

    return () => clearInterval(interval);
  }, [user?.$id]);

  return null;
};

export default HeartbeatService;
