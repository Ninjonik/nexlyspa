import React from 'react'
import ReactDOM from 'react-dom/client'
import App from './App.tsx'
import './index.css'
import 'react-photo-view/dist/react-photo-view.css';
import 'react-toastify/dist/ReactToastify.css';
import {UserContextProvider} from "./utils/UserContext.tsx";
import {ClientWrapper} from "./ClientWrapper.tsx";

ReactDOM.createRoot(document.getElementById('root')!).render(
    <React.StrictMode>
        <UserContextProvider>
            <ClientWrapper>
                <App/>
            </ClientWrapper>
        </UserContextProvider>
    </React.StrictMode>,
)
