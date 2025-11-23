import React from 'react';
import { SharedAuthProvider, User } from 'auth';
export const StandaloneAuthProvider = ({ children }: { children: React.ReactNode }) => {
    // Mock user for standalone development
    const mockUser: User = {
        name: 'Standalone User',
        email: 'standalone@example.com',
        profile: { sub: 'standalone-123' },
        superOffice: {
            webApiUrl: 'https://sod2.superoffice.com/Cust26759/api/',
            email: 'standalone@example.com',
            contextIdentifier: 'Cust26759',
            companyName: 'Standalone Corp',
            systemUserToken: 'mock-system-token'
        }
    };
    const mockContext = {
        user: mockUser,
        token: 'mock-access-token', // This won't work for real API calls unless you put a valid token here, use DevNet-Tools to get one
        isAuthenticated: false, // Set to true to test authenticated UI
        isLoading: false,
        login: () => alert('Login not supported in standalone mode'),
        logout: () => alert('Logout not supported in standalone mode'),
    };
    return (
        <SharedAuthProvider value={mockContext}>
            {children}
        </SharedAuthProvider>
    );
};
