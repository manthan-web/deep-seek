import React from 'react';
import { MessageCircle, Plus, Trash2 } from 'lucide-react';
import { Conversation } from '../types';

interface SidebarProps {
  conversations: Conversation[];
  activeConversation: string;
  onSelect: (id: string) => void;
  onNew: () => void;
  onDelete: (id: string) => void;
}

export function Sidebar({ conversations, activeConversation, onSelect, onNew, onDelete }: SidebarProps) {
  return (
    <div className="w-64 bg-gray-900 h-screen p-4 flex flex-col">
      <button
        onClick={onNew}
        className="flex items-center gap-2 w-full px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 mb-4"
      >
        <Plus size={20} />
        New Chat
      </button>
      
      <div className="flex-1 overflow-y-auto">
        {conversations.map((conv) => (
          <div
            key={conv.id}
            className={`flex items-center gap-2 px-4 py-3 rounded-lg cursor-pointer mb-2 ${
              activeConversation === conv.id ? 'bg-gray-700' : 'hover:bg-gray-800'
            }`}
            onClick={() => onSelect(conv.id)}
          >
            <MessageCircle size={20} className="text-gray-400" />
            <span className="text-gray-200 flex-1 truncate">{conv.title}</span>
            {activeConversation === conv.id && (
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  onDelete(conv.id);
                }}
                className="text-gray-400 hover:text-red-400"
              >
                <Trash2 size={16} />
              </button>
            )}
          </div>
        ))}
      </div>
    </div>
  );
}