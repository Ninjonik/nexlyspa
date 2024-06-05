import getAvatar from "../utils/getAvatar.ts";

interface AvatarProps {
  avatarId?: string;
}

const Avatar = ({ avatarId = "defaultAvatar" }: AvatarProps) => {
  return (
    <div className="avatar">
      <div className="h-14 w-14 rounded-full">
        <img src={getAvatar(avatarId)} />
      </div>
    </div>
  );
};

export default Avatar;
