import React from 'react'
import ReactDOM from 'react-dom/client'
import App from './App'
import { StandaloneAuthProvider } from './StandaloneAuthProvider'

ReactDOM.createRoot(document.getElementById('root')!).render(
    <React.StrictMode>
        <StandaloneAuthProvider>
            <App />
        </StandaloneAuthProvider>
    </React.StrictMode>,
)
