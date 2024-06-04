import Avatar from "./Avatar.tsx";
import { Link } from "react-router-dom";
import { FaGear, FaMicrophone } from "react-icons/fa6";
import {TbHeadphonesOff, TbLogout2, TbMessages} from "react-icons/tb";
import { IoMdCheckmarkCircle } from "react-icons/io";
import { useUserContext } from "../utils/UserContext.tsx";
import { FullscreenLoading } from "./FullscreenLoading.tsx";
import { RoomListItem } from "./sidebar/RoomListItem.tsx";
import {useRoomsContext} from "../utils/RoomsContext.tsx";

export const Sidebar = () => {
  const { user } = useUserContext();
  const {rooms} = useRoomsContext();

  if (!user) return <FullscreenLoading />;

  return (
    <aside
      className={"w-full md:w-1/4 bg-base-100 grid grid-rows-12 h-full overflow-x-hidden"}
    >
        <h2 className={"text-center row-span-1 flex justify-center items-center text-2xl gap-2"}><TbMessages /> Recent Rooms</h2>
        <section
            className={"flex flex-col w-full h-full overflow-y-auto gap-4 px-8 row-span-10"}
        >
          {rooms && Array.from(Object.entries(rooms), ([key, room]) => <RoomListItem key={key + "_rli"} room={room}/>)}
        </section>
        <section className={"flex p-2 border-t-2 border-primary row-span-1"}>
          <div className={"flex flex-row w-full gap-4 p-2"}>
            <div className={"flex flex-row gap-4"}>
              <Avatar/>
              <div className={"flex flex-col text-start justify-center overflow-hidden"}>
                <h3 className={"text-primary font-bold max-w-24"}>{user.name}</h3>
                <h4>{user.emailVerification ? "Verified" : "Not verified"}</h4>
              </div>
            </div>
            <div className={"flex flex-row gap-4 justify-center items-center"}>
              <Link
                  to={"/logout"}
                  className={"font-bold text-xl"}
                  title={"Toggle microphone"}
              >
                <FaMicrophone/>
              </Link>
              <Link
                  to={"/logout"}
                  className={"font-bold text-xl"}
                  title={"Toggle headphones"}
              >
                <TbHeadphonesOff/>
              </Link>
              <Link
                  to={"/register/verify"}
                  className={"font-bold text-xl"}
                  title={"Verify your account"}
              >
                <IoMdCheckmarkCircle/>
              </Link>
              <Link
                  to={"/logout"}
                  className={"font-bold text-xl"}
                  title={"Settings"}
              >
                <FaGear/>
              </Link>
              <Link
                  to={"/logout"}
                  className={"font-bold text-xl"}
                  title={"Log out"}
              >
                <TbLogout2/>
              </Link>
            </div>
          </div>
        </section>
    </aside>
  );
};
