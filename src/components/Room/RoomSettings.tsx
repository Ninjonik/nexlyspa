import React from "react";
import { ModalView } from "../ModalView.tsx";
import { FaGear } from "react-icons/fa6";
import { RoomSettingsForm } from "./RoomSettingsForm.tsx";
import RoomObject from "../../utils/interfaces/RoomObject.ts";

interface SettingsProps {
  shown: boolean;
  setShown: React.Dispatch<React.SetStateAction<boolean>>;
  room: RoomObject;
}

export const RoomSettings = ({ shown, setShown, room }: SettingsProps) => {
  return (
    <ModalView shown={shown} setShown={setShown}>
      <div className={"h-full grow w-2/3 md:rounded-lg p-4 bg-base-300"}>
        <h2
          className={
            "text-center flex justify-center items-center text-2xl gap-2 _md:text-center"
          }
        >
          <FaGear />{" "}
          <span className={"_md:hidden"}>{room.name}'s Settings</span>
        </h2>
        <RoomSettingsForm room={room} />
      </div>
    </ModalView>
  );
};
