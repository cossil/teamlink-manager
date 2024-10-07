import { useState } from "react"
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query"
import { Button } from "@/components/ui/button"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { RegistryForm } from "./registry-form"
import { fetchRegistries, deleteRegistry } from "@/lib/api"
import { toast } from "sonner"
import { RegistryEntries } from "./registry-entries"

export function RegistryManagement() {
  const [showAddForm, setShowAddForm] = useState(false)
  const [editingRegistry, setEditingRegistry] = useState(null)
  const [selectedRegistry, setSelectedRegistry] = useState(null)

  const queryClient = useQueryClient()

  const { data: registries, isLoading, error } = useQuery({
    queryKey: ["registries"],
    queryFn: fetchRegistries,
  })

  const deleteMutation = useMutation({
    mutationFn: deleteRegistry,
    onSuccess: () => {
      queryClient.invalidateQueries(['registries'])
      toast.success('Registry deleted successfully')
    },
    onError: (error) => {
      toast.error(`Error deleting registry: ${error.message}`)
    },
  })

  if (isLoading) return <div>Loading...</div>
  if (error) return <div>Error: {error.message}</div>

  const handleDelete = (id) => {
    if (window.confirm('Are you sure you want to delete this registry?')) {
      deleteMutation.mutate(id)
    }
  }

  if (selectedRegistry) {
    return <RegistryEntries registry={selectedRegistry} onBack={() => setSelectedRegistry(null)} />
  }

  return (
    <div>
      <div className="flex justify-between mb-4">
        <h2 className="text-2xl font-bold">Linked Registries</h2>
        <Button onClick={() => setShowAddForm(true)}>Add Registry</Button>
      </div>
      {(showAddForm || editingRegistry) && (
        <RegistryForm
          onClose={() => {
            setShowAddForm(false)
            setEditingRegistry(null)
          }}
          editingRegistry={editingRegistry}
        />
      )}
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>Name</TableHead>
            <TableHead>Entries Count</TableHead>
            <TableHead>Actions</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {registries.map((registry) => (
            <TableRow key={registry.id}>
              <TableCell>{registry.name}</TableCell>
              <TableCell>{registry.entriesCount}</TableCell>
              <TableCell>
                <Button variant="outline" className="mr-2" onClick={() => setSelectedRegistry(registry)}>Manage Entries</Button>
                <Button variant="outline" className="mr-2" onClick={() => setEditingRegistry(registry)}>Edit</Button>
                <Button variant="destructive" onClick={() => handleDelete(registry.id)}>Delete</Button>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  )
}