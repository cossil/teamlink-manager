import { useState } from "react"
import { useQuery } from "@tanstack/react-query"
import { Button } from "@/components/ui/button"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { RegistryForm } from "./registry-form"
import { fetchRegistries } from "@/lib/api"

export function RegistryManagement() {
  const [showAddForm, setShowAddForm] = useState(false)

  const { data: registries, isLoading, error } = useQuery({
    queryKey: ["registries"],
    queryFn: fetchRegistries,
  })

  if (isLoading) return <div>Loading...</div>
  if (error) return <div>Error: {error.message}</div>

  return (
    <div>
      <div className="flex justify-between mb-4">
        <h2 className="text-2xl font-bold">Linked Registries</h2>
        <Button onClick={() => setShowAddForm(true)}>Add Registry</Button>
      </div>
      {showAddForm && <RegistryForm onClose={() => setShowAddForm(false)} />}
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
                <Button variant="outline" className="mr-2">Manage Entries</Button>
                <Button variant="destructive">Delete</Button>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  )
}