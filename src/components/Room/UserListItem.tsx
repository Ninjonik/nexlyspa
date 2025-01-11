import Avatar from "../Avatar.tsx";
import { UserObject } from "../../utils/interfaces/UserObject.ts";
import { FaCrown } from "react-icons/fa6";
import { Label } from "../Label.tsx";
import { Button } from "../../Button.tsx";
import { RxCrossCircled } from "react-icons/rx";
import truncate from "../../utils/truncate.ts";
import checkUserStatus from "../../utils/checkUserStatus.ts";

interface UserListItemProps {
  user: UserObject | null;
  admin?: boolean;
  isUserAdmin: boolean;
  kickUserOut: (userId: string) => void;
}

export const UserListItem = ({
  user,
  admin = false,
  isUserAdmin = false,
  kickUserOut,
}: UserListItemProps) => {
  return (
    <div
      className={
        "flex flex-row w-full gap-4 bg-base-200 rounded-md p-2 justify-between hover:cursor-pointer hover:bg-base-300"
      }
      onContextMenu={() => {}}
    >
      <div className={"flex flex-row gap-4"}>
        <Avatar avatarId={user?.avatar} status={checkUserStatus(user)} />
        <div className={"flex flex-col text-start justify-center"}>
          <h3
            className={
              "text-primary font-bold flex flex-row items-center gap-1"
            }
          >
            {truncate(user?.name, 10)}
            {admin && (
              <Label title={"Admin of this group"}>
                <span className={"text-yellow-500"}>
                  <FaCrown />
                </span>
              </Label>
            )}
          </h3>
        </div>
      </div>
      <div className={"flex justify-end items-center flex-row gap-2"}>
        {isUserAdmin && (
          <Button
            transparent={true}
            text={"Kick user out of this room"}
            position={"left"}
            onClick={() => kickUserOut(user?.$id ?? "")}
          >
            <RxCrossCircled />
          </Button>
        )}
      </div>
    </div>
  );
};
