# Fretment

Fretment is a collaborative project and task management application designed with a warm, editorial aesthetic and real-time synchronization. Built with a full-stack TypeScript architecture, Fretment delivers multi-tenant project workspaces, responsive Kanban boards, instant team notifications via WebSockets, threaded task discussions, and granular role-based access control.

## Overview

Fretment provides software engineering and product teams with a distraction-free, responsive environment for tracking deliverables and coordinating work across team members. 

Key architectural attributes include:
- Warm, tactile visual design featuring cream backgrounds, olive and sage green accents, deep charcoal typography, and subtle paper texture styling.
- Decoupled client-server architecture with a Next.js App Router frontend and an Express REST API backend.
- Bi-directional event communication using Socket.IO for immediate dashboard metric synchronization, task updates, and notification streams.
- Relational data integrity enforced via PostgreSQL and Prisma ORM.

## Features

### Authentication and Session Management
- Secure user registration and authentication with bcrypt password hashing and JSON Web Tokens (JWT).
- Persistent client-side session handling with automatic token validation and clean logout mechanics.
- User profile dashboard displaying account status and session metadata.

### Project and Workspace Directory
- Multi-project workspace management supporting custom color tagging, role-based memberships (Owner, Member), and metadata descriptions.
- Instant workspace search and filterable directory views.
- Member invitation and role-based removal workflows.

### Task Management and Kanban Board
- Visual Kanban workflow organized across four standard stages: Todo, In Progress, Review, and Done.
- Priority levels: Low, Medium, High, and Urgent.
- Task attribution with assignees, due date tracking, overdue state calculations, and dynamic ordering.
- Modal-based task creation, comprehensive detail inspection, inline editing, and deletion.

### Real-Time Discussions and Comments
- Threaded commenting within task detail views.
- Edit and delete capabilities for authors and project administrators.
- Instant synchronization of newly posted comments to connected team members.

### Live Notifications and Event Streaming
- Centralized notification inbox and header dropdown alert stream for task assignments, comment additions, and project invitations.
- Live event badge displaying active connection status (Fretment Live).
- Read, unread, and bulk mark-as-read state toggles.

### Responsive Navigation
- Collapsible desktop sidebar with direct navigation to projects, notifications, and profile views.
- Dedicated mobile header and sliding drawer menu optimized for touchscreen targets (minimum 44px touch boundaries).

## Tech Stack

### Frontend
- Next.js 16 (App Router, Turbopack)
- React 19
- TypeScript
- Tailwind CSS v4
- Lucide React (Iconography)
- Socket.IO Client

### Backend
- Node.js & Express 5
- TypeScript (`tsx` runtime execution)
- Prisma ORM with `@prisma/adapter-pg`
- PostgreSQL
- Socket.IO (WebSocket server)
- JSON Web Token (JWT)
- Zod (Schema validation middleware)
- Bcrypt (Password hashing)

## Project Structure

```text
CodeAlpha_Fretment/
├── backend/
│   ├── prisma/
│   │   └── schema.prisma         # Database schema definitions and relations
│   ├── src/
│   │   ├── config/
│   │   │   └── prisma.ts         # Prisma client initialization with PostgreSQL adapter
│   │   ├── middleware/
│   │   │   ├── auth.ts           # JWT authentication and route protection middleware
│   │   │   └── validate.ts       # Zod schema validation middleware
│   │   ├── modules/
│   │   │   ├── auth/             # User registration, login, and token generation
│   │   │   ├── comments/         # Task comment creation, editing, and deletion
│   │   │   ├── members/          # Project team membership and permission handling
│   │   │   ├── notifications/    # User notification querying and read status updates
│   │   │   ├── projects/         # Project workspace CRUD and ownership verification
│   │   │   ├── sockets/          # Socket.IO connection handling and event routing
│   │   │   ├── tasks/            # Task status transitions, CRUD, and assignment
│   │   │   └── users/            # Current user profile endpoint
│   │   ├── app.ts                # Express application and route registration
│   │   └── server.ts             # HTTP server and Socket.IO initialization
│   ├── package.json
│   └── tsconfig.json
├── frontend/
│   ├── src/
│   │   ├── app/
│   │   │   ├── (auth)/
│   │   │   │   ├── login/        # Sign-in page
│   │   │   │   └── register/     # Account registration page
│   │   │   ├── (dashboard)/
│   │   │   │   ├── dashboard/    # Metric overview and pending tasks queue
│   │   │   │   ├── notifications/# Centralized alert stream
│   │   │   │   ├── profile/      # User account settings
│   │   │   │   ├── projects/     # Project directory and workspace boards
│   │   │   │   └── layout.tsx    # Dashboard shell with responsive navigation
│   │   │   ├── globals.css       # Core design tokens and tactile styles
│   │   │   ├── layout.tsx        # Root HTML layout and context providers
│   │   │   └── page.tsx          # Homepage with compact hero CTAs and feature highlights
│   │   ├── components/
│   │   │   ├── comments/         # Comment list and creation form
│   │   │   ├── layout/           # Header, Sidebar, and MobileNav
│   │   │   ├── notifications/    # Notification dropdown and item components
│   │   │   ├── projects/         # Project cards, creation modal, and member managers
│   │   │   ├── tasks/            # Kanban board, task cards, badges, and modals
│   │   │   └── ui/               # Reusable primitives (Button, Card, Input, Modal, etc.)
│   │   ├── context/
│   │   │   ├── AuthContext.tsx   # Global authentication and session state
│   │   │   └── NotificationContext.tsx # Notification and real-time socket events state
│   │   ├── lib/
│   │   │   ├── api.ts            # Typed HTTP client for backend endpoints
│   │   │   ├── socket.ts         # Socket.IO client instance singleton
│   │   │   ├── types.ts          # Shared TypeScript interfaces
│   │   │   └── utils.ts          # Class merging and formatting helpers
│   │   └── proxy.ts              # Route protection middleware
│   ├── package.json
│   ├── tsconfig.json
│   └── next.config.ts
└── README.md
```

