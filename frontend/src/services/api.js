const API_BASE_URL =
  import.meta.env.VITE_API_BASE_URL ||
  "http://localhost:5000/api/simulation";

async function request(url, options = {}) {
  const response = await fetch(url, {
    ...options,
    headers: {
      "Content-Type": "application/json",
      ...(options.headers || {}),
    },
  });

  let data = null;
  try {
    data = await response.json();
  } catch {
    data = null;
  }

  if (!response.ok) {
    throw new Error(data?.error || `Request failed (${response.status})`);
  }

  return data;
}

export async function startSimulation(profile) {
  return request(`${API_BASE_URL}/start`, {
    method: "POST",
    body: JSON.stringify(profile),
  });
}

export async function submitDecision({ sessionId, month, choiceId, mentorPersona }) {
  return request(`${API_BASE_URL}/decision`, {
    method: "POST",
    body: JSON.stringify({
      sessionId,
      month,
      choiceId,
      mentorPersona,
    }),
  });
}

export async function getSimulation(sessionId) {
  return request(`${API_BASE_URL}/${sessionId}`);
}

export async function getScorecard(sessionId) {
  return request(`${API_BASE_URL}/${sessionId}/scorecard`);
}

export { API_BASE_URL };
