import { ReactNode, useEffect, useTransition } from "react";
import { FullscreenMessage } from "./components/FullscreenMessage.tsx";

export const ClientWrapper = ({ children }: { children: ReactNode }) => {
  const [isPending, startTransition] = useTransition();

  useEffect(() => {
    const redirectIfUserNotLoggedIn = async () => {
      // const userLoggedIn = await checkIfUserLoggedIn();
    };

    startTransition(() => {
      redirectIfUserNotLoggedIn();
    });
  }, []);

  if (isPending) return <FullscreenMessage message={"Loading..."} />;

  return children;
};
