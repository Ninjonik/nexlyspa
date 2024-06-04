import getAvatar from "../utils/getAvatar.ts";

interface AvatarProps {
    avatarId?: string;
}

const Avatar = ({avatarId = "defaultAvatar"}: AvatarProps) => {
  return (
    <div className="avatar online">
      <div className="h-16 w-16 rounded-full">
        <img src={getAvatar(avatarId)} />
      </div>
    </div>
  );
};

export default Avatar;
