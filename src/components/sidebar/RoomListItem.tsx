import Avatar from "../Avatar.tsx";
import RoomObject from "../../utils/interfaces/RoomObject.ts";
import { useLocation, useNavigate } from "react-router-dom";
import truncate from "../../utils/truncate.ts";
import { Item, Menu, Separator, useContextMenu } from "react-contexify";
import { leaveRoom } from "../Room/RoomNavbar.tsx";
import { useRoomsContext } from "../../utils/RoomsContext.tsx";
import { useState } from "react";
import { RoomSettings } from "../Room/RoomSettings.tsx";
import { useUserContext } from "../../utils/UserContext.tsx";

interface RoomListItem {
  room: RoomObject;
}

export const RoomListItem = ({ room }: RoomListItem) => {
  const location = useLocation();
  const navigate = useNavigate();
  const { rooms, setRooms } = useRoomsContext();
  const [roomSettings, setRoomSettings] = useState<boolean>(false);

  const { user } = useUserContext();

  const menuId = `room_${room.$id}_cm`;

  const { show } = useContextMenu({
    id: menuId,
  });

  if (!user) return;

  return (
    <>
      <div
        className={
          "flex flex-row w-full gap-4 bg-base-200 rounded-md p-2 justify-between hover:cursor-pointer hover:bg-base-300"
        }
        onClick={() => navigate("/room/" + room.$id)}
        onContextMenu={(event) => {
          event.preventDefault();
          show({ event, props: { key: "value" } });
        }}
      >
        <div className={"flex flex-row gap-4"}>
          <Avatar avatarId={room.avatar} />
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
      {room?.admin && room?.admin?.$id === user.$id && (
        <RoomSettings
          shown={roomSettings}
          setShown={setRoomSettings}
          room={room}
        />
      )}

      <Menu id={menuId}>
        {room?.admin && room?.admin?.$id === user.$id && (
          <>
            <Item
              id={`settings_${menuId}`}
              onClick={() => setRoomSettings(true)}
            >
              Edit Room Settings
            </Item>
            <Separator />
          </>
        )}
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
          className={"text-red-500"}
        >
          Leave Room
        </Item>
        {/*        <Item id="cut">Cut</Item>

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
