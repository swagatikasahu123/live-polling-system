# 🎯 Intervue Live Polling System

A resilient real-time polling system with Teacher and Student personas, built with React, Node.js, Socket.io, and MongoDB.

---

## 🚀 Quick Start

### Prerequisites
- Node.js 18+
- MongoDB (local or Atlas URI)

### Installation

```bash
# Install all dependencies
npm run install:all
```

### Environment Setup

```bash
# Backend
cp backend/.env.example backend/.env
# Edit backend/.env with your MongoDB URI
```

### Run Development Servers

**Terminal 1 — Backend:**
```bash
npm run dev:backend
# Server runs on http://localhost:3001
```

**Terminal 2 — Frontend:**
```bash
npm run dev:frontend
# App runs on http://localhost:5173
```

---

## 📁 Project Structure

```
polling-app/
├── backend/
│   └── src/
│       ├── controllers/      # HTTP request handlers
│       │   └── PollController.ts
│       ├── services/         # Business logic (source of truth)
│       │   ├── PollService.ts
│       │   └── SessionService.ts
│       ├── models/           # MongoDB schemas
│       │   ├── Poll.ts
│       │   └── Vote.ts
│       ├── socket/           # Socket.io event handlers
│       │   └── PollSocketHandler.ts
│       ├── routes/           # Express routes
│       │   └── index.ts
│       └── index.ts          # Entry point
│
└── frontend/
    └── src/
        ├── components/       # Reusable UI components
        │   ├── ChatSidebar.tsx
        │   ├── PollResults.tsx
        │   └── WaitingScreen.tsx
        ├── hooks/            # Custom React hooks
        │   ├── useSocket.ts       # All socket logic
        │   └── usePollTimer.ts    # Server-synced countdown
        ├── pages/            # Full page views
        │   ├── RoleSelectionPage.tsx
        │   ├── StudentNamePage.tsx
        │   ├── StudentQuestionPage.tsx
        │   ├── TeacherCreatePollPage.tsx
        │   ├── TeacherLiveResultsPage.tsx
        │   ├── PollHistoryPage.tsx
        │   └── KickedPage.tsx
        ├── context/          # App-wide state
        │   └── AppContext.tsx
        ├── types/            # TypeScript interfaces
        │   └── index.ts
        └── App.tsx           # Root orchestrator
```

---

## ✨ Features

### Teacher
- ✅ Create polls with custom questions, options, correct answers, and time limits (30/60/90/120s)
- ✅ Live results dashboard with real-time vote percentages
- ✅ View poll history (fetched from DB)
- ✅ Kick students from the session
- ✅ Chat with students
- ✅ State recovery on browser refresh

### Student
- ✅ Enter name (unique per tab via sessionStorage)
- ✅ Receive questions in real-time
- ✅ Server-synchronized timer (late joiners get remaining time)
- ✅ Submit answers with duplicate-vote prevention (DB-enforced)
- ✅ View live results after voting or when time expires
- ✅ Chat with other participants
- ✅ State recovery on browser refresh
- ✅ Kicked-out screen when removed by teacher

### System Resilience
- ✅ Server is the source of truth for timer and vote counts
- ✅ On reconnect, server sends current poll state and remaining time
- ✅ MongoDB unique index on (pollId, studentId) prevents double voting
- ✅ Poll auto-completes after timeLimit via server-side setTimeout

---

## 🏗️ Architecture

### Backend: Controller → Service Pattern
- `PollSocketHandler` handles socket connections, delegates to services
- `PollService` contains all poll business logic and DB interaction
- `SessionService` manages in-memory participant tracking
- `PollController` handles HTTP REST endpoints

### Frontend: Custom Hooks + Component Architecture
- `useSocket` — manages all socket.io connection and event handling
- `usePollTimer` — local countdown synced from server's `timeRemaining`
- Pages are thin UI shells; logic lives in hooks and context

---

## 🔌 Socket Events

| Event | Direction | Description |
|-------|-----------|-------------|
| `join` | C→S | Register with name, role, studentId |
| `poll:state` | S→C | Current poll state on join/reconnect |
| `poll:create` | C→S | Teacher creates a new poll |
| `poll:started` | S→C | Broadcast new poll to all |
| `poll:updated` | S→C | Real-time vote count updates |
| `poll:completed` | S→C | Poll ended (time expired) |
| `vote:submit` | C→S | Student submits a vote |
| `vote:accepted` | S→C | Vote confirmed |
| `vote:rejected` | S→C | Duplicate or invalid vote |
| `student:kick` | C→S | Teacher kicks a student |
| `kicked` | S→C | Student receives kick notification |
| `chat:message` | C→S | Send chat message |
| `chat:message` | S→C | Broadcast chat to all |
| `participants:updated` | S→C | Updated student list for teacher |

---

## 🚢 Deployment

### Backend (Railway / Render / Fly.io)
```bash
cd backend
npm run build
npm start
```
Set environment variables:
- `PORT`
- `MONGODB_URI` (MongoDB Atlas connection string)
- `CLIENT_URL` (your frontend URL)

### Frontend (Vercel / Netlify)
```bash
cd frontend
npm run build
```
Set environment variables:
- `VITE_SOCKET_URL` (your backend URL)

---

## 🎨 Design

Colors follow the Figma spec:
- Primary: `#7765DA`
- Blue: `#5767D0`  
- Violet: `#4F0DCE`
- Light BG: `#F2F2F2`
- Dark BG: `#373737`
