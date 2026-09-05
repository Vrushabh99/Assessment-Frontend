# Procteria - Assessment Frontend

React + Vite client for the proctored assessment platform, built with Material UI.

## Tech Stack

- React 18 + Vite
- Material UI (`@mui/material`, `@mui/icons-material`)
- React Router
- TanStack Query (`@tanstack/react-query`) for server state/data fetching
- styled-components / emotion for custom styling

## Prerequisites

- Node.js 18+
- The backend API running locally (see the backend README) or a deployed backend URL

## Getting Started

```bash
npm install
cp .env.example .env   # or create .env manually — see Environment Variables below
npm run dev
```

The app runs at `http://localhost:5173` by default (Vite's default port).

## Environment Variables

```env
VITE_API_BASE_URL=http://localhost:4000/api
```

| Variable | Required | Notes |
|---|---|---|
| `VITE_API_BASE_URL` | **Yes** | The app throws on startup (`src/config/env.js`) if this is missing. Point it at your local backend (`http://localhost:4000/api`) for local dev. |

### Production / Vercel deployment note

For the deployed Vercel build, set `VITE_API_BASE_URL=/api` (a relative path, not the full Render URL). `vercel.json` rewrites any `/api/*` request to the Render backend:

```json
{
  "rewrites": [
    { "source": "/api/:path*", "destination": "https://assessment-backend-w878.onrender.com/api/:path*" },
    { "source": "/(.*)", "destination": "/" }
  ]
}
```

This keeps API requests **same-origin** from the browser's perspective, which is what allows the backend's httpOnly auth cookie (`SameSite=None; Secure`) to be sent reliably — routing directly to the Render domain from client-side JS would otherwise hit third-party-cookie restrictions in some browsers.



## Source Structure

```text
src/
  api/          # HTTP client (client.js) and per-domain API modules
                #   (assessments, questions, assignments, attempts, candidates)
  components/
    AssessmentForm/
    QuestionForm/
    QuestionRenderer/    # renders single/multiple-choice and short-answer questions
    QuestionTable/
    ProtectedRoute/      # role-based route guard
    ui/                  # shared presentational components
    Timer.tsx            # countdown display, synced against server-provided remaining time
  config/       # env.js — reads and validates VITE_API_BASE_URL
  constants/    # roles.js — role constants shared across the app
  context/      # AuthContext.jsx — current user/session state
  hooks/        # useAssessmentTimer.js — timer + autosave/proctoring hook logic
  layouts/      # DashboardLayout — shared authenticated shell
  pages/
    auth/                       # login/register screens
    admin/
      AdminDashboardPage/
      AssessmentManagementPage/ # list/manage assessments
      AssessmentEditorPage/     # create/edit an assessment
      AssessmentDetailsPage/
      QuestionsDashboardPage/   # question bank
      QuestionEditorPage/
      CandidateManagementPage/  # list/manage candidates
      CandidateEditorPage/
      AssignAssessmentPage/     # assign an assessment to candidates
      AssignmentManagementPage/ # list assignments, view status/summary
    candidate/
      CandidateDashboardPage/   # list of assigned assessments
      AssessmentAttemptPage/
      AttemptTakingPage/        # the actual timed, proctored attempt UI
  routes/       # AppRoutes.jsx — route definitions + guards
  styles/       # theme.js, GlobalStyle.js
  utils/        # storage.js — local browser storage helpers
```

## Scripts

```bash
npm run dev       # start Vite dev server
npm run build     # production build to dist/
npm run preview   # preview the production build locally
npm run lint      # eslint, zero warnings allowed
```

## Assumptions & Known Limitations

- **Proctoring is browser-level only** (`visibilitychange`, `blur`, `fullscreenchange`, `copy`, `paste`, `contextmenu` listeners) — it detects in-browser signals, not device-level or camera-based proctoring, and can't prevent a second physical device from being used out of frame.
- **The attempt timer displayed to the candidate is a synced display, not the authority** — actual enforcement happens server-side (see the backend README); the frontend timer periodically re-syncs against the server's remaining-time value so local drift doesn't let a candidate extend their own time.
- **Autosave is fire-and-forget per answer change** — there is no offline queueing; a sustained network outage during an attempt will not be resiliently retried beyond whatever the underlying API client does by default.