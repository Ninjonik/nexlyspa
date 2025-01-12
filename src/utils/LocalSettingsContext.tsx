import React, { createContext, ReactNode, useContext, useState } from "react";

interface LocalSettingsContextProps {
  children: ReactNode;
}

export interface LocalSettings {
  muted: boolean;
  deaf: boolean;
  theme: "light" | "dark";
}

interface LocalSettingsContextValue {
  options: LocalSettings;
  setOptions: React.Dispatch<React.SetStateAction<LocalSettings>>;
  setLocalOptions: (
    key: keyof LocalSettings,
    value?: boolean | string | number,
  ) => void;
}

const LocalSettingsContext = createContext<
  LocalSettingsContextValue | undefined
>(undefined);

export const useLocalSettingsContext = () => {
  const context = useContext(LocalSettingsContext);
  if (!context) {
    throw new Error(
      "useLocalSettingsContext must be used within a LocalSettingsContextProvider",
    );
  }
  return context;
};

export const LocalSettingsContextProvider = ({
  children,
}: LocalSettingsContextProps) => {
  const [options, setOptions] = useState<LocalSettings>(
    JSON.parse(
      localStorage.getItem("options") ??
        '{ "muted": false, "deaf": false, "theme": "dark" }',
    ),
  );

  const setLocalOptions = async (
    key: keyof typeof options,
    value?: boolean | string | number,
  ) => {
    const currentOptions = options;

    const newValue = value !== undefined ? value : !currentOptions[key];

    switch (key) {
      case "muted":
        if (!newValue) {
          try {
            await navigator.mediaDevices.getUserMedia({ audio: true });
          } catch {
            console.error("Microphone access denied");
            return;
          }
        }
        break;

      case "deaf":
        break;

      default:
        break;
    }

    // Update state and localStorage
    const updatedOptions = {
      ...currentOptions,
      [key]: newValue,
    };

    setOptions(updatedOptions);
    localStorage.setItem("options", JSON.stringify(updatedOptions));
  };

  return (
    <LocalSettingsContext.Provider
      value={{
        options,
        setOptions,
        setLocalOptions,
      }}
    >
      {children}
    </LocalSettingsContext.Provider>
  );
};
