/**
 * API layer for Patient Intake Triage Assistant.
 * Uses relative paths to connect to the FastAPI backend.
 */

const API_BASE = '/api';

/**
 * Generic API request handler
 */
async function apiRequest(endpoint, options = {}) {
  const url = `${API_BASE}${endpoint}`;
  
  const config = {
    headers: {
      'Content-Type': 'application/json',
      ...options.headers,
    },
    ...options,
  };
  
  try {
    const response = await fetch(url, config);
    
    if (!response.ok) {
      const error = await response.json().catch(() => ({ detail: 'Unknown error' }));
      throw new Error(error.detail || `HTTP error ${response.status}`);
    }
    
    return await response.json();
  } catch (error) {
    console.error(`API Error (${endpoint}):`, error);
    throw error;
  }
}

/**
 * Health check
 */
export async function checkHealth() {
  return apiRequest('/health');
}

/**
 * Process patient intake
 */
export async function processTriage(patientText, sessionId = null) {
  return apiRequest('/triage', {
    method: 'POST',
    body: JSON.stringify({
      patient_text: patientText,
      session_id: sessionId,
    }),
  });
}

/**
 * Process follow-up answers
 */
export async function processFollowUp(sessionId, answers) {
  return apiRequest('/follow-up', {
    method: 'POST',
    body: JSON.stringify({
      session_id: sessionId,
      answers: answers,
    }),
  });
}

/**
 * Get rule explanation
 */
export async function getRule(ruleId) {
  return apiRequest(`/rules/${ruleId}`);
}

/**
 * Reset session
 */
export async function resetSession(sessionId = null) {
  return apiRequest('/session/reset', {
    method: 'POST',
    body: JSON.stringify({
      session_id: sessionId,
    }),
  });
}
