import { useNavigate, useParams } from "react-router-dom";
import { FullscreenLoading } from "../components/FullscreenLoading.tsx";
import { useEffect, useRef, useState } from "react";
import RoomObject from "../utils/interfaces/RoomObject.ts";
import { Textarea } from "../components/Room/TextArea.tsx";
import MessageObject from "../utils/interfaces/MessageObject.ts";
import { Message } from "../components/Room/Message.tsx";
import { account, client, database, databases } from "../utils/appwrite.ts";
import { useUserContext } from "../utils/UserContext.tsx";
import { Query } from "appwrite";
import { PhotoProvider } from "react-photo-view";
import { RoomSkeleton } from "../components/Room/RoomSkeleton.tsx";
import RoomNavbar, { leaveTheCall } from "../components/Room/RoomNavbar.tsx";
import { LiveKitRoom } from "@livekit/components-react";
import VideoConference from "../components/Room/VideoConference.tsx";
import { CiMaximize1, CiMinimize1, CiWarning } from "react-icons/ci";
import { useSlideContext } from "../utils/SlideContext.tsx";
import { FaUsers } from "react-icons/fa6";
import { UserListItem } from "../components/Room/UserListItem.tsx";
import { UserObject } from "../utils/interfaces/UserObject.ts";
import { toast } from "react-toastify";
import { motion } from "framer-motion";
import { pageTransitionOptions } from "../utils/constants.ts";
import fireToast from "../utils/fireToast.ts";

