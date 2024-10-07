// Mock data
const teamMembers = [
  { id: 1, name: "John Doe", role: "Developer", age: 30 },
  { id: 2, name: "Jane Smith", role: "Designer", age: 28 },
  { id: 3, name: "Mike Johnson", role: "Manager", age: 35 },
]

const fields = [
  { id: 1, name: "email", label: "Email Address", type: "email", required: true },
  { id: 2, name: "phone", label: "Phone Number", type: "phone", required: false },
  { id: 3, name: "department", label: "Department", type: "dropdown", required: true },
]

const registries = [
  { id: 1, name: "Roles", entriesCount: 3 },
  { id: 2, name: "Departments", entriesCount: 5 },
]

// API base URL
const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:3000/api';

// Mock API functions
export async function fetchTeamMembers() {
  // In a real application, you would use the API_BASE_URL here
  // return fetch(`${API_BASE_URL}/team-members`).then(res => res.json());
  return new Promise((resolve) => {
    setTimeout(() => resolve(teamMembers), 500)
  })
}

export async function fetchFields() {
  // In a real application, you would use the API_BASE_URL here
  // return fetch(`${API_BASE_URL}/fields`).then(res => res.json());
  return new Promise((resolve) => {
    setTimeout(() => resolve(fields), 500)
  })
}

export async function fetchRegistries() {
  // In a real application, you would use the API_BASE_URL here
  // return fetch(`${API_BASE_URL}/registries`).then(res => res.json());
  return new Promise((resolve) => {
    setTimeout(() => resolve(registries), 500)
  })
}