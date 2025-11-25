# Microfrontend Monorepo with Web Components

A modern microfrontend application built with **Vite**, **React**, **Module Federation**, and **Web Components**, organized as a **Turborepo** monorepo. This project demonstrates how to build scalable web applications by composing independent microfrontend applications and framework-agnostic web components.

## 🏗️ Architecture Overview

This project implements a microfrontend architecture with:

- **Host Application** (`apps/host`) - The main shell application running on port 5000
  - Runs on `http://localhost:5000`
  - Manages OIDC authentication with SuperOffice
  - Hosts the company search web component
  - Loads `apps/remote` at runtime via Module Federation
  
- **Remote Application** (`apps/remote`) - An independent microfrontend running on port 5001
  - Runs on `http://localhost:5001`
  - Consumes the shared authentication context
  - Displays company search results via web component
  - Listens for search events from Host app
  
- **Shared Auth Package** (`packages/auth`) - Shared React auth components
  - Exports `AuthContext` and `useAuth` hook
  - Acts as the bridge between the Host's OIDC provider and Remote's consumption
  
- **Shared UI Package** (`packages/ui`) - Shared React components
  - Reusable UI components used across applications
  
- **Web Components Package** (`packages/web-components`) - Framework-agnostic custom elements
  - `company-search` - Search input custom element
  - `company-results` - Results table custom element
  - Shared via Module Federation and used with React wrappers

## 📁 Project Structure

```
.
├── apps/
│   ├── host/              # Host/Shell application (port 5000)
│   │   ├── src/
│   │   │   ├── App.tsx    # Main app consuming remote components
│   │   │   ├── AuthProvider.tsx    # OpenID Connect AppAuthProvider
│   │   │   ├── components/
│   │   │   │   ├── CompanySearchWrapper.tsx  # React wrapper for search component
│   │   │   │   └── ErrorBoundary.tsx         # Error boundary for remote modules
│   │   │   └── main.tsx
│   │   ├── vite.config.ts # Federation configuration (consumer)
│   │   └── package.json
│   │
│   └── remote/            # Remote microfrontend (port 5001)
│       ├── src/
│       │   ├── App.tsx     # Exposed remote app component
│       │   ├── main.tsx    # Remote app entry point
│       │   ├── StandAloneAuthProvider.tsx # For standalone testing
│       │   └── components/
│       │       ├── Button.tsx # Exposed remote button component
│       │       ├── CompanyInfo.tsx # Company info display
│       │       └── CompanyResultsWrapper.tsx # React wrapper for results component
│       ├── vite.config.ts # Federation configuration (provider)
│       └── package.json
│
├── packages/
│   ├── auth/                # Shared Auth and useAuth() hook
│   │   ├── src/
│   │   │   ├── Context.tsx
│   │   │   └── index.tsx
│   │   ├── package.json
│   │   └── tsconfig.json
│   ├── ui/                # Shared UI component library
│   │   ├── src/
│   │   │   ├── Button.tsx
│   │   │   └── index.tsx
│   │   └── package.json
│   └── web-components/    # Framework-agnostic Web Components
│       ├── src/
│       │   ├── company-search.ts   # Search input custom element
│       │   ├── company-results.ts  # Results table custom element
│       │   └── index.ts
│       ├── vite.config.ts
│       └── package.json
│
├── package.json           # Root workspace configuration
└── turbo.json            # Turborepo pipeline configuration
```

## 🔌 Module Federation Setup

### Host Application

The host consumes remote modules and shares dependencies:

```typescript
// apps/host/vite.config.ts
federation({
    name: 'host_app',
    remotes: {
        remote_app: 'http://localhost:5001/assets/remoteEntry.js'
    },
    shared: ['react', 'react-dom', 'auth', 'web-components']
})
```

### Remote Application

The remote exposes components and shares dependencies:

```typescript
// apps/remote/vite.config.ts
federation({
    name: 'remote_app',
    filename: 'remoteEntry.js',
    exposes: {
        './App': './src/App',
        './Button': './src/components/Button'
    },
    shared: ['react', 'react-dom', 'auth', 'web-components']
})
```

## 🌐 Web Components Integration

### Custom Elements

The `packages/web-components` package provides framework-agnostic custom elements:

- **`<company-search>`** - Search input with integrated API calls
  - Attributes: `api-url`, `token`
  - Events: `company-results` (fires when search completes)
  
- **`<company-results>`** - Results display table
  - Property: `results` (array of company data)

### React Wrappers

To properly integrate custom elements with React, wrapper components are used:

```typescript
// CompanySearchWrapper.tsx
export function CompanySearchWrapper({ apiUrl, token, onResults }) {
    const containerRef = useRef<HTMLDivElement>(null);
    
    useEffect(() => {
        // Dynamic import to prevent tree-shaking
        import('web-components').then(() => {
            const searchElement = document.createElement('company-search');
            searchElement.setAttribute('api-url', apiUrl);
            searchElement.setAttribute('token', token);
            searchElement.addEventListener('company-results', handleResults);
            containerRef.current.appendChild(searchElement);
        });
    }, [apiUrl, token]);
    
    return <div ref={containerRef}></div>;
}
```

### Cross-App Communication

