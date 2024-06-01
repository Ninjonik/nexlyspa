import { ClientWrapper } from "./ClientWrapper.tsx";
import { BrowserRouter } from "react-router-dom";
import RoutesList from "./RoutesList.tsx";
import { UserContextProvider } from "./utils/UserContext.tsx";

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
      <UserContextProvider>
        <ClientWrapper>
          <RoutesList />
        </ClientWrapper>
      </UserContextProvider>
    </BrowserRouter>
  );
}

export default App;
