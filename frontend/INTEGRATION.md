# FirstFund Frontend — Person 1 Backend Integration

This frontend is wired to the current Person 1 backend API.

## Run

### Backend
Run Person 1's backend first on `http://localhost:5000`.

### Frontend
```bash
npm install
npm run dev
```

The frontend defaults to:
`http://localhost:5000/api/simulation`

To use another backend URL, create `.env`:
```env
VITE_API_BASE_URL=http://localhost:5000/api/simulation
```

## Current decision milestones
The current backend exposes six major decision points across the 12-month simulation:

`Month 1 → Month 2 → Month 4 → Month 6 → Month 7 → Month 12`

The frontend intentionally follows the backend's `nextScenario` response instead of hardcoding scenario progression.

## API flow
- `POST /api/simulation/start`
- `POST /api/simulation/decision`
- `GET /api/simulation/:sessionId/scorecard`
- `GET /api/simulation/:sessionId` is available for session restoration/API consumers.

The AI explanation is consumed from `aiFeedback` returned by the decision endpoint.
