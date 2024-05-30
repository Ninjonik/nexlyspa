import Avatar from "../components/Avatar.tsx";

export const Homepage = () => {
  return (
    <main className={"h-screen w-screen flex flex-row"}>
      <aside
        className={"w-full md:w-1/5 h-full bg-base-100 flex flex-col p-8 gap-8"}
      >
        <h1 className={"text-center"}>Nexly</h1>
        <section
          className={"flex flex-col w-full h-full overflow-y-auto gap-4"}
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
      </aside>
      <section className={"md:visible w-4/5 h-full bg-base-200 p-8"}></section>
    </main>
  );
};
