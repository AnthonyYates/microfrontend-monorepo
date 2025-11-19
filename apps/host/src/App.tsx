import React, { Suspense } from 'react'
import { Button } from 'ui'
import { AppAuthProvider } from './AuthProvider'
import { useAuth } from 'auth'

// Lazy load the remote component
// @ts-ignore
const RemoteApp = React.lazy(() => import('remote_app/App'))
// @ts-ignore
const RemoteButton = React.lazy(() => import('remote_app/Button'))

function AppContent() {
    const { user, isAuthenticated, login, logout } = useAuth();

    return (
        <div style={{ padding: '20px', fontFamily: 'sans-serif' }}>
            <h1>Host Application</h1>

            <div style={{ marginBottom: '20px', padding: '10px', border: '1px solid #ccc' }}>
                <h3>Authentication Status</h3>
                {isAuthenticated ? (
                    <div>
                        <p>Welcome, <strong>{user?.name}</strong>!</p>
                        <Button onClick={logout}>Logout</Button>
                    </div>
                ) : (
                    <div>
                        <p>You are not logged in.</p>
                        <Button onClick={login}>Login with SuperOffice!</Button>
                    </div>
                )}
            </div>

            <div style={{ marginBottom: '20px' }}>
                <h3>Shared UI Component (Local)</h3>
                <Button onClick={() => alert('Clicked Host Button')}>Host Button</Button>
            </div>

            <hr />

            <Suspense fallback={<div>Loading Remote App...</div>}>
                <RemoteApp />
            </Suspense>

            <hr />

            <Suspense fallback={<div>Loading Remote Button...</div>}>
                <h3>Remote Button (Imported from Remote)</h3>
                <RemoteButton />
            </Suspense>
        </div>
    )
}

function App() {
    return (
        <AppAuthProvider>
            <AppContent />
        </AppAuthProvider>
    )
}

export default App
