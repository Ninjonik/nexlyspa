export const Homepage = () => {
  return (
    <section
      className={"md:visible w-4/5 h-full bg-base-200 p-8 flex flex-col gap-8"}
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
  );
};
