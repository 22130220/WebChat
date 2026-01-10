import React, { useState, useMemo } from 'react';
import type { IMessage } from '../../../types/interfaces/IMessage';
import { Search } from 'lucide-react';

interface RecipientSelectorProps {
  recipients: IMessage[];
  selectedRecipients: IMessage[];
  onToggleRecipient: (recipient: IMessage) => void;
}

const RecipientSelector: React.FC<RecipientSelectorProps> = ({
  recipients,
  selectedRecipients,
  onToggleRecipient,
}) => {
  const [searchTerm, setSearchTerm] = useState('');

  const filteredRecipients = useMemo(() => {
    if (!searchTerm.trim()) {
      return recipients;
    }
    const lowercaseSearch = searchTerm.toLowerCase().trim();
    return recipients.filter((recipient) =>
      recipient.name?.toLowerCase().includes(lowercaseSearch)
    );
  }, [recipients, searchTerm]);

  const isSelected = (recipient: IMessage) => {
    return selectedRecipients.some((r) => r.name === recipient.name && r.type === recipient.type);
  };

  return (
    <div className="flex flex-col h-full">
      {/* Search Box */}
      <div className="mb-3 relative">
        <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-[var(--text-muted)] w-4 h-4" />
        <input
          type="text"
          placeholder="Tìm kiếm..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="w-full pl-10 pr-4 py-2 border border-[var(--border-primary)] bg-[var(--bg-primary)] text-[var(--text-primary)] placeholder:text-[var(--text-muted)] rounded-lg focus:outline-none focus:ring-2 focus:ring-[var(--accent-primary)] text-sm"
        />
      </div>

      {/* Recipients List */}
      <div className="flex-1 overflow-y-auto space-y-1">
        {filteredRecipients.length > 0 ? (
          filteredRecipients.map((recipient) => (
            <label
              key={`${recipient.name}-${recipient.type}`}
              className="flex items-center gap-3 p-2 hover:bg-[var(--bg-hover)] rounded-lg cursor-pointer transition-colors"
            >
              <input
                type="checkbox"
                checked={isSelected(recipient)}
                onChange={() => onToggleRecipient(recipient)}
                className="w-4 h-4 text-[var(--accent-primary)] border-[var(--border-primary)] rounded focus:ring-[var(--accent-primary)]"
              />
              <div className="w-8 h-8 rounded-full bg-gray-200 flex items-center justify-center text-sm flex-shrink-0">
                {recipient.type === 1 ? '👥' : '👨‍💼'}
              </div>
              <div className="flex-1 min-w-0">
                <p className="text-sm font-medium text-[var(--text-primary)] truncate">
                  {recipient.name}
                </p>
                <p className="text-xs text-[var(--text-muted)]">
                  {recipient.type === 1 ? 'Nhóm' : 'Cá nhân'}
                </p>
              </div>
            </label>
          ))
        ) : (
          <div className="text-center text-[var(--text-muted)] text-sm py-4">
            Không tìm thấy kết quả
          </div>
        )}
      </div>
    </div>
  );
};

export default RecipientSelector;
