import React from 'react';
import { AuthProvider as OIDCProvider, useAuth as useOIDCAuth } from 'react-oidc-context';
import { SharedAuthProvider } from 'auth';

const oidcConfig = {
    authority: 'https://sod.superoffice.com/login',
    client_id: 'YOUR_CLIENT_ID_HERE',
    //redirect_uri: window.location.origin,
    redirect_uri: 'http://localhost:5000',
    metadata: {
        issuer: 'https://sod.superoffice.com/login',
        authorization_endpoint: 'https://sod.superoffice.com/login/common/oauth/authorize',
        token_endpoint: 'https://sod.superoffice.com/login/common/oauth/tokens',
        jwks_uri: 'https://sod.superoffice.com/login/common/oauth/jwks',
        userinfo_endpoint: 'https://sod.superoffice.com/login/common/oauth/userinfo',
        end_session_endpoint: 'https://sod.superoffice.com/login/common/oauth/logout',
    },
    onSigninCallback: () => {
        window.history.replaceState({}, document.title, window.location.pathname);
    }
};

const AuthBridge = ({ children }: { children: React.ReactNode }) => {
    const auth = useOIDCAuth();

    const sharedAuthValue = {
        user: auth.user ? {
            name: auth.user.profile.name || auth.user.profile.sub,
            email: auth.user.profile.email,
            profile: auth.user.profile
        } : null,
        isAuthenticated: auth.isAuthenticated,
        isLoading: auth.isLoading,
        login: () => auth.signinRedirect(),
        logout: () => auth.signoutRedirect(),
    };

    if (auth.isLoading) {
        return <div>Loading Auth...</div>;
    }

    if (auth.error) {
        return <div>Auth Error: {auth.error.message}</div>;
    }

    return (
        <SharedAuthProvider value={sharedAuthValue}>
            {children}
        </SharedAuthProvider>
    );
};

export const AppAuthProvider = ({ children }: { children: React.ReactNode }) => {
    return (
        <OIDCProvider {...oidcConfig}>
            <AuthBridge>{children}</AuthBridge>
        </OIDCProvider>
    );
};
