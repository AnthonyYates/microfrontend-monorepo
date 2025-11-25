import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import federation from '@originjs/vite-plugin-federation'

export default defineConfig({
    plugins: [
        react(),
        federation({
            name: 'remote_app',
            filename: 'remoteEntry.js',
            exposes: {
                './App': './src/App',
                './Button': './src/components/Button'
            },
            shared: ['react', 'react-dom', 'auth', 'web-components']
        })
    ],
    build: {
        modulePreload: false,
        target: 'esnext',
        minify: false,
        cssCodeSplit: false
    },
    server: {
        port: 5001,
        strictPort: true,
    },
    preview: {
        port: 5001,
        strictPort: true,
    }
})
