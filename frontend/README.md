# AI CFO for SMBs (Frontend)

React (Vite) + Tailwind dashboard for uploading transactions, viewing analysis, and generating AI insights.

## Prerequisites

- Node.js 18+
- Backend running at `http://localhost:3000`

## Run

```powershell
cd c:\Users\Alfiya\Documents\HacthonProject\frontend
npm install
npm run dev
```

Open `http://localhost:5173`.

## How it talks to the backend

- In development, `vite.config.js` proxies `/api/*` → `http://localhost:3000`.
- The frontend calls:
  - `POST /api/upload` (multipart form field `file`)
  - `GET /api/analyze`
  - `POST /api/insights`

