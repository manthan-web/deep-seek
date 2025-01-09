import React, { useState, useRef, useEffect } from 'react';
import { Sidebar } from './components/Sidebar';
import { ChatMessage } from './components/ChatMessage';
import { Message, Conversation } from './types';
import { Send } from 'lucide-react';

const App: React.FC = () => {
  const [conversations, setConversations] = useState<Conversation[]>([]);
  const [activeConversation, setActiveConversation] = useState<string>('');
  const [input, setInput] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement | null>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [conversations]);

  const createNewChat = () => {
    const newConversation: Conversation = {
      id: Date.now().toString(),
      title: 'New Chat',
      messages: [],
      timestamp: Date.now(),
    };
    setConversations((prev) => [...prev, newConversation]);
    setActiveConversation(newConversation.id);
  };

  const deleteChat = (id: string) => {
    setConversations((prev) => {
      const updated = prev.filter((conv) => conv.id !== id);
      // If the active conversation was deleted, choose another or reset
      if (activeConversation === id) {
        setActiveConversation(updated.length > 0 ? updated[0].id : '');
      }
      return updated;
    });
  };

  const sendMessage = async (content: string) => {
    if (!content.trim() || !activeConversation) return;

    // User's message object
    const userMessage: Message = { role: 'user', content };

    // First, append user's message
    setConversations((prev) =>
      prev.map((conv) =>
        conv.id === activeConversation
          ? {
              ...conv,
              messages: [...conv.messages, userMessage],
              title:
                conv.messages.length === 0
                  ? `${content.slice(0, 30)}...`
                  : conv.title,
            }
          : conv
      )
    );

    setInput('');
    setIsLoading(true);

    try {
      // Make your API request
      const response = await fetch('https://api.deepseek.com/chat/completions', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': 'Bearer sk-7c9f6cf7fe6b41e19ce1e7b221c95770',
        },
        body: JSON.stringify({
          model: 'deepseek-chat',
          messages: [
            { role: 'system', content: 'You are a helpful assistant.' },
            userMessage,
          ],
          stream: false,
        }),
      });

      const data = await response.json();

      // Assistant’s reply
      const assistantMessage: Message = {
        role: 'assistant',
        content: data.choices[0].message.content,
      };

      // Now, append assistant’s message using the latest state
      setConversations((prev) =>
        prev.map((conv) =>
          conv.id === activeConversation
            ? { ...conv, messages: [...conv.messages, assistantMessage] }
            : conv
        )
      );
    } catch (error) {
      console.error('Error:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const currentConversation = conversations.find(
    (c) => c.id === activeConversation
  );

  return (
    <div className="flex h-screen bg-gray-100">
      <Sidebar
        conversations={conversations}
        activeConversation={activeConversation}
        onSelect={setActiveConversation}
        onNew={createNewChat}
        onDelete={deleteChat}
      />

      <div className="flex-1 flex flex-col">
        {activeConversation ? (
          <>
            <div className="flex-1 overflow-y-auto flex flex-col">
              {currentConversation?.messages.map((message, index) => (
                <ChatMessage key={index} message={message} />
              ))}
              <div ref={messagesEndRef} />
            </div>

            <div className="p-4 border-t">
              <div className="max-w-4xl mx-auto relative">
                <input
                  type="text"
                  value={input}
                  onChange={(e) => setInput(e.target.value)}
                  onKeyPress={(e) => {
                    if (e.key === 'Enter') {
                      sendMessage(input);
                    }
                  }}
                  placeholder="Type your message..."
                  className="w-full p-4 pr-12 rounded-lg border border-gray-300 focus:outline-none focus:border-blue-500"
                  disabled={isLoading}
                />
                <button
                  onClick={() => sendMessage(input)}
                  disabled={isLoading || !input.trim()}
                  className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-400 hover:text-blue-500 disabled:opacity-50"
                >
                  <Send size={20} />
                </button>
              </div>
            </div>
          </>
        ) : (
          <div className="flex-1 flex items-center justify-center">
            <div className="text-center">
              <h1 className="text-2xl font-bold text-gray-700 mb-2">
                Welcome to ChatApp
              </h1>
              <p className="text-gray-500">
                Start a new conversation or select an existing one.
              </p>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default App;
