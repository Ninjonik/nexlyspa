import Avatar from "./Avatar.tsx";
import { Link } from "react-router-dom";
import { FaGear } from "react-icons/fa6";
import { TbLogout2, TbMessages } from "react-icons/tb";
import { IoMdCheckmarkCircle } from "react-icons/io";
import { useUserContext } from "../utils/UserContext.tsx";
import { FullscreenLoading } from "./FullscreenLoading.tsx";
import { RoomListItem } from "./sidebar/RoomListItem.tsx";
import { useRoomsContext } from "../utils/RoomsContext.tsx";
import { useSlideContext } from "../utils/SlideContext.tsx";
import { RiArrowDropDownLine } from "react-icons/ri";
import { ThemeSelector } from "./ThemeSelector.tsx";
import { Anchor } from "./Anchor.tsx";
import { Settings } from "../pages/Settings.tsx";
import { useState } from "react";
import { Button } from "../Button.tsx";
// import { Version } from "./Version.tsx";

export const Sidebar = () => {
  const { slide, onTouchStart, onTouchMove, onTouchEnd } = useSlideContext();
  const { user } = useUserContext();
  const { rooms } = useRoomsContext();

  const [shownSettings, setShownSettings] = useState<boolean>(false);

  if (!user) return <FullscreenLoading />;

  return (
    <aside
      className={`bg-base-100 h-full overflow-hidden flex flex-col justify-between pt-4 md:w-1/5 ${slide === "sidebar" ? "w-full" : "_md:hidden"}`}
      onTouchStart={onTouchStart}
      onTouchMove={onTouchMove}
      onTouchEnd={onTouchEnd}
    >
      <Settings shown={shownSettings} setShown={setShownSettings} />
      <section
        className={"flex flex-col w-full h-full overflow-y-auto gap-4 px-8"}
      >
        {/*<h5>*/}
        {/*  <Version />*/}
        {/*</h5>*/}
        <h2
          className={
            "text-center flex justify-center items-center text-2xl gap-2"
          }
        >
          <TbMessages />{" "}
          <Link to={"/home"} className={"no-underline"}>
            Recent Rooms
          </Link>
        </h2>
        {rooms &&
          Array.from(Object.entries(rooms), ([key, room]) => (
            <RoomListItem key={key + "_rli"} room={room} />
          ))}
      </section>
      <section className={"flex flex-row p-2 h-24 items-center justify-center"}>
        <div className={"flex flex-row w-full gap-4 justify-between"}>
          <div className={"flex flex-row gap-4 w-2/3 items-center"}>
            <Avatar />
            <div
              className={
                "flex flex-col text-start justify-center overflow-hidden"
              }
            >
              <h3 className={"text-primary font-bold max-w-24"}>{user.name}</h3>
              <h4>{user.emailVerification ? "Verified" : "Not verified"}</h4>
            </div>
          </div>

          <div className="dropdown dropdown-left dropdown-top hidden sm:flex lg:hidden justify-center items-center">
            <a tabIndex={0} role="button" className="m-1 text-4xl">
              <RiArrowDropDownLine />
            </a>
            <ul
              tabIndex={0}
              className="dropdown-content z-50 menu p-2 shadow bg-base-100 rounded-box"
            >
              <li>
                <Anchor
                  to={"/register/verify"}
                  className={"font-bold text-xl"}
                  title={"Verify your account"}
                >
                  <IoMdCheckmarkCircle />
                </Anchor>
              </li>
              <li>
                <Anchor
                  to={"/logout"}
                  className={"font-bold text-xl"}
                  title={"Settings"}
                >
                  <FaGear />
                </Anchor>
              </li>
              <li>
                <Anchor
                  to={"/logout"}
                  className={"font-bold text-xl"}
                  title={"Log out"}
                >
                  <TbLogout2 />
                </Anchor>
              </li>
            </ul>
          </div>
          <div
            className={
              "flex sm:hidden lg:flex flex-row gap-4 justify-end items-center w-1/3"
            }
          >
            <Anchor
              to={"/register/verify"}
              className={"font-bold text-xl"}
              title={"Verify your account"}
            >
              <IoMdCheckmarkCircle />
            </Anchor>
            <Button
              className={"font-bold text-xl transparent-button"}
              text={"Settings"}
              onClick={() => setShownSettings(true)}
            >
              <FaGear />
            </Button>
            <Anchor
              to={"/logout"}
              className={"font-bold text-xl"}
              title={"Log out"}
            >
              <TbLogout2 />
            </Anchor>
            <ThemeSelector />
          </div>
        </div>
      </section>
    </aside>
  );
};
