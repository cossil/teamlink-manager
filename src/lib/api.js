import axios from 'axios'

const API_BASE_URL = process.env.REACT_APP_API_BASE_URL || 'http://localhost:3000/api'

const api = axios.create({
  baseURL: API_BASE_URL,
})

// Add an interceptor for handling errors
api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response) {
      // The request was made and the server responded with a status code
      // that falls out of the range of 2xx
      toast.error(`Error: ${error.response.data.message || 'An unexpected error occurred'}`)
    } else if (error.request) {
      // The request was made but no response was received
      toast.error('No response received from server')
    } else {
      // Something happened in setting up the request that triggered an Error
      toast.error('Error setting up the request')
    }
    return Promise.reject(error)
  }
)

// Add authentication token to requests
const setAuthToken = (token) => {
  if (token) {
    api.defaults.headers.common['Authorization'] = `Bearer ${token}`
  } else {
    delete api.defaults.headers.common['Authorization']
  }
}

export async function fetchTeamMembers(page = 1, limit = 10, sortBy = 'name', sortOrder = 'asc', filter = '') {
  const response = await api.get('/team-members', {
    params: { page, limit, sortBy, sortOrder, filter },
  })
  return response.data
}

export async function createTeamMember(data) {
  const response = await api.post('/team-members', data)
  return response.data
}

export async function updateTeamMember(id, data) {
  const response = await api.put(`/team-members/${id}`, data)
  return response.data
}

export async function deleteTeamMember(id) {
  await api.delete(`/team-members/${id}`)
}

export async function fetchFields() {
  const response = await api.get('/fields')
  return response.data
}

export async function createField(data) {
  const response = await api.post('/fields', data)
  return response.data
}

export async function updateField(id, data) {
  const response = await api.put(`/fields/${id}`, data)
  return response.data
}

export async function deleteField(id) {
  await api.delete(`/fields/${id}`)
}

export async function fetchRegistries() {
  const response = await api.get('/registries')
  return response.data
}

export async function createRegistry(data) {
  const response = await api.post('/registries', data)
  return response.data
}

export async function updateRegistry(id, data) {
  const response = await api.put(`/registries/${id}`, data)
  return response.data
}

export async function deleteRegistry(id) {
  await api.delete(`/registries/${id}`)
}

export async function fetchRegistryEntries(registryId, page = 1, limit = 10) {
  const response = await api.get(`/registries/${registryId}/entries`, {
    params: { page, limit },
  })
  return response.data
}

export async function createRegistryEntry(registryId, data) {
  const response = await api.post(`/registries/${registryId}/entries`, data)
  return response.data
}

export async function updateRegistryEntry(registryId, entryId, data) {
  const response = await api.put(`/registries/${registryId}/entries/${entryId}`, data)
  return response.data
}

export async function deleteRegistryEntry(registryId, entryId) {
  await api.delete(`/registries/${registryId}/entries/${entryId}`)
}

// Update file upload function
export async function uploadFile(file) {
  const formData = new FormData()
  formData.append('file', file)
  const response = await api.post('/upload', formData, {
    headers: { 'Content-Type': 'multipart/form-data' },
  })
  return response.data.url
}

// Add a function to handle login
export async function login(credentials) {
  const response = await api.post('/auth/login', credentials)
  const { token } = response.data
  setAuthToken(token)
  return response.data
}

// Add a function to handle logout
export function logout() {
  setAuthToken(null)
}

export { setAuthToken }
