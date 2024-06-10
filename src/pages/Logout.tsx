import { FullscreenMessage } from "../components/FullscreenMessage.tsx";
import { useEffect } from "react";
import { useUserContext } from "../utils/UserContext.tsx";
import { useNavigate } from "react-router-dom";

export const Logout = () => {
  const { logoutUser } = useUserContext();
  const navigate = useNavigate();

  useEffect(() => {
    const handleLogoutUser = async () => {
      await logoutUser();
      navigate("/login");
    };
    handleLogoutUser();
  }, []);

  return <FullscreenMessage message="Logging you out..." loading={true} />;
};
