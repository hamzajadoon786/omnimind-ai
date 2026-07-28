import React from 'react';
import { PlusCircle, MessageSquare, Trash2, Bot, X } from 'lucide-react';

export default function Sidebar({
  conversations,
  activeChatId,
  setActiveChatId,
  createNewChat,
  deleteChat,
  currentModel,
  setModel,
  isOpen,
  setIsOpen
}) {
  const models = [
    { id: 'meta-llama/Meta-Llama-3-8B-Instruct', name: 'Meta Llama 3 (8B)' },
    { id: 'mistralai/Mistral-7B-Instruct-v0.2', name: 'Mistral 7B Instruct' },
    { id: 'microsoft/Phi-3-mini-4k-instruct', name: 'Microsoft Phi-3 Mini' },
    { id: 'google/gemma-7b-it', name: 'Google Gemma 7B' }
  ];

  return (
    <>
      {/* Mobile Backdrop */}
      {isOpen && (
        <div 
          className="fixed inset-0 bg-black/60 z-40 md:hidden"
          onClick={() => setIsOpen(false)}
        />
      )}

      <aside className={`fixed md:static inset-y-0 left-0 z-50 w-72 bg-slate-900 border-r border-slate-800 text-slate-200 flex flex-col transition-transform duration-300 ease-in-out ${
        isOpen ? 'translate-x-0' : '-translate-x-full md:translate-x-0'
      }`}>
        {/* Header */}
        <div className="p-4 border-b border-slate-800 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="p-2 bg-indigo-600 rounded-lg">
              <Bot className="w-5 h-5 text-white" />
            </div>
            <span className="font-bold text-lg text-white">OmniMind AI</span>
          </div>
          <button 
            onClick={() => setIsOpen(false)} 
            className="md:hidden text-slate-400 hover:text-white"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* New Chat Button */}
        <div className="p-3">
          <button
            onClick={createNewChat}
            className="w-full flex items-center justify-center gap-2 bg-indigo-600 hover:bg-indigo-500 text-white font-medium py-2.5 px-4 rounded-xl transition-all shadow-md"
          >
            <PlusCircle className="w-4 h-4" />
            <span>New Chat</span>
          </button>
        </div>

        {/* Model Selector */}
        <div className="px-3 py-2 border-b border-slate-800">
          <label className="block text-[10px] font-bold text-slate-400 uppercase tracking-wider mb-1.5">
            Model Engine
          </label>
          <select
            value={currentModel}
            onChange={(e) => setModel(e.target.value)}
            className="w-full bg-slate-800 border border-slate-700/80 text-xs text-slate-200 rounded-lg p-2 focus:outline-none focus:border-indigo-500"
          >
            {models.map((m) => (
              <option key={m.id} value={m.id}>
                {m.name}
              </option>
            ))}
          </select>
        </div>

        {/* Conversation List */}
        <div className="flex-1 overflow-y-auto p-3 space-y-1">
          <p className="text-[10px] font-bold text-slate-500 uppercase tracking-wider px-2 mb-2">
            Recent Conversations
          </p>
          {conversations.length === 0 ? (
            <p className="text-xs text-slate-500 px-2">No past chats yet.</p>
          ) : (
            conversations.map((chat) => (
              <div
                key={chat.id}
                onClick={() => {
                  setActiveChatId(chat.id);
                  setIsOpen(false);
                }}
                className={`group flex items-center justify-between p-2.5 rounded-xl cursor-pointer text-xs transition-colors ${
                  activeChatId === chat.id
                    ? 'bg-slate-800 text-white font-medium'
                    : 'text-slate-400 hover:bg-slate-800/50 hover:text-slate-200'
                }`}
              >
                <div className="flex items-center gap-2 truncate">
                  <MessageSquare className="w-3.5 h-3.5 shrink-0" />
                  <span className="truncate">{chat.title || 'Untitled Chat'}</span>
                </div>
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    deleteChat(chat.id);
                  }}
                  className="opacity-0 group-hover:opacity-100 text-slate-500 hover:text-red-400 transition-opacity p-1"
                >
                  <Trash2 className="w-3.5 h-3.5" />
                </button>
              </div>
            ))
          )}
        </div>

        {/* Footer */}
        <div className="p-3 border-t border-slate-800 text-center">
          <span className="text-[11px] text-slate-500">OmniMind Engine v1.0 • HF Powered</span>
        </div>
      </aside>
    </>
  );
      }
