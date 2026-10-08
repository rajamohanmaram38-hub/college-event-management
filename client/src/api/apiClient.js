// Centralized API Client for College Event Management Server
// Connects client frontend to the Express REST API backend

// Resolves and normalizes API base url (handles relative "/api", absolute URLs, and strips trailing slashes)
function getBaseUrl() {
  let url = (import.meta.env.VITE_API_BASE_URL || '/api').trim();
  while (url.endsWith('/')) {
    url = url.slice(0, -1);
  }
  if (url.startsWith('http') && !url.endsWith('/api')) {
    url = `${url}/api`;
  }
  return url;
}

const BASE_URL = getBaseUrl();

async function request(endpoint, options = {}) {
  const url = `${BASE_URL}${endpoint}`;
  const headers = {
    'Content-Type': 'application/json',
    ...(options.headers || {})
  };

  try {
    const response = await fetch(url, {
      ...options,
      headers
    });

    const data = await response.json();
    return {
      ok: response.ok,
      status: response.status,
      ...data
    };
  } catch (error) {
    console.warn(`[API] Network error communicating with ${url}:`, error.message);
    return {
      ok: false,
      success: false,
      networkError: true,
      message: 'Server unreachable. Running with offline data store.'
    };
  }
}

export const apiClient = {
  // Health
  checkHealth() {
    return request('/health');
  },

  // Auth
  loginStudent(email, password) {
    return request('/auth/login/student', {
      method: 'POST',
      body: JSON.stringify({ email, password })
    });
  },

  registerStudent(studentData) {
    return request('/auth/register/student', {
      method: 'POST',
      body: JSON.stringify(studentData)
    });
  },

  loginAdmin(email, password) {
    return request('/auth/login/admin', {
      method: 'POST',
      body: JSON.stringify({ email, password })
    });
  },

  getAllStudents() {
    return request('/auth/students');
  },

  // Events
  getEvents(params = {}) {
    const query = new URLSearchParams();
    if (params.category && params.category !== 'all') query.append('category', params.category);
    if (params.search) query.append('search', params.search);
    const queryString = query.toString() ? `?${query.toString()}` : '';
    return request(`/events${queryString}`);
  },

  getEventById(id) {
    return request(`/events/${id}`);
  },

  createEvent(eventData) {
    return request('/events', {
      method: 'POST',
      body: JSON.stringify(eventData)
    });
  },

  updateEvent(id, eventData) {
    return request(`/events/${id}`, {
      method: 'PUT',
      body: JSON.stringify(eventData)
    });
  },

  deleteEvent(id) {
    return request(`/events/${id}`, {
      method: 'DELETE'
    });
  },

  getEventAttendees(id) {
    return request(`/events/${id}/attendees`);
  },

  // Registrations
  getRegistrations() {
    return request('/registrations');
  },

  getStudentRegistrations(studentId) {
    return request(`/registrations/student/${studentId}`);
  },

  registerForEvent(eventId, student) {
    return request('/registrations', {
      method: 'POST',
      body: JSON.stringify({ eventId, student })
    });
  },

  cancelRegistration(id) {
    return request(`/registrations/${id}`, {
      method: 'DELETE'
    });
  },

  updateRegistrationStatus(id, status) {
    return request(`/registrations/${id}/status`, {
      method: 'PATCH',
      body: JSON.stringify({ status })
    });
  },

  verifyCertificate(query) {
    return request(`/registrations/verify/${encodeURIComponent(query)}`);
  },

  // Analytics Stats
  getStats() {
    return request('/stats/overview');
  }
};
