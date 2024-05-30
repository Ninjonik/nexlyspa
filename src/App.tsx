import { ClientWrapper } from "./ClientWrapper.tsx";
import { BrowserRouter, Route, Routes } from "react-router-dom";
import { Homepage } from "./pages/Homepage.tsx";
import { Login } from "./pages/Login.tsx";

function App() {
  return (
    <BrowserRouter>
      <ClientWrapper>
        <Routes>
          <Route path="/" element={<Homepage />} />
          <Route path="/login" element={<Login />} />
        </Routes>
      </ClientWrapper>
    </BrowserRouter>
  );
}

export default App;
