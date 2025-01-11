import { UserObject } from "./interfaces/UserObject.ts";

export default function checkUserStatus(user: UserObject | null) {
  if (!user) return "offline";
  const lastSeen = user.lastSeen;
  if (!lastSeen) return "offline";

  const currentTime = new Date();
  const comparisonTime = currentTime.setTime(currentTime.getTime() - 1000 * 65);

  console.log(new Date(lastSeen).getTime(), "<", comparisonTime);
  console.log(new Date(lastSeen), new Date(comparisonTime));

  if (new Date(lastSeen).getTime() < comparisonTime) return "offline";

  return "online";
}
