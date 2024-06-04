import Avatar from "../Avatar.tsx";
import MessageObject from "../../utils/interfaces/MessageObject.ts";

interface MessageInterface {
  message: MessageObject;
}

export const Message = ({ message }: MessageInterface) => {
  if (!message || !message.author) return null;
  return (
    <div className={"max-w-2/3 flex flex-row gap-4"}>
      <Avatar />
      <div className={"flex flex-col text-start justify-center gap-2"}>
        <div className={"flex flex-row gap-2 items-center"}>
          <h3 className={"text-primary font-bold"}>{message.author.name}</h3>
          <h4 className={""}>{message.$updatedAt}</h4>
        </div>
        <h4 className={"bg-primary rounded-b-lg rounded-r-lg p-1"}>
          {message.message}{" "}
          {message.$collectionId === "TEMPORARY" &&
            "IAOJDOPSIJDPOAJDPOAJDSOPSSSASJSSSSPOSSJSSDSS"}
        </h4>
      </div>
    </div>
  );
};
