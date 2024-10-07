import { useState } from "react"
import { useQuery } from "@tanstack/react-query"
import { Button } from "@/components/ui/button"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { FieldForm } from "./field-form"
import { fetchFields } from "@/lib/api"

export function FieldManagement() {
  const [showAddForm, setShowAddForm] = useState(false)

  const { data: fields, isLoading, error } = useQuery({
    queryKey: ["fields"],
    queryFn: fetchFields,
  })

  if (isLoading) return <div>Loading...</div>
  if (error) return <div>Error: {error.message}</div>

  return (
    <div>
      <div className="flex justify-between mb-4">
        <h2 className="text-2xl font-bold">Custom Fields</h2>
        <Button onClick={() => setShowAddForm(true)}>Add Field</Button>
      </div>
      {showAddForm && <FieldForm onClose={() => setShowAddForm(false)} />}
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
                <Button variant="outline" className="mr-2">Edit</Button>
                <Button variant="destructive">Delete</Button>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  )
}