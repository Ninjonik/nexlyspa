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
import { Button } from "../../Button.tsx";

interface RoomNavbarProps {
  room: RoomObject;
  inCall: boolean;
  setInCall: Dispatch<SetStateAction<boolean>>;
  sidebar: boolean;
  setSidebar: Dispatch<SetStateAction<boolean>>;
}

export const leaveTheCall = async (roomId: string) => {
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

export default function RoomNavbar({
  room,
  inCall,
  setInCall,
  sidebar,
  setSidebar,
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

  const handleLeaveCall = async (roomId: string) => {
    setInCall(false);
    return await leaveTheCall(roomId);
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

  return (
    <nav
      className={`col-span-12 row-span-1 flex flex-row p-2 items-center mx-12 justify-between transition-all`}
    >
      <div className={"flex flex-row gap-4"}>
        <Avatar />
        <div className={"flex flex-col text-start justify-center"}>
          <h3 className={"text-primary font-bold"}>{room.name}</h3>
          <h4>{room.description}</h4>
        </div>
      </div>
      <div className={"flex flex-row items-center gap-4"}>
        <h3 className={"font-semibold"}>
          Room's code: <span className={"text-primary"}>{room.$id}</span>
        </h3>
        {room.call ? (
          inCall ? (
            <Button
              onClick={() => handleLeaveCall(room.$id)}
              text={"Hang"}
              className={"text-4xl hover:cursor-pointer"}
              transparent={true}
              position={"bottom"}
            >
              <ImPhoneHangUp />
            </Button>
          ) : (
            <Button
              text={"Join Call"}
              className={"text-4xl hover:cursor-pointer"}
              transparent={true}
              position={"bottom"}
            >
              <TbPhonePlus onClick={() => setInCall(true)} />
            </Button>
          )
        ) : (
          <Button
            onClick={() => startACall(room.$id)}
            text={"Call"}
            className={"text-4xl hover:cursor-pointer"}
            transparent={true}
            position={"bottom"}
          >
            <MdCall />
          </Button>
        )}

        <Button
          text={"Toggle users sidebar"}
          className={"text-4xl hover:cursor-pointer"}
          transparent={true}
          position={"bottom"}
          onClick={() => setSidebar(!sidebar)}
        >
          <FaUsers />
        </Button>
        <Button
          text={"Leave the room"}
          className={"text-4xl hover:cursor-pointer"}
          transparent={true}
          position={"bottom"}
          onClick={() => leaveRoom(room.$id)}
        >
          <IoMdExit />
        </Button>
      </div>
    </nav>
  );
}
