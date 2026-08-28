import { teamMembers } from '../data/teamMembers'
import type { TeamDepartment } from '../types/content'
import { PageShell } from '../components/layout/PageShell'
import { DepartmentShelf } from '../components/content/DepartmentShelf'

const departmentOrder: TeamDepartment[] = [
  'Organizers',
  'Logistics & Operations',
  'Finance',
  'Technology',
  'Marketing & Design',
]

export function TeamPage() {
  return (
    <PageShell title="Meet the Team" subtitle="The people organizing GDG @ UF's hackathon.">
      {departmentOrder.map((department) => {
        const members = teamMembers.filter((member) => member.department === department)
        if (members.length === 0) return null
        return (
          <DepartmentShelf key={department} department={department} members={members} />
        )
      })}
    </PageShell>
  )
}
