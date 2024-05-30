import { ReactNode, useEffect } from "react";
import checkIfUserLoggedIn from "./utils/checkIfUserLoggedIn.ts";
import { useLocation, useNavigate } from "react-router-dom";

export const ClientWrapper = ({ children }: { children: ReactNode }) => {
  const navigate = useNavigate();
  const currentRoute = useLocation();

  // check if user is logged in
  useEffect(() => {
    const redirectIfUserNotLoggedIn = async () => {
      const userLoggedIn = await checkIfUserLoggedIn();
      console.log(currentRoute.pathname);
      if (!userLoggedIn) navigate("/login");
      if (
        userLoggedIn &&
        ["/login", "/register", "/reset-password"].includes(
          currentRoute.pathname,
        )
      )
        navigate("/");
    };

    redirectIfUserNotLoggedIn();
  }, []);

  return <>{children}</>;
};
