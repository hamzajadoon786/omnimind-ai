import React from 'react';

export default function Sidebar({ 
  chats, 
  currentChatId, 
  onSelectChat, 
  onNewChat, 
  onDeleteChat 
}) {
  return (
    <aside className="w-64 bg-slate-900 text-slate-100 h-screen flex flex-col justify-between border-r border-slate-800">
      <div>
        <div className="p-4 border-b border-slate-800 flex justify-between items-center">
          <h1 className="text-xl font-bold bg-gradient-to-r from-blue-400 to-teal-400 bg-clip-text text-transparent">
            OmniMind AI
          </h1>
          <button 
            onClick={onNewChat}
            className="p-2 bg-slate-800 hover:bg-slate-700 rounded-md text-sm font-medium transition"
          >
            + New
          </button>
        </div>

        <div className="p-2 space-y-1 overflow-y-auto max-h-[calc(100vh-120px)]">
          {chats.map((chat) => (
            <div
              key={chat.id}
              onClick={() => onSelectChat(chat.id)}
              className={`flex items-center justify-between p-3 rounded-lg cursor-pointer text-sm transition group ${
                chat.id === currentChatId
                  ? 'bg-slate-800 text-white font-medium'
                  : 'text-slate-400 hover:bg-slate-800/50 hover:text-slate-200'
              }`}
            >
              <span className="truncate max-w-[140px]">{chat.title || 'New Chat'}</span>
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  onDeleteChat(chat.id);
                }}
                className="text-slate-500 hover:text-red-400 opacity-0 group-hover:opacity-100 transition p-1"
              >
                ✕
              </button>
            </div>
          ))}
        </div>
      </div>

      <div className="p-4 border-t border-slate-800 text-xs text-slate-500 text-center">
        Powered by Mistral AI
      </div>
    </aside>
  );
                }
