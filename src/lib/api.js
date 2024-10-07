import axios from 'axios'

const API_BASE_URL = 'http://localhost:3000/api' // Replace with your actual API URL

const api = axios.create({
  baseURL: API_BASE_URL,
})

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

export async function uploadFile(file) {
  const formData = new FormData()
  formData.append('file', file)
  const response = await api.post('/upload', formData, {
    headers: { 'Content-Type': 'multipart/form-data' },
  })
  return response.data.url
}