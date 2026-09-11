# FirstFund — Frontend

This package contains the Person 3 frontend/visualization work for FirstFund.

## Included
- Landing page
- 4-step onboarding
- Profile Ready screen
- Simulation dashboard
- Consequence screen
- Net Worth chart using Recharts
- Final Scorecard UI
- Mock month-to-month flow
- API integration placeholder at `src/services/api.js`

## Intentionally not connected yet
The following are left for integration after Person 1 and Person 2 provide their final backend:

### Person 1
- `POST /api/simulation/start`
- `POST /api/simulation/decision`
- `GET /api/simulation/:sessionId`
- `GET /api/simulation/:sessionId/scorecard`
- Deterministic financial state and 12 scenarios

### Person 2
- AI consequence explanation
- Alternative comparison
- Personality analysis
- Final AI analysis
- Mentor-persona behavior

## Running
From the `firstfund` folder:

```bash
npm install
npm run dev
```

The frontend currently uses mock data where backend data is not available.

## Integration rule
When the real backend is connected, the frontend should treat the backend financial state as the source of truth. Do not recalculate financial values inside the UI.


Frontend update: compact desktop typography/spacing and a Recharts year-in-review net-worth graph are included.
