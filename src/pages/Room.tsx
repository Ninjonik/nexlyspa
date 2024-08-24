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
import { CiMaximize1, CiMinimize1 } from "react-icons/ci";
import { useSlideContext } from "../utils/SlideContext.tsx";

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

  return (
    <section
      className={`grid grid-cols-12 grid-rows-12 w-full h-full overflow-hidden ${slide === "main" ? "" : "_md:hidden"}`}
      onTouchStart={onTouchStart}
      onTouchMove={onTouchMove}
      onTouchEnd={onTouchEnd}
    >
      <RoomNavbar room={room} inCall={inCall} setInCall={setInCall} />
      <section className={"flex flex-col col-span-12 row-span-11"}>
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
                className="bg-transparent hover:bg-transparent border-none h-[2dvw] w-[2dvw] p-[1dvw] text-lightly hover:text-white transition-all flex justify-center items-center text-center rounded-xl absolute left-4 bottom-4 md:left-1 md:bottom-1"
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
    </section>
  );
};
