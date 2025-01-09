import React from 'react';
import { User, Bot } from 'lucide-react';
import { Message } from '../types';

interface ChatMessageProps {
  message: Message;
}

export const ChatMessage: React.FC<ChatMessageProps> = ({ message }) => {
  const isUser = message.role === 'user';

  return (
    <div
      className={`rounded-md p-4 shadow-sm ${
        isUser ? 'bg-gray-50' : 'bg-white'
      }`}
    >
      <div className="flex items-start gap-3">
        <div
          className={`shrink-0 w-8 h-8 rounded-full flex items-center justify-center ${
            isUser ? 'bg-blue-600' : 'bg-gray-600'
          }`}
        >
          {isUser ? (
            <User size={16} className="text-white" />
          ) : (
            <Bot size={16} className="text-white" />
          )}
        </div>
        <div className="flex-1 text-gray-800">
          <div className="text-sm text-gray-600 font-semibold">
            {isUser ? 'You' : 'Assistant'}
          </div>
          <div className="whitespace-pre-wrap">{message.content}</div>
        </div>
      </div>
    </div>
  );
};
