# Microfrontend Monorepo

A modern microfrontend application built with **Vite**, **React**, and **Module Federation**, organized as a **Turborepo** monorepo. This project demonstrates how to build scalable web applications by composing independent microfrontend applications.

## 🏗️ Architecture Overview

This project implements a microfrontend architecture with:

- **Host Application** (`apps/host`) - The main shell application running on port 5000
- **Remote Application** (`apps/remote`) - An independent microfrontend running on port 5001
- **Shared UI Package** (`packages/ui`) - Shared React components used across applications

The host application dynamically loads components from the remote application at runtime using **Vite Module Federation**.

## 📁 Project Structure

```
.
├── apps/
│   ├── host/              # Host/Shell application (port 5000)
│   │   ├── src/
│   │   │   ├── App.tsx    # Main app consuming remote components
│   │   │   └── main.tsx
│   │   ├── vite.config.ts # Federation configuration (consumer)
│   │   └── package.json
│   │
│   └── remote/            # Remote microfrontend (port 5001)
│       ├── src/
│       │   ├── App.tsx    # Exposed remote app component
│       │   └── components/
│       │       └── Button.tsx # Exposed remote button component
│       ├── vite.config.ts # Federation configuration (provider)
│       └── package.json
│
├── packages/
│   ├── auth/                # Shared Auth component library
│   │   ├── src/
│   │   │   ├── Context.tsx
│   │   │   └── index.tsx
│   │   ├── package.json
│   │   └── tsconfig.json
│   └── ui/                # Shared UI component library
│       ├── src/
│       │   ├── Button.tsx
│       │   └── index.tsx
│       └── package.json
│
├── package.json           # Root workspace configuration
└── turbo.json            # Turborepo pipeline configuration
```

## 🔌 Module Federation Setup

### Host Application
The host consumes remote modules:

```typescript
// apps/host/vite.config.ts
federation({
    name: 'host_app',
    remotes: {
        remote_app: 'http://localhost:5001/assets/remoteEntry.js'
    },
    shared: ['react', 'react-dom']
})
```

### Remote Application
The remote exposes components:

```typescript
// apps/remote/vite.config.ts
federation({
    name: 'remote_app',
    filename: 'remoteEntry.js',
    exposes: {
        './App': './src/App',
        './Button': './src/components/Button'
    },
    shared: ['react', 'react-dom']
})
```

## 🚀 Getting Started

### Prerequisites
- Node.js (v18 or higher recommended)
- npm 9.6.0 or higher

### Installation

```bash
# Install dependencies for all workspaces
npm install
```

### Development

Run all applications in development mode:

```bash
npm run dev
```

This will start:
- Host application at `http://localhost:5173`
- Remote application at `http://localhost:5174`

### Build

Build all applications:

```bash
npm run build
```

### Preview

Preview production builds:

```bash
npm run preview
```

This will start:
- Host application at `http://localhost:5000`
- Remote application at `http://localhost:5001`

**Important:** The remote application must be running before the host application can load remote components.

## 🧩 Key Features

### Module Federation
- **Dynamic Module Loading**: Host application loads remote components at runtime
- **Shared Dependencies**: React and React-DOM are shared between applications to avoid duplication
- **Independent Deployment**: Each microfrontend can be developed, built, and deployed independently

### Monorepo Benefits
- **Shared Packages**: Common UI components in `packages/ui` are shared across applications
- **Workspace Management**: npm workspaces for dependency management
- **Turborepo**: Parallel task execution and intelligent caching for faster builds

### Exposed Remote Components
The remote application exposes:
1. `./App` - Complete remote application component
2. `./Button` - Individual button component

## 📦 Available Scripts

### Root Level
- `npm run dev` - Start all applications in development mode
- `npm run build` - Build all applications
- `npm run preview` - Preview production builds (parallel execution)
- `npm run lint` - Lint all workspaces
- `npm run format` - Format code with Prettier

### Individual Apps
Navigate to `apps/host` or `apps/remote`:
- `npm run dev` - Start individual app in development mode
- `npm run build` - Build individual app
- `npm run preview` - Preview individual app production build

## 🛠️ Technology Stack

- **Frontend Framework**: React 18
- **Build Tool**: Vite 4
- **Module Federation**: @originjs/vite-plugin-federation
- **Monorepo Tool**: Turborepo 2.6
- **Package Manager**: npm workspaces
- **Language**: TypeScript 5

## 🔄 Development Workflow

1. **Start Remote First**: Always start the remote application before the host in preview mode
2. **Independent Development**: Each microfrontend can be developed independently
3. **Shared Components**: Use the `ui` package for components shared across applications
4. **Type Safety**: TypeScript configurations for type checking across the monorepo

## 📝 Notes

- The host application uses `React.lazy()` and `Suspense` for loading remote components
- Both applications share the same React and React-DOM instances to prevent version conflicts
- TypeScript ignore comments are used for remote imports due to dynamic module federation typing

## 🤝 Contributing

When adding new features:
1. Keep microfrontends independent and loosely coupled
2. Share common components through the `packages/ui` library
3. Update exposed modules in remote's `vite.config.ts` when adding new exports
4. Ensure all builds pass before committing: `npm run build`

## 📄 License

This project is private and not licensed for public use.
