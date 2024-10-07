import { useState } from "react"
import { useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import * as z from "zod"
import { Button } from "@/components/ui/button"
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form"
import { Input } from "@/components/ui/input"

const registrySchema = z.object({
  name: z.string().min(2, "Name must be at least 2 characters"),
})

export function RegistryForm({ onClose }) {
  const [isSubmitting, setIsSubmitting] = useState(false)

  const form = useForm({
    resolver: zodResolver(registrySchema),
    defaultValues: {
      name: "",
    },
  })

  async function onSubmit(data) {
    setIsSubmitting(true)
    // TODO: Implement API call to save registry
    console.log(data)
    setIsSubmitting(false)
    onClose()
  }

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
        <FormField
          control={form.control}
          name="name"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Registry Name</FormLabel>
              <FormControl>
                <Input placeholder="e.g., Roles, Departments" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <Button type="submit" disabled={isSubmitting}>
          {isSubmitting ? "Saving..." : "Create Registry"}
        </Button>
      </form>
    </Form>
  )
}