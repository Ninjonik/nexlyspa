import { Route, Routes } from "react-router-dom";
import { Homepage } from "./pages/Homepage.tsx";
import { Login } from "./pages/Login.tsx";
import { Logout } from "./pages/Logout.tsx";
import { LoginAnonymous } from "./pages/LoginAnonymous.tsx";
import { UserContextProvider } from "./utils/UserContext.tsx";
import { Register } from "./pages/Register.tsx";
import { Verify } from "./pages/Verify.tsx";

export default function RoutesList() {
  return (
    <UserContextProvider>
      <Routes>
        <Route path="/" element={<Homepage />} />
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />
        <Route path="/register/verify" element={<Verify />} />
        <Route path="/login/anonymous" element={<LoginAnonymous />} />
        <Route path="/logout" element={<Logout />} />
      </Routes>
    </UserContextProvider>
  );
}
