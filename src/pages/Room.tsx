import { useNavigate, useParams } from "react-router-dom";
import { FullscreenLoading } from "../components/FullscreenLoading.tsx";
import { useEffect, useRef, useState } from "react";
import RoomObject from "../utils/interfaces/RoomObject.ts";
import { useRoomsContext } from "../utils/RoomsContext.tsx";
import Avatar from "../components/Avatar.tsx";
import { MdCall } from "react-icons/md";
import { FaUsers } from "react-icons/fa6";
import { IoMdExit } from "react-icons/io";
import { Textarea } from "../components/Room/TextArea.tsx";
import MessageObject from "../utils/interfaces/MessageObject.ts";
import { Message } from "../components/Room/Message.tsx";
import { client, database, databases } from "../utils/appwrite.ts";
import { useUserContext } from "../utils/UserContext.tsx";
import { Query } from "appwrite";
import { PhotoProvider } from "react-photo-view";

export const Room = () => {
  const navigate = useNavigate();
  const { user } = useUserContext();
  const { roomId } = useParams();
  const [room, setRoom] = useState<null | RoomObject>(null);
  const { rooms } = useRoomsContext();
  const [messages, setMessages] = useState<MessageObject[]>([]);
  const [optimisticMessages, setOptimisticMessages] = useState<MessageObject[]>(
    [],
  );
  const optimisticMessagesRef = useRef<MessageObject[]>([]);

  const fetchMessages = async (roomId: string): Promise<void> => {
    const res = await databases.listDocuments(database, "messages", [
      Query.equal("room", roomId),
      Query.orderDesc("$updatedAt"),
      Query.limit(50),
    ]);
    const messages = res.documents as MessageObject[];
    setMessages(messages);
  };

  useEffect(() => {
    if (roomId && rooms && rooms[roomId]) {
      setRoom(rooms[roomId]);
      fetchMessages(roomId);
    }
  }, [rooms, roomId]);

  useEffect(() => {
    if (room && room.$id) {
      const unsubscribeMessages = client.subscribe(
        `databases.${database}.collections.messages.documents`,
        (response) => {
          const payload = response.payload as MessageObject;
          const messageRoomId = payload.room.$id;
          console.log(payload);
          if (messageRoomId === room.$id && user)
            if (
              payload.author.$id === user.$id &&
              optimisticMessagesRef.current.length > 0
            ) {
              const newOptimisticMessages = [...optimisticMessagesRef.current];
              newOptimisticMessages.pop();
              setOptimisticMessages(newOptimisticMessages);
            }
          setMessages((prevMessages) => [payload, ...prevMessages]);
        },
      );

      return () => {
        unsubscribeMessages();
      };
    }
  }, [room?.$id]);

  useEffect(() => {
    optimisticMessagesRef.current = optimisticMessages;
  }, [optimisticMessages]);

  if (!roomId) {
    navigate("/");
    return <FullscreenLoading />;
  }

  if (!room) return <FullscreenLoading />;

  return (
    <section
      className={"grid grid-cols-12 grid-rows-12 w-full h-full overflow-hidden"}
    >
      <nav
        className={
          "col-span-12 row-span-1 flex flex-row p-2 items-center mx-12 justify-between"
        }
      >
        <div className={"flex flex-row gap-4"}>
          <Avatar />
          <div className={"flex flex-col text-start justify-center"}>
            <h3 className={"text-primary font-bold"}>{room.name}</h3>
            <h4>{room.description}</h4>
          </div>
        </div>
        <div className={"flex flex-row items-center gap-4"}>
          <a title={"Call"} className={"text-4xl"}>
            <MdCall />
          </a>
          <a title={"Toggle users sidebar"} className={"text-4xl"}>
            <FaUsers />
          </a>
          <a title={"Leave the room"} className={"text-4xl"}>
            <IoMdExit />
          </a>
        </div>
      </nav>
      <section className={"flex flex-col col-span-12 row-span-11"}>
        <section
          className={
            "bg-base-200 overflow-y-auto h-full flex flex-col-reverse w-full p-4 gap-4"
          }
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
          <Textarea room={room} setOptimisticMessages={setOptimisticMessages} />
        </footer>
      </section>
    </section>
  );
};