## Environment Variables

### Backend Configuration (`backend/.env`)

| Variable | Description | Example Value |
|---|---|---|
| `PORT` | HTTP server port | `5000` |
| `DATABASE_URL` | PostgreSQL connection string | `postgresql://user:password@localhost:5432/fretment_db?schema=public` |
| `JWT_SECRET` | Secret string used for signing JWT auth tokens | `your_jwt_secret_key` |
| `CLIENT_URL` | Allowed CORS origin for frontend client | `http://localhost:3000` |

### Frontend Configuration (`frontend/.env.local`)

| Variable | Description | Example Value |
|---|---|---|
| `NEXT_PUBLIC_API_URL` | Base URL for REST API requests | `http://localhost:5000/api` |
| `NEXT_PUBLIC_SOCKET_URL` | Base URL for Socket.IO WebSocket connections | `http://localhost:5000` |

## Getting Started

### Prerequisites
- Node.js (v18 or higher recommended)
- npm, yarn, or pnpm
- PostgreSQL database instance

### 1. Backend Setup

1. Navigate to the backend directory:
   ```bash
   cd backend
   ```

2. Install dependencies:
   ```bash
   npm install
   ```

3. Configure environment variables in `backend/.env`:
   ```env
   PORT=5000
   DATABASE_URL="postgresql://postgres:postgres@localhost:5432/fretment?schema=public"
   JWT_SECRET="super-secret-jwt-key"
   CLIENT_URL="http://localhost:3000"
   ```

4. Run Prisma database migrations and generate the client:
   ```bash
   npx prisma migrate dev --name init
   npx prisma generate
   ```

5. Start the backend development server:
   ```bash
   npm run dev
   ```
   The backend server will run at `http://localhost:5000`.

### 2. Frontend Setup

1. Navigate to the frontend directory:
   ```bash
   cd frontend
   ```

2. Install dependencies:
   ```bash
   npm install
   ```

3. Configure environment variables in `frontend/.env.local`:
   ```env
   NEXT_PUBLIC_API_URL="http://localhost:5000/api"
   NEXT_PUBLIC_SOCKET_URL="http://localhost:5000"
   ```

4. Start the Next.js development server:
   ```bash
   npm run dev
   ```
   The web application will be accessible at `http://localhost:3000`.

## Application Flow

1. **Authentication Flow**: When a user registers or logs in, credentials pass through Zod request validation. The backend generates a signed JWT returned in the response payload. The client stores the token in `localStorage` and initializes both the API client headers and the authenticated Socket.IO connection.
2. **Data Hydration**: On loading project or dashboard routes, the frontend fetches relational data (projects, member lists, tasks, metrics) through typed API modules with defensive error handling and fallbacks.
3. **Real-Time Event Propagation**: When modifications occur (such as creating a task, posting a comment, or assigning a collaborator), the backend emits Socket.IO events to relevant user and project channels.
4. **Client Event Re-evaluation**: The frontend `NotificationContext` and workspace views listen to live events, appending incoming notification items and triggering quiet state revalidations without full page reloads.

## Running the Application

- **Frontend Application**: `http://localhost:3000`
- **Backend REST API**: `http://localhost:5000/api`
- **Socket.IO Real-Time Gateway**: `http://localhost:5000`

## Assessment Notes

- **Type Safety**: End-to-end typing implemented using TypeScript interfaces shared across API calls, UI components, and state providers.
- **Design System Consistency**: Reusable UI component architecture ensuring unified borders, typography scale, focus states, and button sizing.
- **Defensive Error Handling**: API client gracefully intercepts unauthorized requests, network drops, and validation errors with user-friendly alerts and fallback states.
- **Zero Extraneous Dependencies**: Clean implementation relying on standard React patterns, native fetch, Tailwind utility classes, and direct Socket.IO primitives.
