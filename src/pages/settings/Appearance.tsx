import { FaPaintBrush } from "react-icons/fa";
import { ThemeSelector } from "../../components/ThemeSelector.tsx";

export const Appearance = () => {
  return (
    <div className={"w-full h-full flex flex-col gap-4 relative"}>
      <h2 className={"flex flex-row gap-2 items-center"}>
        <FaPaintBrush /> Appearance
      </h2>
      <div className={"flex flex-col gap-2"}>
        <h2>Theme</h2>
        <div className={"flex flex-col gap-2"}>
          <ThemeSelector />
        </div>
      </div>
    </div>
  );
};
