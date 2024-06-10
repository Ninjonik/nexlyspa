import Avatar from "../Avatar.tsx";
import { MdCall } from "react-icons/md";
import { FaUsers } from "react-icons/fa6";
import { IoMdExit } from "react-icons/io";
import { account, functions } from "../../utils/appwrite.ts";
import { ExecutionMethod } from "appwrite";
import RoomObject, {
  RoomObjectArray,
} from "../../utils/interfaces/RoomObject.ts";
import { useNavigate } from "react-router-dom";
import { useRoomsContext } from "../../utils/RoomsContext.tsx";
import { Dispatch, SetStateAction } from "react";
import { ImPhoneHangUp } from "react-icons/im";
import { TbPhonePlus } from "react-icons/tb";

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
    const jwt = await account.createJWT();
    const result = await functions.createExecution(
      "leaveRoom",
      JSON.stringify({
        jwt: jwt.jwt,
        roomId: roomId,
      }),
      false,
      undefined,
      ExecutionMethod.POST,
    );
    const response = JSON.parse(result.responseBody);
    if (response.success && response.status) {
      if (rooms && Array.from(Object.keys(rooms)).length > 0) {
        const newRooms: RoomObjectArray = { ...rooms };
        delete newRooms[roomId];
        setRooms(newRooms);
      }
      navigate("/home");
      navigate(0);
    }
  };

  const startACall = async (roomId: string) => {
    try {
      const jwt = await account.createJWT();
      const result = await functions.createExecution(
        "startCall",
        JSON.stringify({
          jwt: jwt.jwt,
          roomId: roomId,
        }),
        false,
        undefined,
        ExecutionMethod.PATCH,
      );
      const response = JSON.parse(result.responseBody);
      console.log(result, response);
      if (!response.success || !response.status)
        return "Failed to call the room.";
      setInCall(true);
    } catch (e) {
      console.info(e);
      return "There has been an error while starting a call in the room...";
    }
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
            <a title={"Hang"} className={"text-4xl hover:cursor-pointer"}>
              <ImPhoneHangUp />
            </a>
          ) : (
            <a title={"Join Call"} className={"text-4xl hover:cursor-pointer"}>
              <TbPhonePlus />
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
