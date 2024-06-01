import Avatar from "../components/Avatar.tsx";
import { Link } from "react-router-dom";
import { FaGear, FaMicrophone } from "react-icons/fa6";
import { TbHeadphonesOff, TbLogout2 } from "react-icons/tb";
import { useUserContext } from "../utils/UserContext.tsx";
import { IoMdCheckmarkCircle } from "react-icons/io";

export const Homepage = () => {
  const { user } = useUserContext();
  if (!user) return null;

  return (
    <main className={"h-screen w-screen flex flex-row"}>
      <aside
        className={
          "w-full md:w-1/5 h-full bg-base-100 flex flex-col gap-8 pt-8"
        }
      >
        <h2 className={"text-center"}>Recent Rooms</h2>
        <div className={"flex flex-col gap-4 justify-between h-full"}>
          <section
            className={"flex flex-col w-full h-full overflow-y-auto gap-4 px-8"}
          >
            <div
              className={
                "flex flex-row w-full gap-4 bg-base-200 rounded-md p-2 justify-between"
              }
            >
              <div className={"flex flex-row gap-4"}>
                <Avatar />
                <div className={"flex flex-col text-start justify-center"}>
                  <h3 className={"text-primary font-bold"}>Test room</h3>
                  <h4>Description.....</h4>
                </div>
              </div>
              <div className={"flex flex-col gap-4 justify-center"}>
                <span className={"font-bold"}>11:57 AM</span>
              </div>
            </div>
          </section>
          <section className={"flex p-2 border-t-2 border-primary"}>
            <div className={"flex flex-row w-full gap-4 p-2 justify-between"}>
              <div className={"flex flex-row gap-4"}>
                <Avatar />
                <div className={"flex flex-col text-start justify-center"}>
                  <h3 className={"text-primary font-bold"}>{user.name}</h3>
                  <h4>
                    {user.emailVerification ? "Verified" : "Not verified"}
                  </h4>
                </div>
              </div>
              <div
                className={"flex flex-row gap-4 justify-center items-center"}
              >
                <Link
                  to={"/logout"}
                  className={"font-bold text-xl"}
                  title={"Toggle microphone"}
                >
                  <FaMicrophone />
                </Link>
                <Link
                  to={"/logout"}
                  className={"font-bold text-xl"}
                  title={"Toggle headphones"}
                >
                  <TbHeadphonesOff />
                </Link>
                <Link
                  to={"/register/verify"}
                  className={"font-bold text-xl"}
                  title={"Verify your account"}
                >
                  <IoMdCheckmarkCircle />
                </Link>
                <Link
                  to={"/logout"}
                  className={"font-bold text-xl"}
                  title={"Settings"}
                >
                  <FaGear />
                </Link>
                <Link
                  to={"/logout"}
                  className={"font-bold text-xl"}
                  title={"Log out"}
                >
                  <TbLogout2 />
                </Link>
              </div>
            </div>
          </section>
        </div>
      </aside>
      <section
        className={
          "md:visible w-4/5 h-full bg-base-200 p-8 flex flex-col gap-8"
        }
      >
        <h2 className={"text-center text-5xl"}>Nexly</h2>
        <hr className={"divider divider-primary"} />
        <div className={"flex flex-col md:flex-row w-full gap-8"}>
          <div className={"w-1/2 flex flex-col gap-2 h-full"}>
            <h3 className={"text-primary font-semibold"}>
              Join an existing room
            </h3>
            <form
              action=""
              className={"flex flex-col w-full gap-4 h-full justify-between"}
            >
              <div className={"flex flex-col gap-8"}>
                <input type="text" placeholder="New room's name" />
              </div>
              <button type="submit">Join an existing room</button>
            </form>
          </div>
          <div className={"w-1/2 flex flex-col gap-2 h-full"}>
            <h3 className={"text-primary font-semibold"}>Create a new room</h3>
            <form
              action=""
              className={"flex flex-col w-full gap-4 h-full justify-between"}
            >
              <div className={"flex flex-row gap-8"}>
                <input
                  type="text"
                  placeholder="New room's name"
                  className={"w-1/2"}
                />
                <input
                  type="text"
                  placeholder="New room's description"
                  className={"w-1/2"}
                />
              </div>
              <button type="submit">Create a new room</button>
            </form>
          </div>
        </div>
      </section>
    </main>
  );
};
