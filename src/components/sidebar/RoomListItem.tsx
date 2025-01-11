import Avatar from "../Avatar.tsx";
import RoomObject from "../../utils/interfaces/RoomObject.ts";
import { useNavigate } from "react-router-dom";
import truncate from "../../utils/truncate.ts";

interface RoomListItem {
  room: RoomObject;
}

export const RoomListItem = ({ room }: RoomListItem) => {
  const navigate = useNavigate();

  return (
    <div
      className={
        "flex flex-row w-full gap-4 bg-base-200 rounded-md p-2 justify-between hover:cursor-pointer hover:bg-base-300"
      }
      onClick={() => navigate("/room/" + room.$id)}
      onContextMenu={(e) => {
        e.preventDefault();
        console.log("CONTEXT MENU");
      }}
    >
      <div className={"flex flex-row gap-4"}>
        <Avatar />
        <div className={"flex flex-col text-start justify-center"}>
          <h3 className={"text-primary font-bold"}>
            {truncate(room.name, 15)}
          </h3>
          <h4>{truncate(room.description, 20)}</h4>
        </div>
      </div>
      <div className={"flex flex-col gap-4 justify-center"}>
        <span className={"font-bold"}>{room.closed}</span>
      </div>
    </div>
  );
};
