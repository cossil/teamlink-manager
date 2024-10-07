import { useState, useEffect } from "react"
import { useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import * as z from "zod"
import { useMutation, useQueryClient } from "@tanstack/react-query"
import { Button } from "@/components/ui/button"
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form"
import { Input } from "@/components/ui/input"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { createTeamMember, updateTeamMember, uploadFile } from "@/lib/api"
import { toast } from "sonner"

const teamMemberSchema = z.object({
  name: z.string().min(2, "Name must be at least 2 characters"),
  role: z.string().min(1, "Role is required"),
  age: z.number().min(18, "Age must be at least 18").max(100, "Age must be at most 100"),
  photo: z.string().optional(),
})

export function TeamMemberForm({ onClose, editingMember }) {
  const [isSubmitting, setIsSubmitting] = useState(false)
  const queryClient = useQueryClient()

  const form = useForm({
    resolver: zodResolver(teamMemberSchema),
    defaultValues: editingMember || {
      name: "",
      role: "",
      age: "",
      photo: "",
    },
  })

  const mutation = useMutation({
    mutationFn: editingMember ? updateTeamMember : createTeamMember,
    onSuccess: () => {
      queryClient.invalidateQueries(['teamMembers'])
      toast.success(`Team member ${editingMember ? 'updated' : 'created'} successfully`)
      onClose()
    },
    onError: (error) => {
      toast.error(`Error ${editingMember ? 'updating' : 'creating'} team member: ${error.message}`)
    },
  })

  async function onSubmit(data) {
    setIsSubmitting(true)
    if (editingMember) {
      mutation.mutate({ id: editingMember.id, ...data })
    } else {
      mutation.mutate(data)
    }
    setIsSubmitting(false)
  }

  const handleFileUpload = async (event) => {
    const file = event.target.files[0]
    if (file) {
      try {
        const url = await uploadFile(file)
        form.setValue('photo', url)
      } catch (error) {
        toast.error(`Error uploading file: ${error.message}`)
      }
    }
  }

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
        <FormField
          control={form.control}
          name="name"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Name</FormLabel>
              <FormControl>
                <Input placeholder="John Doe" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="role"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Role</FormLabel>
              <Select onValueChange={field.onChange} defaultValue={field.value}>
                <FormControl>
                  <SelectTrigger>
                    <SelectValue placeholder="Select a role" />
                  </SelectTrigger>
                </FormControl>
                <SelectContent>
                  <SelectItem value="developer">Developer</SelectItem>
                  <SelectItem value="designer">Designer</SelectItem>
                  <SelectItem value="manager">Manager</SelectItem>
                </SelectContent>
              </Select>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="age"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Age</FormLabel>
              <FormControl>
                <Input type="number" {...field} onChange={(e) => field.onChange(parseInt(e.target.value, 10))} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="photo"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Photo</FormLabel>
              <FormControl>
                <Input type="file" onChange={handleFileUpload} />
              </FormControl>
              {field.value && <img src={field.value} alt="Team member" className="mt-2 w-32 h-32 object-cover" />}
              <FormMessage />
            </FormItem>
          )}
        />
        <Button type="submit" disabled={isSubmitting}>
          {isSubmitting ? "Saving..." : `${editingMember ? 'Update' : 'Save'} Team Member`}
        </Button>
      </form>
    </Form>
  )
}