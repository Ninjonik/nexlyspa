// @ts-expect-error erroneous due to outdated react types, will be fixed with react 19
import { useActionState, useState } from "react";
import { account, functions } from "../utils/appwrite.ts";
import { ExecutionMethod } from "appwrite";
import { useUserContext } from "../utils/UserContext.tsx";
import { useNavigate } from "react-router-dom";

export const Homepage = () => {
  const [pending, setPending] = useState<boolean>(false);
  const { setUser } = useUserContext();
  const navigate = useNavigate();

  const handleRoomSubmit = async (_prevState: null, queryData: FormData) => {
    setPending(true);
    const name = queryData.get("name");
    const description = queryData.get("description");
    const code = queryData.get("code");

    const handleReturn = (message: string) => {
      setPending(false);
      return message;
    };

    // Handle the common stuff
    const jwt = await account.createJWT();
    let response;

    if (code) {
      // Handle joining a room
      if (!code) return handleReturn("Please enter a valid code.");

      // Validate room's code
      const result = await functions.createExecution(
        "joinRoom",
        JSON.stringify({
          jwt: jwt.jwt,
          roomId: code,
        }),
        false,
        undefined,
        ExecutionMethod.POST,
      );
      response = JSON.parse(result.responseBody);
      if (!response.success || !response.status)
        return handleReturn(
          response?.message ?? "An unknown error has happened.",
        );
    } else {
      // Handle creating a room
      if (!name || !description)
        return handleReturn("Please fill all the fields.");

      const result = await functions.createExecution(
        "createRoom",
        JSON.stringify({
          jwt: jwt.jwt,
          roomName: name,
          roomDescription: description,
          roomAvatar: "defaultAvatar",
        }),
        false,
        undefined,
        ExecutionMethod.POST,
      );
      response = JSON.parse(result.responseBody);
      if (!response.success)
        return handleReturn("Room with the specified code does not exist.");
    }

    // Handle the common stuff
    setUser(response.newUser);
    navigate("/room/" + response.roomId);
  };

  const [messageJoin, formActionJoin] = useActionState(handleRoomSubmit, null);
  const [messageCreate, formActionCreate] = useActionState(
    handleRoomSubmit,
    null,
  );

  console.info(pending);
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
            action={formActionJoin}
            className={"flex flex-col w-full gap-4 h-full justify-between"}
          >
            <div className={"flex flex-col gap-8"}>
              <input
                type="text"
                placeholder="Room's code"
                name={"code"}
                required={true}
              />
            </div>
            <button type="submit" disabled={pending}>
              Join an existing room
            </button>
          </form>
        </div>
        <div className={"w-1/2 flex flex-col gap-2 h-full"}>
          <h3 className={"text-primary font-semibold"}>Create a new room</h3>
          <form
            action={formActionCreate}
            className={"flex flex-col w-full gap-4 h-full justify-between"}
          >
            <div className={"flex flex-row gap-8"}>
              <input
                type="text"
                placeholder="New room's name"
                className={"w-1/2"}
                name={"name"}
                required={true}
              />
              <input
                type="text"
                placeholder="New room's description"
                className={"w-1/2"}
                name={"description"}
                required={true}
              />
            </div>
            <button type="submit" disabled={pending}>
              Create a new room
            </button>
          </form>
        </div>
      </div>
      <span className={"text-primary"}>{messageJoin}</span>
      <span className={"text-primary"}>{messageCreate}</span>
    </section>
  );
};
