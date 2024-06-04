import React, { useCallback, useEffect, useState } from "react";
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

interface TextareaProps {
  className?: string;
  room: RoomObject;
}

export const Textarea = ({ className, room }: TextareaProps) => {
  const [text, setText] = useState<string>("");
  const [attachments, setAttachments] = useState<File[]>([]);
  const [submitting, setSubmitting] = useState<boolean>(false);
  const { user } = useUserContext();

  // useEffect(() => {
  //     const delayDebounceFn = setTimeout(() => {
  //         /* Perform emoji formatting etc. */
  //     }, 1000)
  //
  //
  //
  //
  //     return () => clearTimeout(delayDebounceFn)
  //
  // }, [text]);

  // TODO: make this more optimized by not running the functions always on keydown, add a debounce
  useEffect(() => {
    const keyDownHandler = (event: {
      key: string;
      shiftKey: boolean;
      preventDefault: () => void;
    }) => {
      if (event.key === "Enter" && !event.shiftKey) {
        event.preventDefault();
        const attachmentsToSend = attachments || [];
        if (!text && attachmentsToSend.length < 1) return null;
        handleSubmit(text, attachmentsToSend);
      }
    };

    document.addEventListener("keydown", keyDownHandler);

    return () => document.removeEventListener("keydown", keyDownHandler);
  }, [text, attachments]);

  const handleSubmit = useCallback(
    async (message: string = "", attachmentsToSend: File[] = []) => {
      setSubmitting(true);
      setText("");
      setAttachments([]);
      if (submitting) return;

      // const jwt = await account.createJWT();

      if (!user) return null;
      if (!message && attachmentsToSend.length < 1) return null;

      /*
            Upload all the attachments.
        */

      // let attachmentIds: string[] = [];
      // if(attachmentsToSend.length > 0){
      //     attachmentIds = await uploadMultipleFiles(attachmentsToSend);
      // }

      // const res = await fetch(
      //     process.env.NEXT_PUBLIC_HOSTNAME + `/api/sendMessage`,
      //     {
      //         method: "POST",
      //         headers: {
      //             "Content-Type": "application/json",
      //         },
      //         body: JSON.stringify({
      //             "jwt": jwt.jwt,
      //             "message": message,
      //             "attachments": attachmentIds,
      //             "roomId": room.$id
      //         }),
      //     }
      // )
      // const resJson = await res.json();
      // setSubmitting(false);
      // console.log(resJson);
    },
    [room, submitting],
  );

  const updateAttachments = useCallback(
    (e: React.ChangeEvent<HTMLInputElement>) => {
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
    },
    [attachments],
  );

  const removeAttachment = useCallback(
    (index: number) => {
      const newAttachments = [...attachments];
      newAttachments.splice(index, 1);
      setAttachments(newAttachments);
    },
    [attachments],
  );

  const handlePaste = useCallback(
    async (event: React.ClipboardEvent<HTMLTextAreaElement>) => {
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
    },
    [],
  );

  const { getRootProps, getInputProps } = useDropzone({
    noClick: true,
    onDrop: (files: File[]) =>
      setAttachments((prevAttachments: File[]) => [
        ...prevAttachments,
        ...files,
      ]),
  });

  return (
    <div
      className={
        "w-full flex flex-col bg-base-300 rounded-lg items-center px-2"
      }
      {...getRootProps()}
    >
      <ul
        className={
          "flex flex-row gap-4 overflow-x-scroll max-w-screen no-scrollbar"
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
                "bg-base-300 border-primary border rounded-xl p-2 h-48 w-48 flex flex-col justify-between items-center relative"
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
              <div className={"text-sm break-words text-center"}>
                {attachment.name}
              </div>
            </li>
          );
        })}
      </ul>
      <form
        className={"w-full flex justify-between"}
        onSubmit={(e) => e.preventDefault()}
      >
        <div className={"flex justify-center items-center"}>
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
            <a title={"Add attachment"} className={"p-2 text-2xl"}>
              <FaPlus />
            </a>
          </label>
        </div>
        <div className={"w-full flex items-center"}>
          <TextareaAutosize
            className={`textarea focus:outline-none focus:border-none w-full h-full ${className} p-2 resize-none bg-base-300 max-h-96 overflow-y-scroll no-scrollbar flex items-center`}
            cacheMeasurements
            value={text}
            rows={1}
            onPaste={handlePaste}
            onChange={(e) => setText(e.target.value)}
          />
        </div>
        <div className={"flex justify-center items-center"}>
          <Tippy
            content={
              <GifPicker
                tenorApiKey={
                  import.meta.env.VITE_PUBLIC_TENOR_KEY || "no_tenor_api_key"
                }
                onGifClick={(e: { url: string }) => handleSubmit(e.url)}
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
                  setText((prevText) => prevText + " " + emoji.emoji)
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