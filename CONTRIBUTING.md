# Contributing to Cortex UI Kit

Thank you for your interest in contributing to Cortex UI Kit! This guide will help you understand the project architecture, development workflow, and how to contribute effectively.

## Table of Contents

- [Project Overview](#project-overview)
- [Architecture Overview](#architecture-overview)
- [Why Static Apps?](#why-static-apps)
- [Deep Dive: How Everything Connects](#deep-dive-how-everything-connects)
- [Project Structure](#project-structure)
- [Getting Started](#getting-started)
- [Development Workflow](#development-workflow)
- [Adding New UI Components](#adding-new-ui-components)
- [Code Style](#code-style)
- [Release Process](#release-process)

## Project Overview

Cortex UI Kit is a **monorepo** that provides embeddable, framework-agnostic UI components for the Cortex AI platform. Currently featuring a chat interface, the architecture is designed to scale and support multiple UI types in the future (form builders, etc.).

### What This Project Provides

1. **Web Components** (`@cortex-ai/ui-kit`) - Framework-agnostic UI components using native Web Components
2. **React Components** (`@cortex-ai/ui-kit-react`) - React-specific wrappers with hooks and better DX
3. **Shared Utilities** (`@cortex-ai/ui-kit-shared`) - Common types, bridge communication, and utilities
4. **Static Apps** (`static/`) - Pre-built, standalone UI applications (chat, future UIs)
5. **Backend Server** (`server/`) - API server for proxying requests to Cortex SDK

## Architecture Overview

### The Big Picture

```
┌─────────────────────────────────────────────────────────────────────────┐
│                          User's Application                              │
│  ┌───────────────────────────────────────────────────────────────────┐  │
│  │  Framework: React, Vue, Vanilla JS, Angular, etc.                 │  │
│  │                                                                    │  │
│  │  ┌──────────────────────────────────────────────────────────────┐ │  │
│  │  │  <cortex-chat> Web Component                                 │ │  │
│  │  │  or <CortexChat> React Component                             │ │  │
│  │  │                                                               │ │  │
│  │  │  ┌────────────────────────────────────────────────────────┐  │ │  │
│  │  │  │  Shadow DOM                                            │  │ │  │
│  │  │  │                                                         │  │ │  │
│  │  │  │  ┌──────────────────────────────────────────────────┐  │  │ │  │
│  │  │  │  │  <iframe src="unpkg.com/@cortex-ai/static">      │  │  │ │  │
│  │  │  │  │                                                   │  │  │ │  │
│  │  │  │  │  ┌────────────────────────────────────────────┐  │  │  │ │  │
│  │  │  │  │  │  Static Chat App (React)                   │  │  │ │  │  │
│  │  │  │  │  │  - index.html (entry point)                │  │  │ │  │  │
│  │  │  │  │  │  - index.js (bundled React app)            │  │  │ │  │  │
│  │  │  │  │  │  - index.css (Tailwind styles)             │  │  │ │  │  │
│  │  │  │  │  │                                            │  │  │ │  │  │
│  │  │  │  │  │  Components:                               │  │  │ │  │  │
│  │  │  │  │  │  - ChatProvider (State Management)         │  │  │ │  │  │
│  │  │  │  │  │  - ChatInterface (Main UI)                 │  │  │ │  │  │
│  │  │  │  │  │  - History, Messages, Composer, etc.       │  │  │ │  │  │
│  │  │  │  │  │                                            │  │  │ │  │  │
│  │  │  │  │  │  Hooks:                                    │  │  │ │  │  │
│  │  │  │  │  │  - useChat (main chat logic)               │  │  │ │  │  │
│  │  │  │  │  │  - useChatIndexedDB (persistence)          │  │  │ │  │  │
│  │  │  │  │  │  - BridgeClient (parent communication)     │  │  │ │  │  │
│  │  │  │  │  └────────────────────────────────────────────┘  │  │ │  │  │
│  │  │  │  │                                                   │  │  │ │  │
│  │  │  │  └───────────────────────────────────────────────────┘  │  │ │  │
│  │  │  │                                                         │  │ │  │
│  │  │  │  ElementBridgeExtension (postMessage handler)          │  │ │  │
│  │  │  └─────────────────────────────────────────────────────────┘  │ │  │
│  │  │                                                               │ │  │
│  │  │  Provides: api.getClientSecret(), agentId, theme, etc.       │ │  │
│  │  └──────────────────────────────────────────────────────────────┘ │  │
│  └───────────────────────────────────────────────────────────────────┘  │
└─────────────────────────────────────────────────────────────────────────┘
```

## Why Static Apps?

The Cortex UI Kit uses a **static app architecture** where UI components are pre-built and hosted on a CDN. This design choice offers several key benefits:

### 1. **Framework Independence**
- Users can integrate Cortex UIs into **any** framework (React, Vue, Angular, Svelte, vanilla JS)
- No dependency conflicts with the parent application
- Complete isolation of dependencies and styles

### 2. **Zero Bundle Size Impact**
- The UI code is loaded separately via iframe
- Parent applications don't need to bundle React, Tailwind, or any UI dependencies
- Users get a tiny Web Component wrapper (~10KB) instead of a full React app

### 3. **Instant Updates**
- Bug fixes and improvements are deployed to the CDN immediately
- All users automatically get the latest version (when using `@latest`)
- No need for users to update their dependencies or rebuild

### 4. **Style Isolation**
- Shadow DOM + iframe ensures complete CSS isolation
- No style conflicts with parent application
- Tailwind utility classes don't pollute global scope

### 5. **Security & Sandboxing**
- iframe provides a secure sandbox for running UI code
- Bridge pattern enables controlled communication
- API keys never exposed to the iframe (only client secrets)

### 6. **Scalability for Multiple UIs**
The architecture is designed to support multiple UI types in the future:

```
static/
├── apps/
│   ├── chat/           # Current: Chat interface
│   ├── form-builder/   # Future (example): Dynamic form builder
└── dist/
    ├── chat/
    │   ├── index.html
    │   ├── index.js
    │   └── index.css
    ├── dashboard/
    └── form-builder/
```

Each static app:
- Lives in its own directory under `static/apps/`
- Has its own `index.tsx` entry point
- Gets built to `static/dist/<app-name>/`
- Is published to npm as `@cortex-ai/static`
- Is hosted on unpkg.com CDN
- Has a corresponding Web Component in `packages/ui-kit/`
- Has a React wrapper in `packages/ui-kit-react/`

## Deep Dive: How Everything Connects

### 1. Static App Build Process

The build process (defined in `static/build.ts`) does the following:

1. **Cleans previous builds** and creates output directories
2. **Bundles the React app** using Bun's bundler with:
   - Entry point: `apps/chat/index.tsx`
   - Tailwind CSS processing with preflight styles
   - All dependencies bundled into a single file
   - Minification for production
3. **Copies index.html** to the output directory

**Output Structure:**
- `dist/chat/index.html` - Entry point loaded in iframe
- `dist/chat/index.js` - Bundled React app (minified)
- `dist/chat/index.css` - Generated Tailwind CSS

### 2. Hosting Strategy

**Development:**
- Uses `IFRAME_SRC` environment variable to point to local development server
- Example: `IFRAME_SRC=http://localhost:5173` for testing

**Production:**
- Static apps are published to npm as `@cortex-ai/static` package
- Automatically hosted on unpkg.com CDN
- Loaded via iframe from: `https://unpkg.com/@cortex-ai/static@latest/dist/chat/index.html`
- Users automatically get updates when using `@latest` tag

### 3. The Bridge Communication Pattern

The bridge enables secure, bidirectional communication between parent window and iframe using the `postMessage` API:

**Parent Side (ElementBridgeExtension):**
- Listens for messages from iframe using `window.addEventListener("message")`
- Validates message source matches iframe's contentWindow
- Handles two types of requests:
  - `REQUEST_OPTIONS` - Sends UI configuration (agentId, theme, etc.)
  - `REQUEST_CLIENT_SECRET` - Fetches and sends API credentials
- Sends responses back to iframe via `iframe.contentWindow.postMessage()`

**Iframe Side (BridgeClient):**
- Sends requests to parent window using `window.parent.postMessage()`
- Uses Promise-based API with unique message IDs for request/response matching
- Implements 10-second timeout for requests
- Caches responses to avoid redundant requests
- Provides two main methods: `getOptions()` and `getClientSecret()`

**Security Considerations:**
- Message validation ensures only iframe can communicate
- API keys never exposed to iframe (only client secrets)
- Controlled communication via defined message types

### 4. Static App Initialization

When the iframe loads (`static/apps/chat/index.tsx`):

1. **React app renders** into `<div id="root">` with ChatProvider wrapping the UI
2. **Bridge client initialized** to communicate with parent window
3. **Theme configuration requested** from parent via bridge
4. **Global styles applied** to `<html>` element based on theme options
5. **Chat state loaded** from IndexedDB for persistence

### 5. Chat Message Flow

The complete workflow when a user sends a message:

1. **User Input** - Message captured from composer component
2. **Local Storage** - User message saved to IndexedDB immediately
3. **UI Update** - Message displayed in chat interface
4. **Request Credentials** - BridgeClient requests client secret from parent
5. **API Call** - POST request to backend with messages and credentials
6. **Stream Response** - Server streams back AI response using Cortex SDK
7. **Real-time Updates** - UI updates as chunks arrive
8. **Persist Response** - Assistant message saved to IndexedDB
9. **Update Conversation** - Conversation metadata updated with timestamp

### 6. Data Persistence with IndexedDB

**Database Schema:**
- **conversations** store: `{ id, title, createdAt, updatedAt }`
- **messages** store: `{ id, conversationId, role, content, timestamp }`

**Benefits:**
- Chat history persists across page reloads and browser sessions
- Works offline for viewing past conversations
- No server storage required for chat history
- Privacy-friendly - data stays in user's browser
- Indexed queries for fast conversation and message retrieval

## Project Structure

The monorepo is organized into several key directories:

### `packages/` - NPM Packages

**`packages/ui-kit/`** - Web Components (@cortex-ai/ui-kit)
- Framework-agnostic Web Components (e.g., `<cortex-chat>`)
- Bridge extension for parent-side communication
- Published to npm for vanilla JS and any framework

**`packages/ui-kit-react/`** - React Wrappers (@cortex-ai/ui-kit-react)
- React-specific components with better TypeScript support
- Hooks for UI Kit integration (e.g., `useCortexUIKit`)
- Published to npm for React applications

**`packages/ui-kit-shared/`** - Shared Utilities (@cortex-ai/ui-kit-shared)
- Common types and interfaces
- Bridge communication protocol
- Cortex SDK helpers
- Used internally by other packages

### `static/` - Static Apps (@cortex-ai/static)

**`static/apps/`** - UI Applications
- Each app is a standalone React application
- Currently: `chat/` (chat interface)
- Future: dashboard, form-builder, data-table, etc.
- Each has its own components, hooks, and utils

**`static/ui/`** - Shared UI Components
- Reusable components across all static apps
- Tailwind utilities and design system

**`static/styles/`** - Global Styles
- Tailwind CSS configuration
- Theme variables and color schemes

**`static/dist/`** - Built Static Apps
- Compiled and minified apps ready for CDN
- Published to npm and hosted on unpkg.com

### `server/` - Backend API

- Express server for proxying requests to Cortex SDK
- Handles chat streaming and API authentication
- Routes and services for backend logic

### Root Files

- `bunup.config.ts` - Workspace configuration for building packages
- `package.json` - Monorepo root with workspaces
- `biome.json` - Linting and formatting configuration

## Getting Started

### Prerequisites

- **Bun** (latest version) - [Install Bun](https://bun.sh)

### Installation

```bash
# Clone the repository
git clone https://github.com/cortex-ai/ui-kit.git
cd ui-kit

# Install dependencies for all workspaces
bun install
```

### Build Everything

```bash
# Build SDKs (ui-kit, ui-kit-react, ui-kit-shared)
bun run build:sdks

# Build static apps (chat)
bun run build:static

# Or build everything at once
bun run build
```

### Development Workflow

#### Testing the Chat UI

```bash
# Run full test setup with dev server
bun run test:chat
```

This command:
1. Builds SDKs with inline environment variables
2. Starts dev server for static app at `http://localhost:5173`
3. Serves the test page at `http://localhost:3000`

Open `http://localhost:3000` to test the chat UI.

#### Manual Testing

You can also create your own test HTML file. See `test/chat.html` for a complete example of how to set up a test page with the Web Component.

## Adding New UI Components

Want to add a dashboard, form builder, or other UI? Follow these steps:

### 1. Create Static App Structure

Create a new directory under `static/apps/` for your UI:
- `index.tsx` - Entry point (use `chat/index.tsx` as reference)
- `your-ui-interface.tsx` - Main component
- `components/` - UI-specific components
- `hooks/` - React hooks (e.g., state management, IndexedDB)
- `utils/` - Helper functions

### 2. Update Build Script

Edit `static/build.ts` to add a new build target for your UI with the same configuration as the chat build (entry point, output directory, plugins).

### 3. Create Web Component

Create `packages/ui-kit/src/cortex-your-ui.ts`:
- Extend `ElementBridgeExtension` class with your UI's option type
- Implement render method to create iframe with correct src
- Use `customElements.define()` to register the Web Component
- Reference `cortex-chat.ts` as an example

### 4. Create React Wrapper

Create `packages/ui-kit-react/src/your-ui.tsx`:
- Export a React component that wraps your Web Component
- Accept `control` and `options` props
- Use `useEffect` to call `setOptions()` on the Web Component
- Reference `chat.tsx` as an example

### 5. Add to Bunup Config

Edit `bunup.config.ts` to add your new entry point:
- Add `src/cortex-your-ui.ts` to the `ui-kit` package entry array
- Add `src/your-ui.tsx` to the `ui-kit-react` package entry array

### 6. Define Types

Create `packages/ui-kit-shared/src/your-ui.ts`:
- Define the hosted URL constant for your UI
- Define TypeScript types for your UI's options
- Export any shared utilities or constants

### 7. Build and Test

Build everything and test locally using the `IFRAME_SRC` environment variable to point to your development server before publishing.

### 8. Update Documentation

- Update README.md with usage examples for your new UI
- Document all options and their types
- Add examples for both vanilla JS and React usage

## Code Style

This project uses **Biome** for linting and formatting. All code style rules are enforced automatically.

**Commands:**
```bash
# Check for issues
bun run lint

# Auto-fix issues
bun run lint:fix

# Type check all packages
bun run type-check
```

**Conventions:**
- **TypeScript**: Strict mode enabled, avoid `any` types
- **React**: Functional components with hooks
- **File naming**: kebab-case for files, PascalCase for components
- **Imports**: Use absolute imports from workspace packages (e.g., `@cortex-ai/ui-kit-shared`)
- **Comments**: JSDoc for public APIs, inline comments for complex logic

**Git Hooks:**
Pre-commit hooks automatically run linting and type checking. See `package.json` for the `simple-git-hooks` configuration.
 apps will be automatically available on unpkg.com after publishing `@cortex-ai/static`.

---

Thank you for contributing to Cortex UI Kit! Your contributions help make embeddable AI interfaces better for everyone.
