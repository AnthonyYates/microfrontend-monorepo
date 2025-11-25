import React, { Suspense } from 'react'
import { Button } from 'ui'
import { AppAuthProvider } from './AuthProvider'
import { useAuth } from 'auth'
import { CompanySearchWrapper } from './components/CompanySearchWrapper'
import { ErrorBoundary } from './components/ErrorBoundary'

// Lazy load the remote component
// @ts-ignore
const RemoteApp = React.lazy(() => import('remote_app/App'))
// @ts-ignore
const RemoteButton = React.lazy(() => import('remote_app/Button'))

function AppContent() {
    const { user, isAuthenticated, login, logout, token } = useAuth();

    const handleSearchResults = (results: any) => {
        console.log('Search Results:', results);
        // Dispatch results as a window-level event so the Remote app can listen
        window.dispatchEvent(new CustomEvent('company-search-results', {
            detail: { results }
        }));
    };

    return (
        <div style={{ padding: '20px', fontFamily: 'sans-serif' }}>
            <h1>Host Application</h1>

            <div style={{ marginBottom: '20px', padding: '10px', border: '1px solid #ccc' }}>
                <h3>Authentication Status</h3>
                {isAuthenticated ? (
                    <div>
                        <p>Welcome, <strong>{user?.name}</strong>!</p>
                        <Button onClick={logout}>Logout</Button>

                        <div style={{ marginTop: '20px' }}>
                            <h3>Company Search (Web Component)</h3>
                            <CompanySearchWrapper
                                apiUrl={user?.superOffice?.webApiUrl || ''}
                                token={token || ''}
                                onResults={handleSearchResults}
                            />
                        </div>

                    </div>
                ) : (
                    <div>
                        <p>You are not logged in.</p>
                        <Button onClick={login}>Login with SuperOffice</Button>
                    </div>
                )}
            </div>

            <div style={{ marginBottom: '20px' }}>
                <h3>Shared UI Component (Local)</h3>
                <Button onClick={() => alert('Clicked Host Button')}>Host Button</Button>
            </div>

            <hr />

            <ErrorBoundary fallback={<div style={{ color: 'orange', padding: '10px' }}>⚠️ Remote App failed to load. Make sure the remote server is running on port 5001.</div>}>
                <Suspense fallback={<div>Loading Remote App...</div>}>
                    <RemoteApp />
                </Suspense>
            </ErrorBoundary>

            <hr />

            <ErrorBoundary fallback={<div style={{ color: 'orange', padding: '10px' }}>⚠️ Remote Button failed to load.</div>}>
                <Suspense fallback={<div>Loading Remote Button...</div>}>
                    <h3>Remote Button (Imported from Remote)</h3>
                    <RemoteButton />
                </Suspense>
            </ErrorBoundary>
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
