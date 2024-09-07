import React, { useEffect, useCallback } from "react";
import { Button } from "../Button.tsx";
import { RxCrossCircled } from "react-icons/rx";
import { FaGear, FaUser } from "react-icons/fa6";
import { MyAccount } from "./settings/MyAccount.tsx";

interface SettingsProps {
  shown: boolean;
  setShown: React.Dispatch<React.SetStateAction<boolean>>;
}

export const Settings = ({ shown, setShown }: SettingsProps) => {
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
  return (
    <main
      className={`w-screen h-screen absolute z-50 top-0 left-0 flex justify-center items-center bg-black bg-opacity-75 backdrop-blur-md ${shown ? "opacity-100" : "opacity-0"} pointer-events-none transition-all duration-300`}
    >
      <section className={"w-2/3 h-4/5 flex flex-row pointer-events-auto"}>
        <aside
          className={
            "h-full w-1/3 bg-base-200 rounded-l-lg p-4 flex flex-col px-4"
          }
        >
          <h2
            className={
              "text-center flex justify-center items-center text-2xl gap-2"
            }
          >
            <FaGear /> Settings
          </h2>
          <div className={"flex flex-col justify-between h-full"}>
            <div className={"flex flex-col gap-2"}>
              <article className={"flex flex-col gap-2"}>
                <h3 className={"w-full font-bold"}>User</h3>
                <ul className={"flex flex-col gap-1"}>
                  <li
                    className={
                      "flex flex-row gap-2 items-center bg-base-300 rounded-lg p-2 hover:bg-base-100 ease-in transition-all cursor-pointer"
                    }
                  >
                    <FaUser /> My Account
                  </li>
                  <li
                    className={
                      "flex flex-row gap-2 items-center bg-base-300 rounded-lg p-2 hover:bg-base-100 ease-in transition-all cursor-pointer"
                    }
                  >
                    <FaGear /> My Profile
                  </li>
                </ul>
                <hr className={"divider border-none my-0"} />
              </article>
            </div>
            <span className={"text-center text-xs font-light"}>
              &copy; 2024 Nexly
            </span>
          </div>
        </aside>
        <div className={"h-full w-2/3 rounded-r-lg p-4 bg-base-300"}>
          <MyAccount />
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
