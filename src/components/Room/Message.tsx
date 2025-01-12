import Avatar from "../Avatar.tsx";
import MessageObject from "../../utils/interfaces/MessageObject.ts";
import { useUserContext } from "../../utils/UserContext.tsx";
import { AttachmentList } from "./AttachmentList.tsx";
import React, { ReactNode, useEffect, useState } from "react";
import getFileData, { getFileDataResult } from "../../utils/getFileData.ts";
import formatTimestampToDate from "../../utils/formatTimestampToDate.ts";
import formatTimestampToTime from "../../utils/formatTimestampToTime.ts";
import Markdown from "react-markdown";
import remarkGfm from "remark-gfm";
import Twemoji from "react-twemoji";
import { PhotoView } from "react-photo-view";
import { isValidImageUrl } from "../../utils/isValidImageUrl.ts";
import { Prism as SyntaxHighlighter } from "react-syntax-highlighter";
import rehypeRaw from "rehype-raw";
import { FaCopy, FaPaste } from "react-icons/fa";
import {
  oneDark,
  oneLight,
} from "react-syntax-highlighter/dist/cjs/styles/prism";
import { useLocalSettingsContext } from "../../utils/LocalSettingsContext.tsx";

interface MessageInterface {
  message: MessageObject;
  showDetails?: boolean;
}

export default function CodeCopyBtn({ children }: { children: ReactNode }) {
  const [copyOk, setCopyOk] = React.useState(false);

  const iconColor = copyOk ? "#0af20a" : "#ddd";
  const icon = copyOk ? <FaPaste /> : <FaCopy />;

  const handleClick = () => {
    // @ts-expect-error it works just fine
    navigator.clipboard.writeText(children.props.children);

    setCopyOk(true);
    setTimeout(() => {
      setCopyOk(false);
    }, 500);
  };

  return (
    <div className="code-copy-btn">
      <button onClick={handleClick} style={{ color: iconColor }}>
        {icon}
      </button>
    </div>
  );
}

export const Message = ({ message, showDetails = true }: MessageInterface) => {
  const { user } = useUserContext();
  const [attachmentsData, setAttachmentsData] = useState<getFileDataResult[]>(
    [],
  );

  const { options } = useLocalSettingsContext();

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

  const Pre = ({ children }: { children: ReactNode }) => (
    <pre className="flex relative w-max">
      <CodeCopyBtn>{children}</CodeCopyBtn>
      {children}
    </pre>
  );

  let validImageUrl = false;
  if (message?.message) validImageUrl = isValidImageUrl(message.message);

  return (
    <div
      className={`w-full flex ${message.$collectionId === "TEMPORARY" && "opacity-50"} flex-col hover:bg-base-300 transition-all ease-in p-2 group`}
    >
      <div
        className={`max-w-full flex flex-row gap-4 ${own && "place-self-end"}`}
      >
        {showDetails && <Avatar avatarId={message.author.avatar} />}
        {!showDetails && (
          <span
            className={`group-hover:visible invisible text-center h-full flex justify-center items-center text-base-content`}
          >
            {formatTimestampToTime(message.$updatedAt)}
          </span>
        )}

        <div
          className={`inline-flex flex-col text-start justify-center gap-2 ${own && "order-first"}`}
        >
          {showDetails && (
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
          )}

          {message.message && validImageUrl ? (
            <div>
              <PhotoView src={message.message}>
                <img
                  className={`rounded-b-lg ease-in object-fit ${own ? "rounded-l-md bg-primary text-base-100" : "rounded-r-md bg-base-300 text-left"}`}
                  alt={"Imported message image"}
                  src={message.message}
                />
              </PhotoView>
            </div>
          ) : (
            <>
              <div
                className={`${own ? "rounded-l-lg bg-primary text-base-100" : "rounded-r-lg group-hover:bg-base-100 bg-base-300 text-left transition-all ease-in"} rounded-b-lg w-full p-1 whitespace-pre-line`}
              >
                <Twemoji options={{ className: "tw-emoji" }}>
                  <Markdown
                    className="post-markdown"
                    rehypePlugins={[rehypeRaw]}
                    remarkPlugins={[remarkGfm]}
                    components={{
                      // @ts-expect-error works just fine
                      pre: Pre,
                      code({ className = "blog-code", children, ...props }) {
                        const match = /language-(\w+)/.exec(className || "");
                        return match ? (
                          <SyntaxHighlighter
                            // @ts-expect-error works just fine
                            style={
                              options.theme === "light" ? oneLight : oneDark
                            }
                            language={match[1]}
                            PreTag="div"
                            {...props}
                          >
                            {String(children).replace(/\n$/, "")}
                          </SyntaxHighlighter>
                        ) : (
                          <code className={className} {...props}>
                            {children}
                          </code>
                        );
                      },
                    }}
                  >
                    {message.message}
                  </Markdown>
                </Twemoji>
              </div>
              <MemoizedAttachmentList
                attachmentsData={attachmentsData}
                own={own}
              />
            </>
          )}
        </div>
      </div>
    </div>
  );
};

const MemoizedAttachmentList = React.memo(AttachmentList);
