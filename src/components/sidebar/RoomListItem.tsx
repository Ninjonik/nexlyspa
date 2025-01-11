import Avatar from "../Avatar.tsx";
import RoomObject from "../../utils/interfaces/RoomObject.ts";
import { useLocation, useNavigate } from "react-router-dom";
import truncate from "../../utils/truncate.ts";
import {
  Menu,
  // Separator,
  // Submenu,
  Item,
  useContextMenu,
} from "react-contexify";
import { leaveRoom } from "../Room/RoomNavbar.tsx";
import { useRoomsContext } from "../../utils/RoomsContext.tsx";

interface RoomListItem {
  room: RoomObject;
}

export const RoomListItem = ({ room }: RoomListItem) => {
  const location = useLocation();
  const navigate = useNavigate();
  const { rooms, setRooms } = useRoomsContext();

  const menuId = `room_${room.$id}_cm`;

  const { show } = useContextMenu({
    id: menuId,
  });

  return (
    <>
      <div
        className={
          "flex flex-row w-full gap-4 bg-base-200 rounded-md p-2 justify-between hover:cursor-pointer hover:bg-base-300"
        }
        onClick={() => navigate("/room/" + room.$id)}
        onContextMenu={(event) => {
          event.preventDefault();
          console.log("NIGGA SHOWING");
          show({ event, props: { key: "value" } });
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
      <Menu id={menuId}>
        <Item
          id={`leave_${menuId}`}
          onClick={async () => {
            await leaveRoom(
              room.$id,
              rooms,
              setRooms,
              navigate,
              location.pathname,
            );
          }}
        >
          Leave
        </Item>
        {/*        <Item id="cut">Cut</Item>
        <Separator />
        <Item disabled>Disabled</Item>
        <Separator />
        <Submenu label="Foobar">
          <Item id="reload">Reload</Item>
          <Item id="something">Do something else</Item>
        </Submenu>*/}
      </Menu>
    </>
  );
};
