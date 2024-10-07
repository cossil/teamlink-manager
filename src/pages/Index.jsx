import { TeamMemberList } from "@/components/team-member/team-member-list"
import { FieldManagement } from "@/components/field-management/field-management"
import { RegistryManagement } from "@/components/registry-management/registry-management"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"

function Index() {
  return (
    <div className="container mx-auto p-4">
      <h1 className="text-3xl font-bold mb-6">Team Member Management</h1>
      <Tabs defaultValue="team-members">
        <TabsList>
          <TabsTrigger value="team-members">Team Members</TabsTrigger>
          <TabsTrigger value="fields">Field Management</TabsTrigger>
          <TabsTrigger value="registries">Registry Management</TabsTrigger>
        </TabsList>
        <TabsContent value="team-members">
          <TeamMemberList />
        </TabsContent>
        <TabsContent value="fields">
          <FieldManagement />
        </TabsContent>
        <TabsContent value="registries">
          <RegistryManagement />
        </TabsContent>
      </Tabs>
    </div>
  )
}

export default Index