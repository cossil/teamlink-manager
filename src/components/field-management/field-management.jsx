import { useState } from "react"
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query"
import { Button } from "@/components/ui/button"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { FieldForm } from "./field-form"
import { fetchFields, deleteField } from "@/lib/api"
import { toast } from "sonner"

export function FieldManagement() {
  const [showAddForm, setShowAddForm] = useState(false)
  const [editingField, setEditingField] = useState(null)

  const queryClient = useQueryClient()

  const { data: fields, isLoading, error } = useQuery({
    queryKey: ["fields"],
    queryFn: fetchFields,
  })

  const deleteMutation = useMutation({
    mutationFn: deleteField,
    onSuccess: () => {
      queryClient.invalidateQueries(['fields'])
      toast.success('Field deleted successfully')
    },
    onError: (error) => {
      toast.error(`Error deleting field: ${error.message}`)
    },
  })

  if (isLoading) return <div>Loading...</div>
  if (error) return <div>Error: {error.message}</div>

  const handleDelete = (id) => {
    if (window.confirm('Are you sure you want to delete this field?')) {
      deleteMutation.mutate(id)
    }
  }

  return (
    <div>
      <div className="flex justify-between mb-4">
        <h2 className="text-2xl font-bold">Custom Fields</h2>
        <Button onClick={() => setShowAddForm(true)}>Add Field</Button>
      </div>
      {(showAddForm || editingField) && (
        <FieldForm
          onClose={() => {
            setShowAddForm(false)
            setEditingField(null)
          }}
          editingField={editingField}
        />
      )}
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>Name</TableHead>
            <TableHead>Label</TableHead>
            <TableHead>Type</TableHead>
            <TableHead>Required</TableHead>
            <TableHead>Actions</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {fields.map((field) => (
            <TableRow key={field.id}>
              <TableCell>{field.name}</TableCell>
              <TableCell>{field.label}</TableCell>
              <TableCell>{field.type}</TableCell>
              <TableCell>{field.required ? "Yes" : "No"}</TableCell>
              <TableCell>
                <Button variant="outline" className="mr-2" onClick={() => setEditingField(field)}>Edit</Button>
                <Button variant="destructive" onClick={() => handleDelete(field.id)}>Delete</Button>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  )
}