import Avatar from "../Avatar.tsx";
import MessageObject from "../../utils/interfaces/MessageObject.ts";
import { useUserContext } from "../../utils/UserContext.tsx";
import { AttachmentList } from "./AttachmentList.tsx";
import React, { useEffect, useState } from "react";
import getFileData, { getFileDataResult } from "../../utils/getFileData.ts";
import formatTimestampToDate from "../../utils/formatTimestampToDate.ts";
import formatTimestampToTime from "../../utils/formatTimestampToTime.ts";

interface MessageInterface {
  message: MessageObject;
}

export const Message = ({ message }: MessageInterface) => {
  const { user } = useUserContext();
  const [attachmentsData, setAttachmentsData] = useState<getFileDataResult[]>(
    [],
  );

  const fetchAttachmentsData = async () => {
    const attachmentsData = await Promise.all(
      message.attachments.map(async (attachmentId: string) => {
        const { preview, file, extension } = await getFileData(
          "attachments",
          attachmentId,
        );
        if (!preview || !file || !extension) return null;
        return { preview, file, extension };
      }),
    );
    setAttachmentsData(attachmentsData.filter(Boolean) as getFileDataResult[]);
  };

  useEffect(() => {
    fetchAttachmentsData();
  }, [message, message.attachments]);

  if (!message || !message.author || !user) return null;

  const own = message.author.$id === user.$id;
  const _classes = [
    "bg-primary",
    "text-primary",
    "text-white",
    "bg-base-100",
    "rounded-l-lg",
    "rounded-r-lg",
    "text-base-content",
  ];
  if (!_classes) return;
  return (
    <div
      className={`max-w-2/3 flex flex-row gap-4 ${own && "place-self-end"} ${message.$collectionId === "TEMPORARY" && "opacity-50"}`}
    >
      <Avatar />
      <div
        className={`inline-flex flex-col text-start justify-center gap-2 ${own && "order-first"}`}
      >
        <div className={"flex flex-row gap-2 items-center"}>
          <h3 className={`text-primary font-bold ${own && "order-last"}`}>
            {message.author.name}
          </h3>
          <h4 className={""}>
            <span className={``}>
              {formatTimestampToDate(message.$updatedAt)}
            </span>{" "}
            <span className={``}>
              {formatTimestampToTime(message.$updatedAt)}
            </span>
          </h4>
        </div>
        <h4
          className={`${own ? "bg-primary rounded-l-lg text-white" : "bg-base-100 rounded-r-lg text-base-content"} rounded-b-lg p-1`}
        >
          {message.message}
        </h4>
        <MemoizedAttachmentList attachmentsData={attachmentsData} own={own} />
      </div>
    </div>
  );
};

const MemoizedAttachmentList = React.memo(AttachmentList);
