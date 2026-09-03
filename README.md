# Assessment Frontend

React/Vite client for the proctored assessment platform.

Copy `.env.example` to `.env` and set `VITE_API_BASE_URL` to the backend API URL before starting the app.

## Source structure

- `api/` - HTTP client and API modules
- `components/` - reusable UI and route guards
- `config/` - environment configuration
- `constants/` - shared frontend constants
- `hooks/` - timer, autosave, and proctoring hooks
- `layouts/` - authenticated application layouts
- `pages/auth/` - authentication screens
- `pages/admin/` - assessment and submission management
- `pages/candidate/` - assessment attempt experience
- `routes/` - application routing boundary
- `utils/` - browser storage and shared helpers
