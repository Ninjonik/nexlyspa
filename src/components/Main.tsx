import { Sidebar } from "./Sidebar.tsx";
import { Outlet } from "react-router-dom";

export const Main = () => {
  return (
    <main className={"h-screen w-screen flex flex-row"}>
      <Sidebar />
      <Outlet />
    </main>
  );
};
