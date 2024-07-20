import React, {createContext, ReactNode, useContext, useState} from 'react';
import {User} from "../models/models.ts";

interface AuthContextType {
    loggedInUser: User | null;
    setLoggedInUser: (user: User | null) => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: ReactNode }> = ({children}) => {

    const [loggedInUser, setLoggedInUser] = useState<User | null>(null);

    return (
        <AuthContext.Provider value={{loggedInUser, setLoggedInUser}}>
            {children}
        </AuthContext.Provider>
    );
};

// Custom hook for using the AuthContext
export const useAuth = (): AuthContextType => {
    const context = useContext(AuthContext);
    if (!context) {
        throw new Error('useAuth must be used within an AuthProvider');
    }
    return context;
};