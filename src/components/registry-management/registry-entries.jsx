import { useState } from "react"
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query"
import { Button } from "@/components/ui/button"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Input } from "@/components/ui/input"
import { fetchRegistryEntries, createRegistryEntry, updateRegistryEntry, deleteRegistryEntry } from "@/lib/api"
import { toast } from "sonner"
import { Pagination } from "@/components/ui/pagination"

export function RegistryEntries({ registry, onBack }) {
  const [page, setPage] = useState(1)
  const [limit] = useState(10)
  const [newEntry, setNewEntry] = useState("")
  const [editingEntry, setEditingEntry] = useState(null)

  const queryClient = useQueryClient()

  const { data, isLoading, error } = useQuery({
    queryKey: ['registryEntries', registry.id, page, limit],
    queryFn: () => fetchRegistryEntries(registry.id, page, limit),
  })

  const createMutation = useMutation({
    mutationFn: (data) => createRegistryEntry(registry.id, data),
    onSuccess: () => {
      queryClient.invalidateQueries(['registryEntries', registry.id])
      toast.success('Entry created successfully')
      setNewEntry("")
    },
    onError: (error) => {
      toast.error(`Error creating entry: ${error.message}`)
    },
  })

  const updateMutation = useMutation({
    mutationFn: ({ entryId, data }) => updateRegistryEntry(registry.id, entryId, data),
    onSuccess: () => {
      queryClient.invalidateQueries(['registryEntries', registry.id])
      toast.success('Entry updated successfully')
      setEditingEntry(null)
    },
    onError: (error) => {
      toast.error(`Error updating entry: ${error.message}`)
    },
  })

  const deleteMutation = useMutation({
    mutationFn: (entryId) => deleteRegistryEntry(registry.id, entryId),
    onSuccess: () => {
      queryClient.invalidateQueries(['registryEntries', registry.id])
      toast.success('Entry deleted successfully')
    },
    onError: (error) => {
      toast.error(`Error deleting entry: ${error.message}`)
    },
  })

  if (isLoading) return <div>Loading...</div>
  if (error) return <div>Error: {error.message}</div>

  const { entries, totalPages } = data

  const handleCreate = () => {
    if (newEntry.trim()) {
      createMutation.mutate({ value: newEntry.trim() })
    }
  }

  const handleUpdate = (entry) => {
    if (entry.value.trim() && entry.value !== editingEntry.originalValue) {
      updateMutation.mutate({ entryId: entry.id, data: { value: entry.value.trim() } })
    } else {
      setEditingEntry(null)
    }
  }

  const handleDelete = (entryId) => {
    if (window.confirm('Are you sure you want to delete this entry?')) {
      deleteMutation.mutate(entryId)
    }
  }

  return (
    <div>
      <Button onClick={onBack} className="mb-4">Back to Registries</Button>
      <h2 className="text-2xl font-bold mb-4">{registry.name} Entries</h2>
      <div className="flex mb-4">
        <Input
          value={newEntry}
          onChange={(e) => setNewEntry(e.target.value)}
          placeholder="New entry value"
          className="mr-2"
        />
        <Button onClick={handleCreate}>Add Entry</Button>
      </div>
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>Value</TableHead>
            <TableHead>Actions</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {entries.map((entry) => (
            <TableRow key={entry.id}>
              <TableCell>
                {editingEntry?.id === entry.id ? (
                  <Input
                    value={editingEntry.value}
                    onChange={(e) => setEditingEntry({ ...editingEntry, value: e.target.value })}
                  />
                ) : (
                  entry.value
                )}
              </TableCell>
              <TableCell>
                {editingEntry?.id === entry.id ? (
                  <>
                    <Button variant="outline" className="mr-2" onClick={() => handleUpdate(editingEntry)}>Save</Button>
                    <Button variant="outline" onClick={() => setEditingEntry(null)}>Cancel</Button>
                  </>
                ) : (
                  <>
                    <Button variant="outline" className="mr-2" onClick={() => setEditingEntry({ ...entry, originalValue: entry.value })}>Edit</Button>
                    <Button variant="destructive" onClick={() => handleDelete(entry.id)}>Delete</Button>
                  </>
                )}
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
      <Pagination
        className="mt-4"
        currentPage={page}
        totalPages={totalPages}
        onPageChange={setPage}
      />
    </div>
  )
}