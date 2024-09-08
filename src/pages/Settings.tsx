import React, {
  useEffect,
  useCallback,
  useRef,
  ReactNode,
  useState,
} from "react";
import { Button } from "../Button.tsx";
import { RxCheckCircled, RxCrossCircled } from "react-icons/rx";
import { FaGear, FaUser } from "react-icons/fa6";
import { MyAccount } from "./settings/MyAccount.tsx";
import { useInView } from "framer-motion";
import { TbLogout2 } from "react-icons/tb";
import { Anchor } from "../components/Anchor.tsx";
import { Link } from "react-router-dom";
import { useUserContext } from "../utils/UserContext.tsx";
import { FaPaintBrush } from "react-icons/fa";
import { Appearance } from "./settings/Appearance.tsx";

interface SettingsProps {
  shown: boolean;
  setShown: React.Dispatch<React.SetStateAction<boolean>>;
}

export const Settings = ({ shown, setShown }: SettingsProps) => {
  const { user } = useUserContext();
  const [shownPage, setShownPage] = useState<ReactNode>(<MyAccount />);

  const mainRef = useRef<HTMLElement>(null);
  const handleEscKey = useCallback(
    (event: KeyboardEvent) => {
      if (shown && event.key === "Escape") {
        setShown(false);
      }
    },
    [shown, setShown],
  );

  useEffect(() => {
    const handleKeyDown = handleEscKey;

    if (shown) {
      window.addEventListener("keydown", handleKeyDown);
    }

    return () => {
      window.removeEventListener("keydown", handleKeyDown);
    };

    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [shown, handleEscKey]);

  const isInView = useInView(mainRef, {
    margin: "0px 100px -50px 0px",
  });

  if (!user) return;

  return (
    <main
      className={`w-screen h-screen absolute z-50 top-0 left-0 flex justify-center items-center bg-black bg-opacity-75 backdrop-blur-md ${shown ? "visible" : "hidden"} transition-all duration-300`}
      ref={mainRef}
      style={{
        opacity: isInView ? 1 : 0,
        transition: "all cubic-bezier(0.17, 0.55, 0.55, 1) 0.5s",
      }}
    >
      <section
        className={
          "w-full h-full md:w-2/3 md:h-4/5 flex flex-row justify-stretch items-stretch"
        }
      >
        <aside
          className={
            "h-full w-1/3 bg-base-200 md:rounded-l-lg p-4 flex flex-col px-4"
          }
        >
          <h2
            className={
              "text-center flex justify-center items-center text-2xl gap-2 _md:text-center"
            }
          >
            <FaGear /> <span className={"_md:hidden"}>Settings</span>
          </h2>
          <div className={"flex flex-col justify-between h-full"}>
            <div className={"flex flex-col gap-2"}>
              <article className={"flex flex-col gap-2"}>
                <h3 className={"w-full font-bold"}>User</h3>
                <ul className={"flex flex-col gap-1"}>
                  <a
                    className={
                      "flex flex-row gap-2 items-center bg-base-300 rounded-lg p-2 hover:bg-base-100 ease-in transition-all cursor-pointer transparent-link _md:text-center"
                    }
                    onClick={() => setShownPage(<MyAccount />)}
                  >
                    <FaUser /> <span className={"_md:hidden"}>My Account</span>
                  </a>
                  <a
                    className={
                      "flex flex-row gap-2 items-center bg-base-300 rounded-lg p-2 hover:bg-base-100 ease-in transition-all cursor-pointer transparent-link _md:text-center"
                    }
                  >
                    <FaGear /> <span className={"_md:hidden"}>My Profile</span>
                  </a>
                  {!user.emailVerification && (
                    <Link
                      className={
                        "flex flex-row gap-2 items-center bg-base-300 rounded-lg p-2 hover:bg-base-100 ease-in transition-all cursor-pointer transparent-link _md:text-center"
                      }
                      to={"/register/verify"}
                    >
                      <RxCheckCircled />{" "}
                      <span className={"_md:hidden"}>Verify Account</span>
                    </Link>
                  )}
                </ul>
                <hr className={"divider border-none my-0"} />
              </article>
              <article className={"flex flex-col gap-2"}>
                <h3 className={"w-full font-bold"}>App</h3>
                <ul className={"flex flex-col gap-1"}>
                  <a
                    className={
                      "flex flex-row gap-2 items-center bg-base-300 rounded-lg p-2 hover:bg-base-100 ease-in transition-all cursor-pointer transparent-link _md:text-center"
                    }
                    onClick={() => setShownPage(<Appearance />)}
                  >
                    <FaPaintBrush />{" "}
                    <span className={"_md:hidden"}>Appearance</span>
                  </a>
                </ul>
                <hr className={"divider border-none my-0"} />
              </article>
            </div>
            <div className={"flex flex-col gap-2"}>
              <Anchor
                to={"/logout"}
                className={"font-bold text-xl"}
                title={"Log out"}
              >
                <TbLogout2 />
              </Anchor>
              <span className={"text-center text-xs font-light"}>
                &copy; 2024 Nexly
              </span>
            </div>
          </div>
        </aside>
        <div className={"h-full grow w-2/3 md:rounded-r-lg p-4 bg-base-300"}>
          {shownPage}
        </div>
        <Button
          text={"Close"}
          className={
            "absolute right-12 top-5 transparent-button text-4xl h-14 w-8"
          }
          onClick={() => setShown(false)}
        >
          <div
            className={
              "flex flex-col text-center no-underline items-center justify-center"
            }
          >
            <RxCrossCircled />
            <span className={"no-underline text-xl"}>ESC</span>
          </div>
        </Button>
      </section>
    </main>
  );
};
