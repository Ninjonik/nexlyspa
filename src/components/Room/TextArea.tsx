import React, {
  // @ts-expect-error erroneous due to outdated react types, will be fixed with react 19
  useActionState,
  useEffect,
  useState,
  useRef,
  SetStateAction,
  Dispatch,
  RefObject,
} from "react";
import { FaPlus } from "react-icons/fa";
import {
  AiOutlineDelete,
  AiOutlineFileGif,
  AiOutlineSmile,
} from "react-icons/ai";
import TextareaAutosize from "react-textarea-autosize";
import { DefaultExtensionType, defaultStyles, FileIcon } from "react-file-icon";
import GifPicker from "gif-picker-react";
import EmojiPicker, { EmojiClickData, EmojiStyle } from "emoji-picker-react";
import { useDropzone } from "react-dropzone";
import { useUserContext } from "../../utils/UserContext.tsx";
import RoomObject from "../../utils/interfaces/RoomObject.ts";
import Tippy from "@tippyjs/react";
import uploadMultipleFiles from "../../utils/uploadMultipleFiles.ts";
import { account } from "../../utils/appwrite.ts";
import MessageObject from "../../utils/interfaces/MessageObject.ts";

interface TextareaProps {
  className?: string;
  room: RoomObject;
  setOptimisticMessages: Dispatch<SetStateAction<MessageObject[]>>;
  messagesSectionRef: RefObject<HTMLDivElement>;
}