Since Host and Remote are separate applications, they communicate via window-level events:

1. **Host App**: Search component fires `company-results` event
2. **Host App**: Wrapper catches event and dispatches to window:
   ```typescript
   window.dispatchEvent(new CustomEvent('company-search-results', {
       detail: { results }
   }));
   ```
3. **Remote App**: Listens for window event and updates results component:
   ```typescript
   window.addEventListener('company-search-results', (event) => {
       setSearchResults(event.detail.results);
   });
   ```

## 🛡️ Authentication Flow

1. **Host** wraps the app in `AppAuthProvider` (using `react-oidc-context`)
2. **Host** injects the OIDC user state into the shared `AuthContext` from `packages/auth`
3. **Remote** imports `useAuth` from `packages/auth` to access `user` and `isAuthenticated`
4. **Module Federation** ensures both apps share the *same instance* of the Context, allowing state to persist across the boundary

## 🚀 Getting Started

### Prerequisites

- Node.js (v18 or higher recommended)
- npm 9.6.0 or higher

### Installation

```bash
# Install dependencies for all workspaces
npm install
```

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
- Web-components at `http://localhost:4174`

> **Important:** The remote application must be running before the host application can load remote components.

> **Note on Dev Mode:** Module Federation with `@originjs/vite-plugin-federation` does not generate `remoteEntry.js` in dev mode due to Vite's bundleless architecture. Use `npm run build` followed by `npm run preview` for testing Module Federation.

### Configuration

The OIDC configuration is located in `apps/host/src/AuthProvider.tsx`:

```typescript
const oidcConfig = {
  authority: 'https://sod.superoffice.com/login',
  client_id: 'ADD_YOUR_CLIENT_ID', // get from SuperOffice Developer Portal: https://dev.superoffice.com
  redirect_uri: window.location.origin,
  metadata: {
    issuer: 'https://sod.superoffice.com/login',
    authorization_endpoint: 'https://sod.superoffice.com/login/common/oauth/authorize',
    // ...
  }
};
```

## 🧩 Key Features

### Module Federation
- **Dynamic Module Loading**: Host application loads remote components at runtime
- **Shared Dependencies**: React, React-DOM, auth, and web-components are shared to avoid duplication
- **Independent Deployment**: Each microfrontend can be developed, built, and deployed independently

### Web Components
- **Framework Agnostic**: Custom elements work with any framework or vanilla JS
- **Shadow DOM**: Encapsulated styles and markup
- **Event-Driven**: Custom events for component communication

### Monorepo Benefits
- **Shared Packages**: Common components and utilities shared across applications
- **Workspace Management**: npm workspaces for dependency management
- **Turborepo**: Parallel task execution and intelligent caching for faster builds

### Error Boundaries
- Graceful degradation when remote modules fail to load
- User-friendly error messages

## 📦 Available Scripts

### Root Level

- `npm run build` - Build all applications
- `npm run preview` - Preview production builds (parallel execution)
- `npm run dev` - Start all applications in development mode (limited Module Federation support)

### Individual Apps

Navigate to  `apps/host` or `apps/remote`:

- `npm run dev` - Start individual app in development mode
- `npm run build` - Build individual app
- `npm run preview` - Preview individual app production build

## 🛠️ Technology Stack

- **Frontend Framework**: React 18
- **Build Tool**: Vite 4
- **Module Federation**: @originjs/vite-plugin-federation
- **Web Components**: Custom Elements API
- **Authentication**: react-oidc-context (SuperOffice OIDC)
- **Monorepo Tool**: Turborepo 2.6
- **Package Manager**: npm workspaces
- **Language**: TypeScript 5

## 🔄 Development Workflow

1. **Build First**: Run `npm run build` to generate all bundles including `remoteEntry.js`
2. **Preview Mode**: Use `npm run preview` to test Module Federation
3. **Independent Development**: Each microfrontend can be developed independently
4. **Shared Components**: Use the `ui` and `web-components` packages for cross-app components
5. **Type Safety**: TypeScript configurations for type checking across the monorepo

## 📝 Notes

### React + Web Components

- Direct JSX usage of custom elements doesn't work well with React
- Use wrapper components that create elements via `document.createElement()`
- Dynamic imports prevent tree-shaking of web-components package

### Module Federation

- The host application uses `React.lazy()` and `Suspense` for loading remote components
- Both applications share the same React and React-DOM instances to prevent version conflicts
- TypeScript ignore comments are used for remote imports due to dynamic module federation typing
- `ErrorBoundary` components wrap remote modules to handle loading failures gracefully

### SuperOffice API Integration

- Company search uses SuperOffice WebAPI v1 endpoints
- Bearer token authentication from OIDC login
- OData-style query syntax for filtering

## 🤝 Contributing

When adding new features:

1. Keep microfrontends independent and loosely coupled
2. Share common React components through the `packages/ui` library
3. Share framework-agnostic components through `packages/web-components`
4. Use React wrappers for custom elements in React apps
5. Update exposed modules in remote's `vite.config.ts` when adding new exports
6. Ensure all builds pass before committing: `npm run build`
7. Document cross-app communication patterns (events, shared context)

## 📄 License

This project is licensed under the MIT License.