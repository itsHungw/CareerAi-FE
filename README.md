## CareerAI Frontend

Next.js frontend used to exercise the CareerAI backend through the browser.

## Environment

Create `.env.local` from `.env.example` and set:

```bash
NEXT_PUBLIC_API_URL=http://localhost:8080/api
NEXT_PUBLIC_GOOGLE_CLIENT_ID=YOUR_GOOGLE_CLIENT_ID.apps.googleusercontent.com
```

## Run

```bash
npm run dev
```

Then open `http://localhost:3000`.

## Recommended Manual Test Flow

1. Register or log in.
2. Open `Dashboard -> CV Upload`.
3. Upload a PDF CV and wait for the review.
4. Open `Roadmap` and generate a plan from the latest CV.
5. Open `Job Matches` and confirm matches are returned.

## Notes

- The frontend expects the backend on port `8080` by default.
- Access tokens are stored in memory, while refresh tokens come from cookies.
- If roadmap or matching fails, upload a CV first and confirm the backend completed analysis.
