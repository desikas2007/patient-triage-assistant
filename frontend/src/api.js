/**
 * API layer for Patient Intake Triage Assistant.
 * Uses relative paths to connect to the FastAPI backend.
 */

const API_BASE = '/api';

async function apiRequest(endpoint, options = {}) {
  const url = `${API_BASE}${endpoint}`;
  const config = {
    headers: {
      'Content-Type': 'application/json',
      ...options.headers,
    },
    ...options,
  };

  const response = await fetch(url, config);
  if (!response.ok) {
    const error = await response.json().catch(() => ({ detail: 'Unknown error' }));
    throw new Error(error.detail || `HTTP error ${response.status}`);
  }
  return await response.json();
}

export async function checkHealth() {
  return apiRequest('/health');
}

export async function processTriage(message, sessionId = null) {
  return apiRequest('/triage', {
    method: 'POST',
    body: JSON.stringify({
      message: message,
      session_id: sessionId,
    }),
  });
}

export async function processFollowUp(sessionId, answers) {
  return apiRequest('/follow-up', {
    method: 'POST',
    body: JSON.stringify({
      session_id: sessionId,
      answers: answers,
    }),
  });
}

export async function getRule(ruleId) {
  return apiRequest(`/rules/${ruleId}`);
}

export async function resetSession(sessionId = null) {
  return apiRequest('/session/reset', {
    method: 'POST',
    body: JSON.stringify({
      session_id: sessionId,
    }),
  });
}
