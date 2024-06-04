import { useNavigate, useParams } from "react-router-dom";
import { FullscreenLoading } from "../components/FullscreenLoading.tsx";
import { useEffect, useState } from "react";
import RoomObject from "../utils/interfaces/RoomObject.ts";
import { useRoomsContext } from "../utils/RoomsContext.tsx";
import Avatar from "../components/Avatar.tsx";
import { MdCall } from "react-icons/md";
import { FaUsers } from "react-icons/fa6";
import { IoMdExit } from "react-icons/io";
import { Textarea } from "../components/Room/TextArea.tsx";

export const Room = () => {
  const navigate = useNavigate();
  const { roomId } = useParams();
  const [room, setRoom] = useState<null | RoomObject>(null);
  const { rooms } = useRoomsContext();

  useEffect(() => {
    if (roomId && rooms && rooms[roomId]) {
      setRoom(rooms[roomId]);
    }
  }, [rooms, roomId]);

  if (!roomId) {
    navigate("/");
    return <FullscreenLoading />;
  }

  if (!room) return <FullscreenLoading />;

  return (
    <section
      className={"grid grid-cols-12 grid-rows-12 w-full h-full overflow-hidden"}
    >
      <nav
        className={
          "col-span-12 row-span-1 flex flex-row p-2 items-center mx-12 justify-between"
        }
      >
        <div className={"flex flex-row gap-4"}>
          <Avatar />
          <div className={"flex flex-col text-start justify-center"}>
            <h3 className={"text-primary font-bold"}>{room.name}</h3>
            <h4>{room.description}</h4>
          </div>
        </div>
        <div className={"flex flex-row items-center gap-4"}>
          <a title={"Call"} className={"text-4xl"}>
            <MdCall />
          </a>
          <a title={"Toggle users sidebar"} className={"text-4xl"}>
            <FaUsers />
          </a>
          <a title={"Leave the room"} className={"text-4xl"}>
            <IoMdExit />
          </a>
        </div>
      </nav>
      <section className={"flex flex-col col-span-12 row-span-11"}>
        <section className={"bg-base-200 overflow-y-auto h-full"}></section>
        <footer className={"w-full p-2"}>
          <Textarea room={room} />
        </footer>
      </section>
    </section>
  );
};
