import { ClientWrapper } from "./ClientWrapper.tsx";
import { BrowserRouter } from "react-router-dom";
import RoutesList from "./RoutesList.tsx";
import { UserContextProvider } from "./utils/UserContext.tsx";
import { RoomsContextProvider } from "./utils/RoomsContext.tsx";
import "@livekit/components-styles";
import { ToastContainer } from "react-toastify";
import { SlideContextProvider } from "./utils/SlideContext.tsx";
import HeartbeatService from "./components/HeartbeatService.tsx";
import "./contexify.css";
import { LocalSettingsContextProvider } from "./utils/LocalSettingsContext.tsx";
import "highlight.js/styles/github.css";

export const routeTransition = {
  initial: {
    opacity: 0,
  },
  final: {
    opacity: 100,
  },
};

function App() {
  return (
    <BrowserRouter>
      <LocalSettingsContextProvider>
        <UserContextProvider>
          <RoomsContextProvider>
            <ClientWrapper>
              <SlideContextProvider>
                <RoutesList />
                <ToastContainer />
              </SlideContextProvider>
            </ClientWrapper>
          </RoomsContextProvider>
          <HeartbeatService />
        </UserContextProvider>
      </LocalSettingsContextProvider>
    </BrowserRouter>
  );
}

export default App;
