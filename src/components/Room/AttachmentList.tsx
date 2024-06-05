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
    <div className={"flex flex-col gap-2"}>
      {attachmentsData &&
        attachmentsData.map(({ preview, file, extension }) => (
          <div
            key={file?.$id + "_attachment_div"}
            className={"max-h-96 max-w-96 relative lg:pr-16 h-96 w-96"}
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
                      className={`rounded-b-lg ease-in ${own ? "rounded-l-md bg-primary text-base-100" : "rounded-r-md bg-base-300 text-left"}`}
                      alt={file.name}
                      src={preview}
                    />
                  </PhotoView>
                ) : (
                  <FileIcon
                    extension={extension}
                    {...(defaultStyles[extension as DefaultExtensionType] ||
                      defaultStyles.png)}
                  />
                )}
                <div className={"bottom-0 right-0 absolute"}>
                  <a
                    title={"Download the file"}
                    href={getFileDownload("attachments", file?.$id) ?? ""}
                    download={true}
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