export const Textarea = ({
  className,
  room,
  setOptimisticMessages,
  messagesSectionRef,
}: TextareaProps) => {
  const [text, setText] = useState<string>("");
  const [attachments, setAttachments] = useState<File[]>([]);
  const { user } = useUserContext();
  const formRef = useRef<HTMLFormElement>(null);

  useEffect(() => {
    const keyDownHandler = (event: {
      key: string;
      shiftKey: boolean;
      preventDefault: () => void;
    }) => {
      if (event.key === "Enter" && !event.shiftKey) {
        event.preventDefault();
        if (formRef.current) formRef.current.requestSubmit();
      }
    };

    document.addEventListener("keydown", keyDownHandler);

    return () => document.removeEventListener("keydown", keyDownHandler);
  }, []);

  const submitAction = async (
    message: string = "",
    attachmentsToSend: File[] = [],
  ) => {
    setText("");
    setAttachments([]);

    const jwt = await account.createJWT();

    if (!message && attachmentsToSend.length < 1) return;

    /*
        Upload all the attachments.
    */

    let attachmentIds: string[] = [];
    if (attachmentsToSend.length > 0) {
      attachmentIds = await uploadMultipleFiles(attachmentsToSend);
    }

    console.info("SENDING NEW MESSAGE");
    const result = await fetch(
      `${import.meta.env.VITE_PUBLIC_API_HOSTNAME}/sendMessage`,
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          jwt: jwt.jwt,
          message: message,
          attachments: attachmentIds,
          roomId: room.$id,
        }),
      },
    );
    const response = await result.json();
    if (!response || !result.ok || !response.success) return;

    console.log("SENDMESSAGE RESULT:", response);
  };

  const handleSubmit = (_prevState: string, queryData: FormData) => {
    const message = queryData.get("message") as string;
    if (user && message) {
      setOptimisticMessages((prevMessages: MessageObject[]) => [
        {
          $id:
            "optimistic_message_" +
            new Date().toISOString() +
            Math.floor(Math.random() * 5000000),
          $createdAt: new Date().toISOString(),
          $updatedAt: new Date().toISOString(),
          $permissions: [],
          author: user,
          room: room,
          message: message,
          attachments: [],
          $databaseId: "TEMPORARY",
          $collectionId: "TEMPORARY",
        },
        ...prevMessages,
      ]);
      messagesSectionRef.current?.scrollTo(0, 0);
      submitAction(message, attachments);
    }
  };

  const updateAttachments = (e: React.ChangeEvent<HTMLInputElement>) => {
    const currentAttachmentsLength = attachments?.length || 0;
    if (currentAttachmentsLength > 5) return;

    const uploadedFiles: File[] = Array.from(e.target.files || []);
    if (!uploadedFiles) return;

    const uploadedFilesLength = uploadedFiles.length;
    if (currentAttachmentsLength + uploadedFilesLength > 5) return;

    setAttachments((prevAttachments: File[]) => [
      ...prevAttachments,
      ...uploadedFiles,
    ]);
  };

  const removeAttachment = (index: number) => {
    const newAttachments = [...attachments];
    newAttachments.splice(index, 1);
    setAttachments(newAttachments);
  };

  const handlePaste = async (
    event: React.ClipboardEvent<HTMLTextAreaElement>,
  ) => {
    const items = event.clipboardData.items;
    for (const item of items) {
      if (item.type.indexOf("image") === 0) {
        event.preventDefault();
        const file = item.getAsFile();
        if (file) {
          setAttachments((prevAttachments: File[]) => [
            ...prevAttachments,
            file,
          ]);
        }
        return;
      }
    }
  };

  const { getRootProps, getInputProps } = useDropzone({
    noClick: true,
    onDrop: (files: File[]) =>
      setAttachments((prevAttachments: File[]) => [
        ...prevAttachments,
        ...files,
      ]),
  });

  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const [_errorMessage, formAction] = useActionState(handleSubmit, null);

  return (
    <div
      className={
        "w-full flex flex-col bg-base-300 rounded-lg items-center px-2"
      }
      {...getRootProps()}
    >
      <ul
        className={
          "flex flex-row gap-4 overflow-x-scroll w-full no-scrollbar p-2 justify-start"
        }
      >
        {attachments?.map((attachment: File, index) => {
          const fileExtension =
            attachment.name.split(".").pop()?.toLowerCase() || "png";
          const fileIconStyles =
            defaultStyles[fileExtension as DefaultExtensionType] ||
            defaultStyles.png;

          return (
            <li
              className={
                "bg-base-300 border-primary border rounded-xl h-48 w-48 flex flex-col justify-between items-center relative"
              }
              key={"attachment" + index}
            >
              <div className={"absolute right-1 top-1"}>
                <a
                  title={"Remove attachment"}
                  className={"rounded-full text-2xl"}
                  onClick={() => removeAttachment(index)}
                >
                  <AiOutlineDelete />
                </a>
              </div>
              <div
                className={"w-32 h-32 flex justify-center items-center pt-4"}
              >
                <div className={"h-full w-full"}>
                  {[
                    "image/jpg",
                    "image/jpeg",
                    "image/png",
                    "image/gif",
                    "image/bmp",
                    "image/webp",
                  ].includes(attachment.type) ? (
                    <img
                      className="rounded-md ease-in w-full h-full"
                      alt={attachment.name}
                      height={0}
                      width={0}
                      src={URL.createObjectURL(attachment)}
                    />
                  ) : (
                    <FileIcon extension={fileExtension} {...fileIconStyles} />
                  )}
                </div>
              </div>
              <div className={"text-sm break-words text-center"}>
                {attachment.name}
              </div>
            </li>
          );
        })}
      </ul>
      <form
        className={"w-full flex justify-between items-center"}
        action={formAction}
        ref={formRef}
      >
        <label>
          <input
            type="file"
            className="hidden"
            name="file1"
            max={5}
            multiple={true}
            {...getInputProps()}
            onChange={updateAttachments}
          />
          <a
            title={"Add attachment"}
            className={
              "p-2 text-2xl text-primary hover:text-secondary ease-in transition-all hover:cursor-pointer"
            }
          >
            <FaPlus />
          </a>
        </label>
        <TextareaAutosize
          className={`p-2 focus:outline-none focus:border-none w-full h-full ${className} resize-none bg-base-300 max-h-[30dvh] overflow-y-auto no-scrollbar flex items-center`}
          cacheMeasurements
          value={text}
          rows={1}
          onPaste={handlePaste}
          onChange={(e) => setText(e.target.value)}
          name={"message"}
        />
        <div className={"flex justify-center items-center"}>
          <Tippy
            content={
              <GifPicker
                tenorApiKey={
                  import.meta.env.VITE_PUBLIC_TENOR_KEY || "no_tenor_api_key"
                }
                onGifClick={(e: { url: string }) =>
                  submitAction(e.url, attachments)
                }
              />
            }
            trigger={"click"}
            interactive={true}
            appendTo={document.body}
          >
            <a
              title={"Open GIF picker"}
              className={`flex justify-center items-center text-center text-2xl text-primary hover:text-secondary ease-in transition-all hover:cursor-pointer p-2`}
            >
              <AiOutlineFileGif />
            </a>
          </Tippy>
          <Tippy
            content={
              <EmojiPicker
                emojiStyle={EmojiStyle.TWITTER}
                onEmojiClick={(emoji: EmojiClickData) =>
                  setText((prevText) => prevText + emoji.emoji)
                }
              />
            }
            trigger={"click"}
            interactive={true}
            appendTo={document.body}
          >
            <a
              title={"Open Emoji picker"}
              className={`flex justify-center items-center text-center text-2xl text-primary hover:text-secondary ease-in transition-all hover:cursor-pointer p-2`}
            >
              <AiOutlineSmile />
            </a>
          </Tippy>
        </div>
        <input type={"submit"} hidden />
      </form>
    </div>
  );
};
