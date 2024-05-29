import React, { createContext, useContext, ReactNode, useState } from 'react';

interface UserContextState {
    user: never | null;
    setUser: React.Dispatch<React.SetStateAction<never | null>>;
}


interface UserContextProps {
    children: ReactNode;
}

const UserContext = createContext<UserContextState | null>(null);

export const useUserContext = () => {
    const context = useContext(UserContext);
    if (!context) {
        throw new Error('useUserContext must be used within a UserContextProvider');
    }
    return context;
};

export const UserContextProvider = ({ children }: UserContextProps) => {
    const [user, setUser] = useState<never | null>(null);


    return (
        <UserContext.Provider value={{ user, setUser }}>
            {children}
        </UserContext.Provider>
    );
};
