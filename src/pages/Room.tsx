import { useNavigate, useParams } from "react-router-dom";
import {FullscreenLoading} from "../components/FullscreenLoading.tsx";
import {useEffect, useState} from "react";
import RoomObject from "../utils/interfaces/RoomObject.ts";
import {useRoomsContext} from "../utils/RoomsContext.tsx";

export const Room = () => {
  const navigate = useNavigate();
  const { roomId } = useParams();
  const [room, setRoom] = useState<null | RoomObject>(null);
  const {rooms} = useRoomsContext();

  useEffect(() => {
    if (roomId && rooms && rooms[roomId]){
      setRoom(rooms[roomId])
    }
  }, [rooms]);

  if(!roomId) {
    navigate("/");
    return <FullscreenLoading />;
  }

  if(!room) return <FullscreenLoading />;

  return (
    <section
      className={"grid grid-cols-12 grid-rows-12"}
    >
      <nav className={"col-span-12 row-span-1 flex flex-row"}>
        <h2 className={"text-center"}>Room: {room.name}</h2>
      </nav>
    </section>
  );
};
