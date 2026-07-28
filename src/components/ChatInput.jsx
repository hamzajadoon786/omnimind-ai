import React, { useState, useRef, useEffect } from 'react';
import { Send, Image, Paperclip } from 'lucide-react';

export default function ChatInput({ onSendMessage, isLoading }) {
  const [input, setInput] = useState('');
  const textareaRef = useRef(null);

  const handleSubmit = (e) => {
    e?.preventDefault();
    if (!input.trim() || isLoading) return;
    onSendMessage(input);
    setInput('');
    if (textareaRef.current) {
      textareaRef.current.style.height = 'auto';
    }
  };

  const handleKeyDown = (e) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSubmit();
    }
  };

  useEffect(() => {
    if (textareaRef.current) {
      textareaRef.current.style.height = 'auto';
      textareaRef.current.style.height = `${Math.min(textareaRef.current.scrollHeight, 150)}px`;
    }
  }, [input]);

  return (
    <div className="p-4 bg-slate-950 border-t border-slate-800/80">
      <form onSubmit={handleSubmit} className="max-w-3xl mx-auto relative">
        <div className="relative flex items-end bg-slate-900 border border-slate-800 rounded-2xl focus-within:border-indigo-500/80 transition-all p-2">
          {/* File Upload Attachment Icon */}
          <button
            type="button"
            className="p-2 text-slate-500 hover:text-slate-300 transition-colors rounded-lg"
            title="Attach File (UI Placeholder)"
          >
            <Paperclip className="w-5 h-5" />
          </button>

          {/* Text Area */}
          <textarea
            ref={textareaRef}
            rows={1}
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyDown={handleKeyDown}
            placeholder="Ask OmniMind anything... (Press Enter to send)"
            disabled={isLoading}
            className="flex-1 bg-transparent px-2 py-2 text-slate-200 placeholder-slate-500 focus:outline-none text-sm resize-none max-h-36 overflow-y-auto"
          />

          {/* Send Button */}
          <button
            type="submit"
            disabled={!input.trim() || isLoading}
            className="p-2 bg-indigo-600 hover:bg-indigo-500 disabled:bg-slate-800 disabled:text-slate-600 text-white rounded-xl transition-colors shrink-0"
          >
            <Send className="w-4 h-4" />
          </button>
        </div>
      </form>
    </div>
  );
}
