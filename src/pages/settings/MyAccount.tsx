import { FaPencil, FaUser } from "react-icons/fa6";
import { useUserContext } from "../../utils/UserContext.tsx";
import { LabelInput } from "../../components/form/LabelInput.tsx";
import { AiTwotoneMail } from "react-icons/ai";
import { AvatarPicker } from "../../components/form/AvatarPicker.tsx";
import { useState } from "react";
import { Button } from "../../Button.tsx";
import { database, databases, storage } from "../../utils/appwrite.ts";
import { promiseToast } from "../../utils/fireToast.ts";
import { ID } from "appwrite";
import StorageObject from "../../utils/interfaces/StorageObject.ts";

export const MyAccount = () => {
  const { user, setUser } = useUserContext();
  const [avatar, setAvatar] = useState<File | undefined>();
  const [name, setName] = useState<string>();
  if (!user) return;

  const handleSave = async () => {
    if (name) {
      if (avatar) {
        const uploadedAvatar = (await storage.createFile(
          "avatars",
          ID.unique(),
          avatar,
        )) as StorageObject;
        await databases.updateDocument(database, "users", user.$id, {
          avatar: uploadedAvatar.$id,
          name: name,
        });
        setUser({ ...user, name: name, avatar: uploadedAvatar.$id });
      } else {
        await databases.updateDocument(database, "users", user.$id, {
          name: name,
        });
        setUser({ ...user, name: name });
      }
    }
  };

  console.log(user);

  return (
    <div className={"w-full h-full flex flex-col gap-4 relative"}>
      <h2 className={"flex flex-row gap-2 items-center"}>
        <FaUser /> My Account
      </h2>
      <div className={"flex flex-col gap-2"}>
        <h2>Account Information</h2>
        <div className={"flex flex-col gap-2"}>
          <LabelInput
            placeholder={"E-mail"}
            defaultValue={user.email}
            icon={<AiTwotoneMail />}
            required={true}
          />
        </div>
      </div>
      <div className={"flex flex-col gap-2"}>
        <h2>Profile Information</h2>
        <div className={"flex flex-col gap-2"}>
          <div className={"flex flex-col md:flex-row gap-2 items-center"}>
            <AvatarPicker
              inputName={"avatar"}
              image={avatar}
              setImage={setAvatar}
              defaultAvatar={user.avatar}
              showText={false}
            />
            <LabelInput
              placeholder={"Username"}
              defaultValue={user.name}
              value={name}
              onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
                setName(e.target.value)
              }
              icon={<FaPencil />}
              maxLength={30}
              required={true}
              className={"max-w-32 md:w-full"}
            />
          </div>
        </div>
      </div>
      <div className={"absolute bottom-4 right-4"}>
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
