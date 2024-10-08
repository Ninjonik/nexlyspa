// @ts-expect-error erroneous due to outdated react types, will be fixed with react 19
import { useActionState, useState } from "react";
import { account } from "../utils/appwrite.ts";
import { useUserContext } from "../utils/UserContext.tsx";
import { useNavigate } from "react-router-dom";
import { toast, Id } from "react-toastify";
import { useSlideContext } from "../utils/SlideContext.tsx";
import { motion } from "framer-motion";
import { pageTransitionOptions } from "../utils/constants.ts";

export const Homepage = () => {
  const [pending, setPending] = useState<boolean>(false);
  const { setUser } = useUserContext();
  const navigate = useNavigate();

  const handleRoomSubmit = async (_prevState: null, queryData: FormData) => {
    setPending(true);
    const name = queryData.get("name");
    const description = queryData.get("description");
    const code = queryData.get("code");

    const handleReturn = (message: string, toastId: Id) => {
      setPending(false);
      toast.update(toastId, {
        render: message,
        type: "error",
        isLoading: false,
        autoClose: 2000,
      });
      return message;
    };

    // Handle the common stuff
    const jwt = await account.createJWT();
    let response;

    if (code) {
      // Handle joining a room
      const toastId = toast.loading("Joining a room...");
      if (!code) return handleReturn("Please enter a valid code.", toastId);

      // Validate room's code
      const result = await fetch(
        `${import.meta.env.VITE_PUBLIC_API_HOSTNAME}/joinRoom`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            jwt: jwt.jwt,
            roomId: code,
          }),
        },
      );

      response = await result.json();
      if (!response || !result.ok || !response.success)
        return handleReturn(
          response?.message ?? "An unknown error has happened.",
          toastId,
        );

      toast.update(toastId, {
        render: "Successfully joined a new room",
        type: "success",
        isLoading: false,
        autoClose: 2000,
      });
    } else {
      // Handle creating a room
      const toastId = toast.loading("Creating a room...");
      if (!name || !description)
        return handleReturn("Please fill all the fields.", toastId);

      const result = await fetch(
        `${import.meta.env.VITE_PUBLIC_API_HOSTNAME}/createRoom`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            jwt: jwt.jwt,
            roomName: name,
            roomDescription: description,
            roomAvatar: "defaultAvatar",
          }),
        },
      );
      response = await result.json();
      if (!response || !result.ok || !response.success)
        return handleReturn(
          "There's been an error while creating your room.",
          toastId,
        );

      toast.update(toastId, {
        render: "Successfully created a new room",
        type: "success",
        isLoading: false,
        autoClose: 2000,
      });
    }

    setTimeout(() => {
      // Handle the common stuff
      setUser(response.newUser);
      navigate("/room/" + response.roomId, { replace: true });
      window.location.reload();
    }, 2000);
  };

  const [messageJoin, formActionJoin] = useActionState(handleRoomSubmit, null);
  const [messageCreate, formActionCreate] = useActionState(
    handleRoomSubmit,
    null,
  );

  const { slide, onTouchStart, onTouchMove, onTouchEnd } = useSlideContext();

  console.info(pending);
  return (
    <motion.section
      className={`md:visible h-full bg-base-200 flex flex-col gap-8 md:w-4/5 md:p-8 ${slide === "main" ? "w-full p-8" : "_md:hidden p-0"}`}
      onTouchStart={onTouchStart}
      onTouchMove={onTouchMove}
      onTouchEnd={onTouchEnd}
      {...pageTransitionOptions}
    >
      <h2 className={"text-center text-5xl"}>Nexly</h2>
      <hr className={"divider divider-primary"} />
      <div className={"flex flex-col md:flex-row w-full gap-8 items-center"}>
        <div className={"w-full md:w-1/2 flex flex-col gap-2 h-full"}>
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
            <button className={"button"} type="submit" disabled={pending}>
              Join an existing room
            </button>
          </form>
        </div>
        <div className={"w-full md:w-1/2 flex flex-col gap-2 h-full"}>
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
            <button className={"button"} type="submit" disabled={pending}>
              Create a new room
            </button>
          </form>
        </div>
      </div>
      <span className={"text-primary"}>{messageJoin}</span>
      <span className={"text-primary"}>{messageCreate}</span>
    </motion.section>
  );
};
