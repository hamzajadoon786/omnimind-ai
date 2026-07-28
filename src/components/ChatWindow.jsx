import React, { useState } from 'react';
import { Bot, User, Copy, Check, Menu, Sparkles } from 'lucide-react';

export default function ChatWindow({ messages, isLoading, onToggleSidebar }) {
  const [copiedIndex, setCopiedIndex] = useState(null);

  const handleCopy = (text, index) => {
    navigator.clipboard.writeText(text);
    setCopiedIndex(index);
    setTimeout(() => setCopiedIndex(null), 2000);
  };

  return (
    <div className="flex-1 flex flex-col h-full bg-slate-950 overflow-hidden relative">
      {/* Mobile Top Header */}
      <header className="md:hidden flex items-center justify-between p-4 bg-slate-900 border-b border-slate-800">
        <button onClick={onToggleSidebar} className="text-slate-300 hover:text-white">
          <Menu className="w-6 h-6" />
        </button>
        <span className="font-semibold text-sm text-slate-200">OmniMind AI</span>
        <div className="w-6" />
      </header>

      {/* Messages Container */}
      <div className="flex-1 overflow-y-auto p-4 md:p-6 space-y-6">
        {messages.length === 0 ? (
          <div className="h-full flex flex-col items-center justify-center text-center p-6">
            <div className="w-16 h-16 bg-indigo-600/10 border border-indigo-500/20 rounded-2xl flex items-center justify-center mb-4 text-indigo-400">
              <Sparkles className="w-8 h-8" />
            </div>
            <h2 className="text-2xl font-bold text-slate-100 mb-2">Welcome to OmniMind AI</h2>
            <p className="text-sm text-slate-400 max-w-md">
              Your personal multi-model AI assistant. Start a new conversation or pick up where you left off.
            </p>
          </div>
        ) : (
          messages.map((msg, index) => (
            <div
              key={index}
              className={`flex gap-3 max-w-3xl mx-auto ${
                msg.sender === 'user' ? 'justify-end' : 'justify-start'
              }`}
            >
              {msg.sender === 'ai' && (
                <div className="w-8 h-8 rounded-lg bg-indigo-600/20 border border-indigo-500/30 flex items-center justify-center text-indigo-400 shrink-0">
                  <Bot className="w-4 h-4" />
                </div>
              )}

              <div className={`relative group max-w-[85%] rounded-2xl p-4 text-sm leading-relaxed ${
                msg.sender === 'user'
                  ? 'bg-indigo-600 text-white rounded-tr-none'
                  : 'bg-slate-900 border border-slate-800 text-slate-200 rounded-tl-none'
              }`}>
                <p className="whitespace-pre-wrap">{msg.text}</p>

                {msg.sender === 'ai' && (
                  <button
                    onClick={() => handleCopy(msg.text, index)}
                    className="absolute top-2 right-2 opacity-0 group-hover:opacity-100 p-1.5 bg-slate-800 hover:bg-slate-700 rounded-md text-slate-400 hover:text-white transition-all"
                    title="Copy response"
                  >
                    {copiedIndex === index ? (
                      <Check className="w-3.5 h-3.5 text-green-400" />
                    ) : (
                      <Copy className="w-3.5 h-3.5" />
                    )}
                  </button>
                )}
              </div>

              {msg.sender === 'user' && (
                <div className="w-8 h-8 rounded-lg bg-slate-800 border border-slate-700 flex items-center justify-center text-slate-300 shrink-0">
                  <User className="w-4 h-4" />
                </div>
              )}
            </div>
          ))
        )}

        {isLoading && (
          <div className="flex gap-3 max-w-3xl mx-auto">
            <div className="w-8 h-8 rounded-lg bg-indigo-600/20 border border-indigo-500/30 flex items-center justify-center text-indigo-400 shrink-0">
              <Bot className="w-4 h-4 animate-spin" />
            </div>
            <div className="bg-slate-900 border border-slate-800 text-slate-400 rounded-2xl rounded-tl-none p-4 text-sm animate-pulse">
              OmniMind is thinking...
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
