import React, { createContext, useContext, useState, ReactNode } from 'react';
import { UserType, USER_CREDENTIALS } from '../constants';

interface UserContextType {
    currentUser: UserType | null;
    setCurrentUser: (user: UserType | null) => void;
    getUserDisplayName: () => string;
}

const UserContext = createContext<UserContextType | undefined>(undefined);

export const UserProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
    const [currentUser, setCurrentUser] = useState<UserType | null>(null);

    const getUserDisplayName = (): string => {
        if (!currentUser) return 'Guest';
        return USER_CREDENTIALS[currentUser].displayName;
    };

    return (
        <UserContext.Provider value={{
            currentUser,
            setCurrentUser,
            getUserDisplayName
        }}>
            {children}
        </UserContext.Provider>
    );
};

export const useUser = (): UserContextType => {
    const context = useContext(UserContext);
    if (context === undefined) {
        throw new Error('useUser must be used within a UserProvider');
    }
    return context;
};

export default UserContext;
