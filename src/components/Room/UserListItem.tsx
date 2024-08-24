import Avatar from "../Avatar.tsx";
import { UserObject } from "../../utils/interfaces/UserObject.ts";
import { FaCrown } from "react-icons/fa6";

interface UserListItemProps {
  user: UserObject | null;
  admin?: boolean;
}

export const UserListItem = ({ user, admin = false }: UserListItemProps) => {
  return (
    <div
      className={
        "flex flex-row w-full gap-4 bg-base-200 rounded-md p-2 justify-between hover:cursor-pointer hover:bg-base-300"
      }
    >
      <div className={"flex flex-row gap-4"}>
        <Avatar avatarId={user?.avatar} />
        <div className={"flex flex-col text-start justify-center"}>
          <h3
            className={
              "text-primary font-bold flex flex-row items-center gap-1"
            }
          >
            {user?.name}
            {admin && (
              <span className={"text-yellow-500"} title={"Admin of this group"}>
                <FaCrown />
              </span>
            )}
          </h3>
        </div>
      </div>
    </div>
  );
};
