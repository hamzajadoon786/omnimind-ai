import React, { useState, useEffect } from 'react';
import Sidebar from './components/Sidebar';
import ChatWindow from './components/ChatWindow';
import ChatInput from './components/ChatInput';

export default function App() {
  const [conversations, setConversations] = useState(() => {
    const saved = localStorage.getItem('omnimind_chats');
    return saved ? JSON.parse(saved) : [];
  });

  const [activeChatId, setActiveChatId] = useState(() => {
    const saved = localStorage.getItem('omnimind_active');
    return saved || null;
  });

  const [model, setModel] = useState('meta-llama/Meta-Llama-3-8B-Instruct');
  const [isLoading, setIsLoading] = useState(false);
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);

  // Sync to LocalStorage
  useEffect(() => {
    localStorage.setItem('omnimind_chats', JSON.stringify(conversations));
  }, [conversations]);

  useEffect(() => {
    if (activeChatId) {
      localStorage.setItem('omnimind_active', activeChatId);
    }
  }, [activeChatId]);

  const activeChat = conversations.find((c) => c.id === activeChatId) || null;
  const messages = activeChat ? activeChat.messages : [];

  const createNewChat = () => {
    const newChat = {
      id: Date.now().toString(),
      title: 'New Chat',
      messages: []
    };
    setConversations((prev) => [newChat, ...prev]);
    setActiveChatId(newChat.id);
  };

  const deleteChat = (id) => {
    setConversations((prev) => prev.filter((c) => c.id !== id));
    if (activeChatId === id) {
      const remaining = conversations.filter((c) => c.id !== id);
      setActiveChatId(remaining.length > 0 ? remaining[0].id : null);
    }
  };

  const handleSendMessage = async (text) => {
    let currentId = activeChatId;

    // Create chat automatically if none is selected
    if (!currentId) {
      const newChat = {
        id: Date.now().toString(),
        title: text.slice(0, 25) + '...',
        messages: []
      };
      setConversations((prev) => [newChat, ...prev]);
      setActiveChatId(newChat.id);
      currentId = newChat.id;
    }

    const userMsg = { sender: 'user', text };

    // Update conversation state locally
    setConversations((prev) =>
      prev.map((chat) => {
        if (chat.id === currentId) {
          const isFirstMessage = chat.messages.length === 0;
          return {
            ...chat,
            title: isFirstMessage ? text.slice(0, 25) + '...' : chat.title,
            messages: [...chat.messages, userMsg]
          };
        }
        return chat;
      })
    );

    setIsLoading(true);

    try {
      const response = await fetch('/api/chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          messages: [...(activeChat?.messages || []), userMsg],
          model: model
        })
      });

      const data = await response.json();

      const aiReply = response.ok 
        ? data.reply 
        : `Error: ${data.error || 'Failed to generate response.'}`;

      setConversations((prev) =>
        prev.map((chat) => {
          if (chat.id === currentId) {
            return {
              ...chat,
              messages: [...chat.messages, { sender: 'ai', text: aiReply }]
            };
          }
          return chat;
        })
      );
    } catch (error) {
      setConversations((prev) =>
        prev.map((chat) => {
          if (chat.id === currentId) {
            return {
              ...chat,
              messages: [
                ...chat.messages,
                { sender: 'ai', text: 'Network connection error.' }
              ]
            };
          }
          return chat;
        })
      );
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="flex h-screen w-screen overflow-hidden bg-slate-950 font-sans">
      <Sidebar
        conversations={conversations}
        activeChatId={activeChatId}
        setActiveChatId={setActiveChatId}
        createNewChat={createNewChat}
        deleteChat={deleteChat}
        currentModel={model}
        setModel={setModel}
        isOpen={isSidebarOpen}
        setIsOpen={setIsSidebarOpen}
      />
      <main className="flex-1 flex flex-col h-full overflow-hidden">
        <ChatWindow
          messages={messages}
          isLoading={isLoading}
          onToggleSidebar={() => setIsSidebarOpen(!isSidebarOpen)}
        />
        <ChatInput
          onSendMessage={handleSendMessage}
          isLoading={isLoading}
        />
      </main>
    </div>
  );
  }
