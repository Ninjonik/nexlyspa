import { useState } from "react";
import { getVersion } from "@tauri-apps/api/app";

export const Version = () => {
  const [version, setVersion] = useState<string>("");

  const fetchVersion = async () => {
    try {
      const appVersion = await getVersion();
      console.log("APP VERSION:", appVersion);
      setVersion(appVersion);
    } catch (e) {
      console.log("not in tauri window");
    }
  };

  fetchVersion();

  return <>{version}</>;
};
