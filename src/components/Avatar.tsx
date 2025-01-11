import getAvatar from "../utils/getAvatar.ts";

interface AvatarProps {
  avatarId?: string;
  status?: "" | "offline" | "online";
}

const Avatar = ({ avatarId = "defaultAvatar", status = "" }: AvatarProps) => {
  return (
    <div className={`avatar ${status}`}>
      <div className="h-14 w-14 rounded-full">
        <img src={getAvatar(avatarId)} />
      </div>
    </div>
  );
};

export default Avatar;
