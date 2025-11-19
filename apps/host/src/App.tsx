import React, { Suspense } from 'react'
import { Button } from 'ui'

// Lazy load the remote component
// @ts-ignore
const RemoteApp = React.lazy(() => import('remote_app/App'))
// @ts-ignore
const RemoteButton = React.lazy(() => import('remote_app/Button'))

function App() {
    return (
        <div style={{ padding: '20px', fontFamily: 'sans-serif' }}>
            <h1>Host Application</h1>
            <p>This is the main shell application.</p>

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

export default App
