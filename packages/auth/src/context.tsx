import { createContext, useContext, ReactNode } from 'react';

export interface SuperOfficeClaims {
    webApiUrl: string;
    email: string;
    contextIdentifier: string;
    companyName: string;
    systemUserToken: string;
}

export interface User {
    name?: string;
    email?: string;
    profile?: any;
    superOffice?: SuperOfficeClaims;
}

export interface AuthContextType {
    user: User | null;
    token?: string;
    isAuthenticated: boolean;
    isLoading: boolean;
    login: () => void;
    logout: () => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const useAuth = () => {
    const context = useContext(AuthContext);
    if (!context) {
        throw new Error('useAuth must be used within an AuthProvider');
    }
    return context;
};

// This provider is used by the Host to inject the real OIDC state
export const SharedAuthProvider = ({
    children,
    value
}: {
    children: ReactNode;
    value: AuthContextType
}) => {
    return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};
