import RoomObject from "../../utils/interfaces/RoomObject.ts";
import Avatar from "../Avatar.tsx";
import { MdCall } from "react-icons/md";
import { FaUsers } from "react-icons/fa6";
import { IoMdExit } from "react-icons/io";

export default function RoomNavbar(props: {
  room: RoomObject;
  onClick: () => Promise<void>;
}) {
  return (
    <nav
      className={
        "col-span-12 row-span-1 flex flex-row p-2 items-center mx-12 justify-between"
      }
    >
      <div className={"flex flex-row gap-4"}>
        <Avatar />
        <div className={"flex flex-col text-start justify-center"}>
          <h3 className={"text-primary font-bold"}>{props.room.name}</h3>
          <h4>{props.room.description}</h4>
        </div>
      </div>
      <div className={"flex flex-row items-center gap-4"}>
        <a title={"Call"} className={"text-4xl hover:cursor-pointer"}>
          <MdCall />
        </a>
        <a
          title={"Toggle users sidebar"}
          className={"text-4xl hover:cursor-pointer"}
        >
          <FaUsers />
        </a>
        <a
          title={"Leave the room"}
          className={"text-4xl hover:cursor-pointer"}
          onClick={props.onClick}
        >
          <IoMdExit />
        </a>
      </div>
    </nav>
  );
}
