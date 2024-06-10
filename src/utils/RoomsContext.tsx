import React, {
  createContext,
  useContext,
  ReactNode,
  useState,
  useEffect,
} from "react";
import RoomObject, { RoomObjectArray } from "./interfaces/RoomObject.ts";
import { useUserContext } from "./UserContext.tsx";
import { client, database } from "./appwrite.ts";

interface RoomsContextState {
  rooms: RoomObjectArray | null;
  setRooms: React.Dispatch<React.SetStateAction<RoomObjectArray | null>>;
}

interface RoomsContextProps {
  children: ReactNode;
}

const RoomsContext = createContext<RoomsContextState | undefined>(undefined);

export const useRoomsContext = () => {
  const context = useContext(RoomsContext);
  if (!context) {
    throw new Error("useUserContext must be used within a UserContextProvider");
  }
  return context;
};

export const RoomsContextProvider = ({ children }: RoomsContextProps) => {
  const { user } = useUserContext();
  const [rooms, setRooms] = useState<RoomObjectArray | null>(null);

  useEffect(() => {
    // Save the initial rooms to the object
    if (user && user.rooms) {
      const transformedRooms: RoomObjectArray = {};
      user.rooms.forEach((room: RoomObject) => {
        transformedRooms[room.$id] = room;
      });
      setRooms(transformedRooms);
    }
  }, [user?.rooms]);

  useEffect(() => {
    const unsubscribeRooms = client.subscribe(
      `databases.${database}.collections.rooms.documents`,
      (response) => {
        const payload = response.payload as RoomObject;

        const roomId = payload.$id;
        setRooms((prevRooms) => ({
          ...prevRooms,
          [roomId]: payload,
        }));
      },
    );

    return () => {
      unsubscribeRooms();
    };
  }, []);

  return (
    <RoomsContext.Provider value={{ rooms, setRooms }}>
      {children}
    </RoomsContext.Provider>
  );
};
