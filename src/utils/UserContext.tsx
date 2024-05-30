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

interface UserContextState {
  user: UserCombinedObject | null;
  setUser: React.Dispatch<React.SetStateAction<UserCombinedObject | null>>;
}

interface UserContextProps {
  children: ReactNode;
}

const UserContext = createContext<UserContextState | null>(null);

export const useUserContext = () => {
  const context = useContext(UserContext);
  if (!context) {
    throw new Error("useUserContext must be used within a UserContextProvider");
  }
  return context;
};

export const UserContextProvider = ({ children }: UserContextProps) => {
  const [user, setUser] = useState<UserCombinedObject | null>(null);

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
    } catch (e) {
      return console.info("user not logged in");
    }
  };

  useEffect(() => {
    initializeUserData();
  }, []);

  return (
    <UserContext.Provider value={{ user, setUser }}>
      {children}
    </UserContext.Provider>
  );
};
