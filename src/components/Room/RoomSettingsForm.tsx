import { FaPencil } from "react-icons/fa6";
import { LabelInput } from "../../components/form/LabelInput.tsx";
import { AvatarPicker } from "../../components/form/AvatarPicker.tsx";
import React, { useState } from "react";
import { Button } from "../../Button.tsx";
import { database, databases, storage } from "../../utils/appwrite.ts";
import { promiseToast } from "../../utils/fireToast.ts";
import { ID } from "appwrite";
import StorageObject from "../../utils/interfaces/StorageObject.ts";
import RoomObject from "../../utils/interfaces/RoomObject.ts";
import { FaCog } from "react-icons/fa";
import { MdOutlineDescription } from "react-icons/md";

export const RoomSettingsForm = ({ room }: { room: RoomObject }) => {
  const [avatar, setAvatar] = useState<File | undefined>();
  const [name, setName] = useState<string>(room.name);
  const [description, setDescription] = useState<string>(room.description);

  const handleSave = async () => {
    if (!name || !description) return;

    const updateData: { name: string; description: string; avatar?: string } = {
      name,
      description,
    };

    if (avatar) {
      const uploadedAvatar = (await storage.createFile(
        "avatars",
        ID.unique(),
        avatar,
      )) as StorageObject;
      updateData.avatar = uploadedAvatar.$id;
    }

    console.log("UPDATE DATA:", updateData);
    await databases.updateDocument(database, "rooms", room.$id, updateData);
  };

  return (
    <div className={"w-full h-full flex flex-col gap-4 relative "}>
      <h2 className={"flex flex-row gap-2 items-center"}>
        <FaCog /> Room Settings
      </h2>
      <div className={"flex flex-col gap-2"}>
        <h2>Room Information</h2>
        <div className={"flex flex-col gap-2"}>
          <div className={"flex flex-col md:flex-row gap-2 items-center"}>
            <AvatarPicker
              inputName={"roomAvatar"}
              image={avatar}
              setImage={setAvatar}
              defaultAvatar={room.avatar}
              showText={false}
            />
            <LabelInput
              placeholder={"Name"}
              value={name}
              onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
                setName(e.target.value)
              }
              icon={<FaPencil />}
              maxLength={30}
              required={true}
              className={"max-w-32 md:w-full md:max-w-64"}
            />
            <LabelInput
              placeholder={"Description"}
              value={description}
              onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
                setDescription(e.target.value)
              }
              icon={<MdOutlineDescription />}
              maxLength={30}
              required={true}
              className={"max-w-32 md:w-full md:max-w-full"}
            />
          </div>
        </div>
      </div>
      <div className={"absolute bottom-12 right-4"}>
        <Button
          hideText={true}
          onClick={() =>
            promiseToast(
              "Saving your new settings...",
              "Successfully saved the new settings!",
              "There has been an error...",
              handleSave,
            )
          }
        >
          Save
        </Button>
      </div>
    </div>
  );
};
