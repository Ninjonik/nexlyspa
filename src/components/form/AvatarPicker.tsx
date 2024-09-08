import { AiOutlineCloudUpload } from "react-icons/ai";
import React, { useCallback, RefObject } from "react";
import { RxAvatar } from "react-icons/rx";
import getAvatar from "../../utils/getAvatar.ts";

interface AvatarPickerProps {
  image: File | undefined;
  setImage: React.Dispatch<React.SetStateAction<File | undefined>>;
  inputName: string;
  avatarText?: string;
  color?: "primary" | "secondary";
  showText?: boolean;
  flexDirection?: "row" | "col";
  form?: RefObject<HTMLFormElement>;
  defaultAvatar: string;
}

export const AvatarPicker = ({
  inputName,
  avatarText = "Choose your avatar",
  showText = true,
  flexDirection = "row",
  image,
  setImage,
  form,
  defaultAvatar = "defaultAvatar",
}: AvatarPickerProps) => {
  const handleFileChange = useCallback(
    (e: React.ChangeEvent<HTMLInputElement>) => {
      if (!e || !e?.target || !e?.target?.files) return;
      const file = e.target.files[0];
      setImage(file);
      if (form) form.current?.requestSubmit();
    },
    [],
  );

  // @ts-expect-error it's here just so tailwind doesn't garbage collect these classes
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const classes = ["text-primary", "text-secondary"];
  const avatarUrl = getAvatar(defaultAvatar);

  return (
    <label htmlFor={inputName} className={"h-20 min-w-20"}>
      <div className={"group relative"}>
        <div
          className={`avatar flex flex-${flexDirection} justify-center items-center gap-4 opacity-100 group-hover:opacity-0 transition-all ease-in-out absolute`}
        >
          {showText && (
            <span className={`flex flex-row gap-2 items-center`}>
              <RxAvatar /> {avatarText}
            </span>
          )}
          <div className="w-20 mask mask-squircle group-hover:opacity-50 transition-all ease-in">
            <img
              src={image ? URL.createObjectURL(image) : avatarUrl}
              alt={"Avatar"}
            />
          </div>
        </div>
        <div
          className={`avatar placeholder flex flex-${flexDirection} justify-center items-center gap-4 opacity-0 group-hover:opacity-100 transition-all ease-in-out absolute`}
        >
          {showText && (
            <span className={`flex flex-row gap-2 items-center`}>
              <RxAvatar /> {avatarText}
            </span>
          )}
          <div className="bg-neutral text-neutral-content mask mask-squircle w-20">
            <span className="text-3xl">
              <AiOutlineCloudUpload />
            </span>
          </div>
        </div>
      </div>
      <input
        type={"file"}
        id={inputName}
        className={"hidden"}
        onChange={handleFileChange}
        accept={"image/png, image/jpeg, image/jpg, image/gif, image/webp"}
        name={inputName}
      />
    </label>
  );
};
