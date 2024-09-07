import { motion } from "framer-motion";
import { pageTransitionOptions } from "../../utils/constants.ts";

export const RoomSkeleton = () => {
  const heightClasses = [
    "h-40",
    "h-48",
    "h-56",
    "h-64",
    "h-72",
    "h-80",
    "h-96",
  ];
  const widthClasses = ["w-40", "w-48", "w-56", "w-64", "w-72", "w-80", "w-96"];

  return (
    <motion.section
      className={
        "grid grid-cols-12 grid-rows-12 w-full h-full overflow-hidden animate-pulse"
      }
      {...pageTransitionOptions}
    >
      <nav
        className={
          "col-span-12 row-span-1 flex flex-row p-2 items-center mx-12 justify-between"
        }
      >
        <div className={"flex flex-row gap-4"}>
          <div className="avatar">
            <div className="h-14 w-14 rounded-full bg-base-200"></div>
          </div>
          <div className={"flex flex-col justify-center gap-2"}>
            <h3 className={"w-16 h-full bg-base-200 rounded-md"}></h3>
            <h4 className={"w-32 h-full bg-base-200 rounded-md"}></h4>
          </div>
        </div>
      </nav>
      <section className={"flex flex-col col-span-12 row-span-11"}>
        <section
          className={
            "bg-base-200 overflow-y-auto h-full flex flex-col-reverse w-full p-4 gap-4"
          }
        >
          {Array(20)
            .fill(20)
            .map((_, i) => (
              <div key={i} className="flex flex-row gap-4">
                <div className="avatar">
                  <div className="h-14 w-14 rounded-full bg-base-100"></div>
                </div>
                <div className="flex flex-col justify-center gap-2">
                  <h3 className={`w-48 h-8 bg-base-100 rounded-md`}></h3>
                  <h4
                    className={`${heightClasses[Math.floor(Math.random() * heightClasses.length)]} ${widthClasses[Math.floor(Math.random() * heightClasses.length)]} bg-base-100 rounded-md`}
                  ></h4>
                </div>
              </div>
            ))}
        </section>
        <footer className={"w-full p-2 bg-base-200"}>
          <div className={"w-full h-24 rounded-lg bg-base-300"}></div>
        </footer>
      </section>
    </motion.section>
  );
};
