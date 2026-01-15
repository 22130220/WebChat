import type { TeamMember } from '../../../types/interfaces/ITeamMember';

interface Props {
  member: TeamMember;
  onClick?: () => void; // Optional click handler
}

const TeamMemberItem = ({ member, onClick }: Props) => {
  const isAvatarImage = member.avatar && (
    member.avatar.startsWith('data:image/')
  );

  return (
    <div 
      className="flex items-center gap-3 hover:bg-[var(--bg-hover)] p-2 rounded-lg cursor-pointer transition-colors"
      onClick={onClick}
    >
      <div className="w-10 h-10 rounded-full bg-[var(--bg-tertiary)] flex items-center justify-center text-xl flex-shrink-0 overflow-hidden">
        {isAvatarImage ? (
          <img 
            src={member.avatar} 
            alt={member.name} 
            className="w-full h-full object-cover"
            onError={(e) => {
              // Fallback về emoji nếu ảnh lỗi
              e.currentTarget.style.display = 'none';
              e.currentTarget.parentElement!.innerHTML = '👨‍💼';
            }}
          />
        ) : (
          <span>{member.avatar || '👨‍💼'}</span>
        )}
      </div>
      <div className="flex-1 min-w-0">
        <h4 className="font-medium text-sm text-[var(--text-primary)] truncate">
          {member.name}
        </h4>
        {member.role && (
          <p className="text-xs text-[var(--text-muted)] truncate">
            {member.role}
          </p>
        )}
      </div>
    </div>
  );
};

export default TeamMemberItem;
