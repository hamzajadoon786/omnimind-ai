import React, { useState } from 'react';
import { Send, Bot, User, Loader2 } from 'lucide-react';

export default function ChatSection() {
  const [messages, setMessages] = useState([
    { role: 'assistant', content: 'Hello! I am OmniMind AI. How can I help you today?' }
  ]);
  const [input, setInput] = useState('');
  const [loading, setLoading] = useState(false);

  const sendMessage = async (e) => {
    e.preventDefault();
    if (!input.trim() || loading) return;

    const userMessage = { role: 'user', content: input };
    const updatedMessages = [...messages, userMessage];

    setMessages(updatedMessages);
    setInput('');
    setLoading(true);

    try {
      const response = await fetch('/api/chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          messages: updatedMessages.map(m => ({ role: m.role, content: m.content }))
        }),
      });

      const data = await response.json();

      if (response.ok && data.choices && data.choices[0]) {
        setMessages([...updatedMessages, {
          role: 'assistant',
          content: data.choices[0].message.content
        }]);
      } else {
        throw new Error(data.error || 'Failed to generate response');
      }
    } catch (err) {
      setMessages([...updatedMessages, {
        role: 'assistant',
        content: `Error: ${err.message}`
      }]);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex-1 flex flex-col h-full bg-slate-950">
      <div className="flex-1 overflow-y-auto p-6 space-y-4">
        {messages.map((msg, index) => (
          <div
            key={index}
            className={`flex items-start gap-3 ${
              msg.role === 'user' ? 'flex-row-reverse' : ''
            }`}
          >
            <div className={`p-2 rounded-lg ${msg.role === 'user' ? 'bg-indigo-600' : 'bg-slate-800'}`}>
              {msg.role === 'user' ? <User className="w-5 h-5 text-white" /> : <Bot className="w-5 h-5 text-indigo-400" />}
            </div>
            <div
              className={`max-w-2xl p-4 rounded-2xl text-sm ${
                msg.role === 'user'
                  ? 'bg-indigo-600 text-white rounded-tr-none'
                  : 'bg-slate-900 border border-slate-800 text-slate-200 rounded-tl-none'
              }`}
            >
              {msg.content}
            </div>
          </div>
        ))}
        {loading && (
          <div className="flex items-center gap-3 text-slate-400 text-sm">
            <Loader2 className="w-5 h-5 animate-spin text-indigo-500" />
            OmniMind is thinking...
          </div>
        )}
      </div>

      <form onSubmit={sendMessage} className="p-4 border-t border-slate-800 bg-slate-900 flex gap-2">
        <input
          type="text"
          value={input}
          onChange={(e) => setInput(e.target.value)}
          placeholder="Ask OmniMind anything..."
          className="flex-1 bg-slate-950 border border-slate-800 text-white px-4 py-3 rounded-xl focus:outline-none focus:border-indigo-500 text-sm"
        />
        <button
          type="submit"
          disabled={loading}
          className="bg-indigo-600 hover:bg-indigo-500 disabled:opacity-50 text-white px-5 py-3 rounded-xl flex items-center gap-2 text-sm font-medium transition-colors"
        >
          <Send className="w-4 h-4" /> Send
        </button>
      </form>
    </div>
  );
      }
