import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import federation from '@originjs/vite-plugin-federation'

export default defineConfig({
    plugins: [
        react(),
        federation({
            name: 'host_app',
            remotes: {
                remote_app: 'http://localhost:5001/assets/remoteEntry.js'
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
        port: 5000,
        strictPort: true,
    },
    preview: {
        port: 5000,
        strictPort: true,
    }
})
