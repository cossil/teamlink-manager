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

// Mock API functions
export async function fetchTeamMembers() {
  return new Promise((resolve) => {
    setTimeout(() => resolve(teamMembers), 500)
  })
}

export async function fetchFields() {
  return new Promise((resolve) => {
    setTimeout(() => resolve(fields), 500)
  })
}

export async function fetchRegistries() {
  return new Promise((resolve) => {
    setTimeout(() => resolve(registries), 500)
  })
}