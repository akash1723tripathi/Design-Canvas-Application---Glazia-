# Mini Design Canvas

A simple, collaborative design canvas built with modern web technologies that allows users to create, view, edit, and save designs consisting of various shapes. 

<img width="1916" height="1145" alt="image" src="https://github.com/user-attachments/assets/036717ff-944f-4666-ba40-a864ff205489" />







## Tech Stack
- **Frontend:** Next.js, React, React Konva
- **Backend:** Node.js, Express
- **Database:** MongoDB

## Setup Instructions

### Prerequisites
- Node.js (v18+)
- MongoDB (local or Atlas)

### Installation
1. Clone the repository:
   ```bash
   git clone <repository-url>
   cd <repository-dir>
   ```

2. Install dependencies for both client and server:
   ```bash
   # Terminal 1: Backend
   cd server
   npm install

   # Terminal 2: Frontend
   cd client
   npm install
   ```

### Environment Variables

**Backend (`server/.env`)**
Create a `.env` file in the `server` directory:
```env
PORT=5000
MONGO_URI=mongodb://localhost:27017/canvas-db
# ALLOWED_ORIGIN=http://localhost:3000 (Optional, defaults to this for local dev)
```

**Frontend (`client/.env.local`)**
Create a `.env.local` file in the `client` directory:
```env
NEXT_PUBLIC_API_URL=http://localhost:5000/api/canvases
```

### Running Locally
To run the application locally, you will need two terminals running simultaneously.

**Terminal 1 (Backend)**
```bash
cd server
npm run dev
```

**Terminal 2 (Frontend)**
```bash
cd client
npm run dev
```
Open `http://localhost:3000` in your browser.

## Architecture Overview
The application follows a client-server architecture. The frontend uses **React Konva** to render a 2D canvas interface based on a centralized React state. When a user interacts with the canvas (e.g., transforming, dragging, or creating shapes), these events update the React state in real-time. The application state is synchronized with the backend via 5 RESTful endpoints, allowing saving and loading of the canvas data to and from MongoDB.

## API Endpoints

| Method | Path | Description |
|---|---|---|
| `GET` | `/api/canvases` | List all available canvases |
| `GET` | `/api/canvases/:id` | Get details of a specific canvas by ID |
| `POST` | `/api/canvases` | Create a new canvas with provided elements |
| `PUT` | `/api/canvases/:id` | Update an existing canvas (name or elements) |
| `DELETE` | `/api/canvases/:id` | Delete a specific canvas by ID |

## Known Limitations
- No undo/redo functionality
- No authentication or authorization (canvases are not user-scoped and anyone can edit)
- No autosave (users must manually click 'Save')
- The list view doesn't show a thumbnail preview of the canvases

## Bonus Features Implemented
- None yet.

## Live URL
TBD
