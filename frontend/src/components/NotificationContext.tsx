import React, {createContext, ReactNode, useContext, useState} from 'react';

interface NotificationContextType {
    notification: Notification | null
    setNotification: (notification: Notification | null) => void;
    showSpinner: boolean
    setShowSpinner: (t: boolean) => void;
}

export type Notification = {
    message: string
    type: string
    title: string
}

const NotificationContext = createContext<NotificationContextType | undefined>(undefined);

export const NotificationProvider: React.FC<{ children: ReactNode }> = ({children}) => {

    const [notification, setNotification] = useState<Notification | null>(null);
    const [showSpinner, setShowSpinner] = useState<boolean>(false);

    return (
        <NotificationContext.Provider value={{notification, setNotification, showSpinner, setShowSpinner}}>
            {children}
        </NotificationContext.Provider>
    );
};

// Custom hook for using the AuthContext
export const useNotification = (): NotificationContextType => {
    const context = useContext(NotificationContext);
    if (!context) {
        throw new Error('useNotification must be used within an NotificationProvider');
    }
    return context;
};