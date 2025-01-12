import React, { ReactNode, useEffect, useRef } from "react";
import { useInView } from "framer-motion";
import { RxCrossCircled } from "react-icons/rx";
import { Button } from "../Button.tsx";

interface ModalViewProps {
  shown: boolean;
  setShown: React.Dispatch<React.SetStateAction<boolean>>;
  children: ReactNode;
}

export const ModalView = ({ shown, setShown, children }: ModalViewProps) => {
  const mainRef = useRef<HTMLElement>(null);

  useEffect(() => {
    const handleEscKey = (event: KeyboardEvent) => {
      if (shown && event.key === "Escape") {
        setShown(false);
      }
    };

    if (shown) {
      window.addEventListener("keydown", handleEscKey);
    }

    return () => {
      window.removeEventListener("keydown", handleEscKey);
    };
  }, [shown, setShown]);

  const isInView = useInView(mainRef, {
    margin: "0px 100px -50px 0px",
  });

  return (
    <main
      className={`w-screen h-screen absolute z-50 top-0 left-0 flex justify-center items-center bg-black bg-opacity-75 backdrop-blur-md ${
        shown ? "visible" : "hidden"
      } transition-all duration-300`}
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
        {children}
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