export const Room = () => {
  const { user } = useUserContext();
  const { roomId } = useParams();
  const [room, setRoom] = useState<null | RoomObject>(null);
  const [messages, setMessages] = useState<MessageObject[]>([]);
  const [optimisticMessages, setOptimisticMessages] = useState<MessageObject[]>(
    [],
  );
  const optimisticMessagesRef = useRef<MessageObject[]>([]);
  const [loading, setLoading] = useState<boolean>(true);

  const [token, setToken] = useState<string>("");
  const [inCall, setInCall] = useState<boolean>(false);
  const [fullscreenCall, setFullscreenCall] = useState<boolean>(false);
  const messagesSectionRef = useRef<HTMLDivElement>(null);

  const [sidebar, setSidebar] = useState<boolean>(true);

  const { slide, onTouchStart, onTouchMove, onTouchEnd } = useSlideContext();

  const navigate = useNavigate();

  const fetchMessages = async (roomId: string): Promise<void> => {
    const res = await databases.listDocuments(database, "messages", [
      Query.equal("room", roomId),
      Query.orderDesc("$updatedAt"),
      Query.limit(50),
    ]);
    const messages = res.documents as MessageObject[];
    setMessages(messages);
    setLoading(false);
  };

  const becomeAdmin = async (roomId: string) => {
    const jwt = await account.createJWT();

    const toastId = toast.loading("Giving you the room's admin role...");

    const result = await fetch(
      `${import.meta.env.VITE_PUBLIC_API_HOSTNAME}/becomeAdmin`,
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          jwt: jwt.jwt,
          roomId: roomId,
        }),
      },
    );
    console.log(result);
    const response = await result.json();
    if (!response || !result.ok || !response.success)
      return toast.update(toastId, {
        render: "You can't become an administrator in this group.",
        type: "error",
        isLoading: false,
        autoClose: 2000,
      });
    toast.update(toastId, {
      render: "You are an admin in this group now.",
      type: "success",
      isLoading: false,
      autoClose: 2000,
    });
  };

  useEffect(() => {
    if (!room || !user?.name) return;

    (async () => {
      try {
        const jwt = await account.createJWT();

        const result = await fetch(
          `${import.meta.env.VITE_PUBLIC_API_HOSTNAME}/getParticipantToken`,
          {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
            },
            body: JSON.stringify({
              jwt: jwt.jwt,
              roomId: room.$id,
            }),
          },
        );

        const response = await result.json();

        if (!response || !result.ok || !response.success)
          return "Failed to create a call token.";

        setToken(response.token);
      } catch (e) {
        console.error(e);
      }
    })();
  }, [room?.call, user?.name]);

  useEffect(() => {
    setLoading(true);
    if (!roomId) return;
    const fetchRoomData = async () => {
      const res = await databases.getDocument(database, "rooms", roomId);
      if (!res) return;
      setRoom(res as RoomObject);
    };

    setRoom(null);
    setOptimisticMessages([]);
    optimisticMessagesRef.current = [];
    setMessages([]);
    setInCall(false);
    setToken("");
    setFullscreenCall(false);
    fetchRoomData();
    fetchMessages(roomId);

    const unsubscribeRoom = client.subscribe(
      `databases.${database}.collections.rooms.documents.${roomId}`,
      (response) => {
        const payload = response.payload as RoomObject;
        setRoom(payload);
      },
    );

    return () => {
      unsubscribeRoom();
    };
  }, [roomId]);

  useEffect(() => {
    if (room && room.$id) {
      console.log("SUBSCRIBING");
      const unsubscribeMessages = client.subscribe(
        `databases.${database}.collections.messages.documents`,
        (response) => {
          const payload = response.payload as MessageObject;
          console.info("NEW MESSAGE:", payload.author.name, payload.message);
          console.log("REF:", optimisticMessagesRef);
          const messageRoomId = payload.room.$id;
          if (messageRoomId === room.$id && user) {
            if (
              payload.author.$id === user.$id &&
              optimisticMessagesRef.current.length > 0
            ) {
              const newOptimisticMessages = [...optimisticMessagesRef.current];
              newOptimisticMessages.pop();
              optimisticMessagesRef.current = newOptimisticMessages;
              setOptimisticMessages(newOptimisticMessages);
            }
            // setOptimisticMessages([]);
            setMessages((prevMessages) => [payload, ...prevMessages]);
          }
        },
      );

      return () => {
        unsubscribeMessages();
      };
    }
  }, [room, user]);

  useEffect(() => {
    optimisticMessagesRef.current = optimisticMessages;
  }, [optimisticMessages]);

  if (loading) return <RoomSkeleton />;

  if (!roomId) {
    navigate("/home");
    return <FullscreenLoading />;
  }

  if (!room) return <FullscreenLoading />;

  const handleOnDisconnectedFn = async () => {
    setInCall(false);
    await leaveTheCall(roomId);
  };

  const isUserAdmin = room.admin?.$id === user?.$id;

  const kickUserOut = async (userId: string) => {
    const newRoomUsers = room.users.filter((user) => user.$id !== userId);
    await databases.updateDocument(database, "rooms", roomId, {
      users: newRoomUsers,
    });
    fireToast("success", "User has been successfully kicked out of the room!");
  };

  return (
    <motion.section
      className={`grid grid-cols-12 grid-rows-12 w-full h-full overflow-hidden ${slide === "main" ? "" : "_md:hidden"}`}
      onTouchStart={onTouchStart}
      onTouchMove={onTouchMove}
      onTouchEnd={onTouchEnd}
      {...pageTransitionOptions}
    >
      <RoomNavbar
        room={room}
        inCall={inCall}
        setInCall={setInCall}
        sidebar={sidebar}
        setSidebar={setSidebar}
      />
      <section
        className={`flex flex-col ${sidebar ? "col-span-10" : "col-span-12"} row-span-11 transition-all`}
      >
        {inCall && (
          <section
            className={`flex flex-col gap-[1dvw] bg-light transition-all duration-100 ${fullscreenCall ? "absolute w-[100dvw] h-[100dvh] top-0 left-0 z-50" : "relative w-full min-h-96 h-full"} resize-y overflow-auto`}
          >
            <LiveKitRoom
              video={false}
              audio={false}
              connect={inCall}
              token={token}
              serverUrl={import.meta.env.VITE_PUBLIC_LIVEKIT_URL}
              data-lk-theme="default"
              className="flex flex-col h-full"
              onDisconnected={handleOnDisconnectedFn}
            >
              <VideoConference
                handleOnDisconnectedFn={handleOnDisconnectedFn}
              />
              <button
                className="transparent-button bg-transparent hover:bg-transparent border-none h-[2dvw] w-[2dvw] p-[1dvw] text-lightly hover:text-white transition-all flex justify-center items-center text-center rounded-xl absolute left-4 bottom-4 md:left-1 md:bottom-1"
                onClick={() => setFullscreenCall(!fullscreenCall)}
              >
                <label className="swap swap-rotate text-white hover:text-secondary ease-in transition-all text-xl">
                  {fullscreenCall ? (
                    <div>
                      <CiMinimize1 />
                    </div>
                  ) : (
                    <div>
                      <CiMaximize1 />
                    </div>
                  )}
                </label>
              </button>
            </LiveKitRoom>
          </section>
        )}
        <section
          className={
            "bg-base-200 overflow-y-auto h-full flex flex-col-reverse w-full p-4 gap-4"
          }
          ref={messagesSectionRef}
        >
          {optimisticMessages.map((message: MessageObject) => (
            <Message key={message.$id} message={message} />
          ))}
          <PhotoProvider>
            {messages.map((message: MessageObject) => (
              <Message key={message.$id} message={message} />
            ))}
          </PhotoProvider>
        </section>
        <footer className={"w-full p-2 bg-base-200"}>
          <Textarea
            room={room}
            setOptimisticMessages={setOptimisticMessages}
            messagesSectionRef={messagesSectionRef}
          />
        </footer>
      </section>
      <aside
        className={`${sidebar ? "col-span-2 row-span-11" : "hidden"}  transition-all h-full flex flex-col p-4 w-full gap-4`}
      >
        <article className={"flex flex-col gap-2"}>
          <h2
            className={
              "text-center flex justify-center items-center text-2xl gap-2"
            }
          >
            <FaUsers /> Members ({room.users.length}){" "}
            {!room.admin?.$id && (
              <a
                className={"text-yellow-500 text-2xl hover:cursor-pointer"}
                title={
                  "This room doesn't have any admin. Click to become a one."
                }
                onClick={() => becomeAdmin(room?.$id)}
              >
                <CiWarning />
              </a>
            )}
          </h2>
          <div className={"flex flex-col gap-2"}>
            {room.users.map((listUser: UserObject) => (
              <UserListItem
                key={listUser.$id + "_userSidebarList"}
                user={listUser}
                admin={room.admin?.$id === listUser.$id}
                isUserAdmin={isUserAdmin}
                kickUserOut={kickUserOut}
              />
            ))}
          </div>
        </article>
      </aside>
    </motion.section>
  );
};
