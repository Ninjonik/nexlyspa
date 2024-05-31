import { ClientWrapper } from "./ClientWrapper.tsx";
import { BrowserRouter } from "react-router-dom";
import RoutesList from "./RoutesList.tsx";

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
      <ClientWrapper>
        <RoutesList />
      </ClientWrapper>
    </BrowserRouter>
  );
}

export default App;
