import { useState } from "react"
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { TeamMemberForm } from "./team-member-form"
import { fetchTeamMembers, deleteTeamMember } from "@/lib/api"
import { Pagination } from "@/components/ui/pagination"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { toast } from "sonner"

export function TeamMemberList() {
  const [page, setPage] = useState(1)
  const [limit, setLimit] = useState(10)
  const [sortBy, setSortBy] = useState('name')
  const [sortOrder, setSortOrder] = useState('asc')
  const [filter, setFilter] = useState('')
  const [showAddForm, setShowAddForm] = useState(false)
  const [editingMember, setEditingMember] = useState(null)

  const queryClient = useQueryClient()

  const { data, isLoading, error } = useQuery({
    queryKey: ['teamMembers', page, limit, sortBy, sortOrder, filter],
    queryFn: () => fetchTeamMembers(page, limit, sortBy, sortOrder, filter),
  })

  const deleteMutation = useMutation({
    mutationFn: deleteTeamMember,
    onSuccess: () => {
      queryClient.invalidateQueries(['teamMembers'])
      toast.success('Team member deleted successfully')
    },
    onError: (error) => {
      toast.error(`Error deleting team member: ${error.message}`)
    },
  })

  if (isLoading) return <div>Loading...</div>
  if (error) return <div>Error: {error.message}</div>

  const { teamMembers, totalPages } = data

  const handleDelete = (id) => {
    if (window.confirm('Are you sure you want to delete this team member?')) {
      deleteMutation.mutate(id)
    }
  }

  return (
    <div>
      <div className="flex justify-between mb-4">
        <Input
          placeholder="Search team members..."
          value={filter}
          onChange={(e) => setFilter(e.target.value)}
          className="max-w-sm"
        />
        <Button onClick={() => setShowAddForm(true)}>Add Team Member</Button>
      </div>
      {(showAddForm || editingMember) && (
        <TeamMemberForm
          onClose={() => {
            setShowAddForm(false)
            setEditingMember(null)
          }}
          editingMember={editingMember}
        />
      )}
      <div className="mb-4">
        <Select value={sortBy} onValueChange={setSortBy}>
          <SelectTrigger className="w-[180px]">
            <SelectValue placeholder="Sort by" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="name">Name</SelectItem>
            <SelectItem value="role">Role</SelectItem>
            <SelectItem value="age">Age</SelectItem>
          </SelectContent>
        </Select>
        <Select value={sortOrder} onValueChange={setSortOrder}>
          <SelectTrigger className="w-[180px] ml-2">
            <SelectValue placeholder="Sort order" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="asc">Ascending</SelectItem>
            <SelectItem value="desc">Descending</SelectItem>
          </SelectContent>
        </Select>
      </div>
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>Name</TableHead>
            <TableHead>Role</TableHead>
            <TableHead>Age</TableHead>
            <TableHead>Actions</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {teamMembers.map((member) => (
            <TableRow key={member.id}>
              <TableCell>{member.name}</TableCell>
              <TableCell>{member.role}</TableCell>
              <TableCell>{member.age}</TableCell>
              <TableCell>
                <Button variant="outline" className="mr-2" onClick={() => setEditingMember(member)}>Edit</Button>
                <Button variant="destructive" onClick={() => handleDelete(member.id)}>Delete</Button>
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