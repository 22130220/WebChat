import type { TeamMember } from '../../../types/interfaces/ITeamMember';

interface Props {
  member: TeamMember;
}

const TeamMemberItem = ({ member }: Props) => (
  <div className="flex items-center gap-3 hover:bg-[var(--bg-hover)] p-2 rounded-lg cursor-pointer transition-colors">
    <div className="w-10 h-10 rounded-full bg-[var(--bg-tertiary)] flex items-center justify-center text-xl flex-shrink-0">
      {member.avatar}
    </div>
    <div className="flex-1 min-w-0">
      <h4 className="font-medium text-sm text-[var(--text-primary)] truncate">
        {member.name}
      </h4>
      <p className="text-xs text-[var(--text-muted)] truncate">
        {member.role}
      </p>
    </div>
  </div>
);

export default TeamMemberItem;
