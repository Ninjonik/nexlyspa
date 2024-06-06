import { PhotoView } from "react-photo-view";
import { DefaultExtensionType, defaultStyles, FileIcon } from "react-file-icon";
import { AiOutlineDownload } from "react-icons/ai";
import { getFileDataResult } from "../../utils/getFileData.ts";
import getFileDownload from "../../utils/getFileDownload.ts";

export const AttachmentList = ({
  attachmentsData,
  own,
}: {
  attachmentsData: getFileDataResult[];
  own: boolean;
}) => {
  return (
    <div className={"flex flex-col gap-4"}>
      {attachmentsData &&
        attachmentsData.map(({ preview, file, extension }) => (
          <div
            key={file?.$id + "_attachment_div"}
            className={"relative flex flex-col"}
          >
            {preview && file && extension && (
              <>
                {[
                  "image/jpg",
                  "image/jpeg",
                  "image/png",
                  "image/gif",
                  "image/bmp",
                  "image/webp",
                ].includes(file.mimeType) ? (
                  <PhotoView src={preview}>
                    <img
                      className={`max-h-96 max-w-96 w-48 h-48 rounded-b-lg ease-in ${own ? "rounded-l-md text-base-100" : "rounded-r-md text-left"}`}
                      alt={file.name}
                      src={preview}
                    />
                  </PhotoView>
                ) : (
                  <div className={"w-48 flex flex-col"}>
                    <FileIcon
                      extension={extension}
                      {...(defaultStyles[extension as DefaultExtensionType] ||
                        defaultStyles.png)}
                    />
                    <span className={"text-center text-primary"}>
                      {file.name}
                    </span>
                  </div>
                )}
                <div className={`${own && "place-self-end"}`}>
                  <a
                    title={"Download the file"}
                    href={getFileDownload("attachments", file?.$id) ?? ""}
                    download={true}
                    className={"text-4xl"}
                  >
                    <AiOutlineDownload />
                  </a>
                </div>
              </>
            )}
          </div>
        ))}
    </div>
  );
};
