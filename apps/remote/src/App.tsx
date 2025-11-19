import { useState } from 'react'
import { Button } from 'ui'
import { useAuth } from 'auth'

function App() {
    const [count, setCount] = useState(0)
    const { user, isAuthenticated } = useAuth()

    return (
        <div style={{ border: '2px dashed red', padding: '20px', margin: '10px' }}>
            <h2>Remote Application</h2>
            <p>This is the remote application running.</p>

            <div style={{ marginBottom: '10px', padding: '5px', backgroundColor: '#f0f0f0' }}>
                <strong>Remote Auth State:</strong> {isAuthenticated ? `Logged in as ${user?.name}` : 'Not Logged In'}
            </div>

            <div style={{ display: 'flex', gap: '10px', alignItems: 'center' }}>
                <span>Count: {count}</span>
                <Button onClick={() => setCount((count) => count + 1)}>
                    Increment Remote
                </Button>
            </div>
        </div>
    )
}

export default App
