import { FullscreenMessage } from "../components/FullscreenMessage.tsx";
import { useEffect } from "react";
import { useUserContext } from "../utils/UserContext.tsx";
import { redirect } from "react-router-dom";

export const Logout = () => {
  const { logoutUser } = useUserContext();

  useEffect(() => {
    const handleLogoutUser = async () => {
      await logoutUser();
      redirect("/login");
    };
    handleLogoutUser();
  }, []);

  return <FullscreenMessage message="Logging you out..." loading={true} />;
};
