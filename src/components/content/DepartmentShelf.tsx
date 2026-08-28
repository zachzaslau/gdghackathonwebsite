import type { TeamDepartment, TeamMember } from '../../types/content'
import { SectionHeading } from '../layout/SectionHeading'
import { TeamMemberCard } from './TeamMemberCard'

interface DepartmentShelfProps {
  department: TeamDepartment
  members: TeamMember[]
}

export function DepartmentShelf({ department, members }: DepartmentShelfProps) {
  return (
    <section className="mb-10">
      <SectionHeading>{department}</SectionHeading>
      <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 md:grid-cols-4">
        {members.map((member) => (
          <TeamMemberCard key={member.id} member={member} />
        ))}
      </div>
    </section>
  )
}
