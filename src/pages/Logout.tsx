import { FullscreenMessage } from "../components/FullscreenMessage.tsx";
import { useEffect } from "react";
import { useUserContext } from "../utils/UserContext.tsx";

export const Logout = () => {
  const { logout } = useUserContext();

  useEffect(() => {
    const logoutUser = async () => {
      logout();
    };
    logoutUser();
  }, []);

  return <FullscreenMessage message="Logging you out..." loading={true} />;
};
