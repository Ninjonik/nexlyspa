import Avatar from "../Avatar.tsx";
import { MdCall } from "react-icons/md";
import { FaUsers } from "react-icons/fa6";
import { IoMdExit } from "react-icons/io";
import { account } from "../../utils/appwrite.ts";
import RoomObject, {
  RoomObjectArray,
} from "../../utils/interfaces/RoomObject.ts";
import { useNavigate } from "react-router-dom";
import { useRoomsContext } from "../../utils/RoomsContext.tsx";
import { Dispatch, SetStateAction } from "react";
import { ImPhoneHangUp } from "react-icons/im";
import { TbPhonePlus } from "react-icons/tb";
import { toast } from "react-toastify";

interface RoomNavbarProps {
  room: RoomObject;
  inCall: boolean;
  setInCall: Dispatch<SetStateAction<boolean>>;
}

export default function RoomNavbar({
  room,
  inCall,
  setInCall,
}: RoomNavbarProps) {
  const navigate = useNavigate();
  const { rooms, setRooms } = useRoomsContext();

  const leaveRoom = async (roomId: string) => {
    const toastId = toast.loading("Leaving the room...");

    const jwt = await account.createJWT();

    const result = await fetch(
      `${import.meta.env.VITE_PUBLIC_API_HOSTNAME}/leaveRoom`,
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          jwt: jwt.jwt,
          roomId: roomId,
        }),
      },
    );
    const response = await result.json();
    if (!response || !result.ok || !response.success) return;

    if (rooms && Array.from(Object.keys(rooms)).length > 0) {
      const newRooms: RoomObjectArray = { ...rooms };
      delete newRooms[roomId];
      console.log("OLD ROOMS BEFORE LEAVING:", rooms, roomId);
      console.log("NEW ROOMS AFTER LEAVING: ", newRooms);
      setRooms(newRooms);
    }
    toast.update(toastId, {
      render: "Successfully left the room.",
      type: "success",
      isLoading: false,
      autoClose: 2000,
    });
    navigate("/home");
  };

  const startACall = async (roomId: string) => {
    try {
      const jwt = await account.createJWT();

      const result = await fetch(
        `${import.meta.env.VITE_PUBLIC_API_HOSTNAME}/startCall`,
        {
          method: "PATCH",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            jwt: jwt.jwt,
            roomId: roomId,
          }),
        },
      );
      const response = await result.json();
      if (!response || !result.ok || !response.success)
        return "Failed to call the room";
      setInCall(true);
    } catch (e) {
      console.info(e);
      return "There has been an error while starting a call in the room...";
    }
  };

  const leaveTheCall = async (roomId: string) => {
    setInCall(false);
    const jwt = await account.createJWT();

    const result = await fetch(
      `${import.meta.env.VITE_PUBLIC_API_HOSTNAME}/checkCallStatus`,
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          jwt: jwt.jwt,
          roomId: roomId,
        }),
      },
    );
    const response = await result.json();
    if (!response || !result.ok || !response.success) return;
  };

  return (
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
        {room.call ? (
          inCall ? (
            <a
              onClick={() => leaveTheCall(room.$id)}
              title={"Hang"}
              className={"text-4xl hover:cursor-pointer"}
            >
              <ImPhoneHangUp />
            </a>
          ) : (
            <a title={"Join Call"} className={"text-4xl hover:cursor-pointer"}>
              <TbPhonePlus onClick={() => setInCall(true)} />
            </a>
          )
        ) : (
          <a
            onClick={() => startACall(room.$id)}
            title={"Call"}
            className={"text-4xl hover:cursor-pointer"}
          >
            <MdCall />
          </a>
        )}

        <a
          title={"Toggle users sidebar"}
          className={"text-4xl hover:cursor-pointer"}
        >
          <FaUsers />
        </a>
        <a
          title={"Leave the room"}
          className={"text-4xl hover:cursor-pointer"}
          onClick={() => leaveRoom(room.$id)}
        >
          <IoMdExit />
        </a>
      </div>
    </nav>
  );
}
