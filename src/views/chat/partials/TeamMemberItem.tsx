import type { TeamMember } from '../../../types/interfaces/ITeamMember';

interface Props {
  member: TeamMember;
}

const TeamMemberItem = ({ member }: Props) => (
  <div className="flex items-center gap-3 hover:bg-gray-50 p-2 rounded-lg cursor-pointer">
    <div className="w-10 h-10 rounded-full bg-gray-200 flex items-center justify-center text-xl flex-shrink-0">
      {member.avatar}
    </div>
    <div className="flex-1 min-w-0">
      <h4 className="font-medium text-sm text-gray-900 truncate">
        {member.name}
      </h4>
      <p className="text-xs text-gray-500 truncate">
        {member.role}
      </p>
    </div>
  </div>
);

export default TeamMemberItem;
