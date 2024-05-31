import React, {
  createContext,
  useContext,
  ReactNode,
  useState,
  useEffect,
} from "react";
import { account } from "./appwrite.ts";
import { getUserDBData } from "./getUserDBData.ts";
import {
  UserAuthObject,
  UserCombinedObject,
  UserObject,
} from "./interfaces/UserObject.ts";
import { useLocation, useNavigate } from "react-router-dom";
import { deleteSessions } from "./deleteSessions.ts";

interface UserContextState {
  user: UserCombinedObject | null;
  setUser: React.Dispatch<React.SetStateAction<UserCombinedObject | null>>;
  logout: () => Promise<void>;
  getUserData: (userAccount: UserAuthObject) => Promise<void>;
}

interface UserContextProps {
  children: ReactNode;
}

const noAuthRequiredRoutes = [
  "/login",
  "/login/anonymous",
  "/register",
  "/reset-password",
];

const UserContext = createContext<UserContextState | undefined>(undefined);

export const useUserContext = () => {
  const context = useContext(UserContext);
  if (!context) {
    throw new Error("useUserContext must be used within a UserContextProvider");
  }
  return context;
};

export const UserContextProvider = ({ children }: UserContextProps) => {
  const [user, setUser] = useState<UserCombinedObject | null>(null);
  const navigate = useNavigate();
  const currentRoute = useLocation();
  const currentPage = currentRoute.pathname;

  const logout = async () => {
    await deleteSessions();
    navigate("/login");
  };

  const initializeUserData = async () => {
    try {
      const userAccount: UserAuthObject =
        (await account.get()) as UserAuthObject;
      const userDBData: UserObject = await getUserDBData(userAccount.$id);
      const combinedUserObject: UserCombinedObject = {
        ...userAccount,
        ...userDBData,
      };
      setUser(combinedUserObject);
      if (noAuthRequiredRoutes.includes(currentPage)) navigate("/");
    } catch (e) {
      if (!noAuthRequiredRoutes.includes(currentPage)) navigate("/login");
      return console.info("user not logged in");
    }
  };

  const getUserData = async (userAccount: UserAuthObject) => {
    try {
      const userDBData: UserObject = await getUserDBData(userAccount.$id);
      const combinedUserObject: UserCombinedObject = {
        ...userAccount,
        ...userDBData,
      };
      setUser(combinedUserObject);
    } catch (e) {
      if (!noAuthRequiredRoutes.includes(currentPage)) navigate("/login");
      console.info("user not logged in");
      return;
    }
  };

  useEffect(() => {
    initializeUserData();
  }, []);

  // if (noAuthRequiredRoutes.includes(currentPage)) return children;

  return (
    <UserContext.Provider value={{ user, setUser, logout, getUserData }}>
      {children}
    </UserContext.Provider>
  );
};
