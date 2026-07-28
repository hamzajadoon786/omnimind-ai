import React, { useState, useEffect, useRef } from 'react';
import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';
import { Prism as SyntaxHighlighter } from 'react-syntax-highlighter';
import { atomDark } from 'react-syntax-highlighter/dist/esm/styles/prism';
import Sidebar from './components/Sidebar';

export default function App() {
  const [chats, setChats] = useState(() => {
    const saved = localStorage.getItem('omnimind_chats');
    return saved ? JSON.parse(saved) : [{ id: Date.now().toString(), title: 'New Chat', messages: [] }];
  });

  const [currentChatId, setCurrentChatId] = useState(() => chats[0]?.id || Date.now().toString());
  const [input, setInput] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [copiedIndex, setCopiedIndex] = useState(null);
  const messagesEndRef = useRef(null);

  const currentChat = chats.find((c) => c.id === currentChatId) || chats[0];

  useEffect(() => {
    localStorage.setItem('omnimind_chats', JSON.stringify(chats));
  }, [chats]);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [currentChat?.messages]);

  const handleNewChat = () => {
    const newChat = { id: Date.now().toString(), title: 'New Chat', messages: [] };
    setChats((prev) => [newChat, ...prev]);
    setCurrentChatId(newChat.id);
  };

  const handleDeleteChat = (id) => {
    const filtered = chats.filter((c) => c.id !== id);
    if (filtered.length === 0) {
      const defaultChat = { id: Date.now().toString(), title: 'New Chat', messages: [] };
      setChats([defaultChat]);
      setCurrentChatId(defaultChat.id);
    } else {
      setChats(filtered);
      if (currentChatId === id) setCurrentChatId(filtered[0].id);
    }
  };

  const copyToClipboard = (text, index) => {
    navigator.clipboard.writeText(text);
    setCopiedIndex(index);
    setTimeout(() => setCopiedIndex(null), 2000);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!input.trim() || isLoading) return;

    const userMessage = { role: 'user', content: input };
    const updatedMessages = [...currentChat.messages, userMessage];
    
    const updatedTitle = currentChat.messages.length === 0 ? input.slice(0, 20) + '...' : currentChat.title;

    setChats((prev) =>
      prev.map((c) =>
        c.id === currentChatId
          ? { ...c, title: updatedTitle, messages: updatedMessages }
          : c
      )
    );

    setInput('');
    setIsLoading(true);

    try {
      const response = await fetch('/api/chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          messages: [
            { role: 'system', content: 'You are OmniMind AI, an advanced, highly intelligent AI assistant.' },
            ...updatedMessages,
          ],
        }),
      });

      const data = await response.json();
      const aiMessage = { role: 'assistant', content: data.reply || 'No response received.' };

      setChats((prev) =>
        prev.map((c) =>
          c.id === currentChatId
            ? { ...c, messages: [...c.messages, aiMessage] }
            : c
        )
      );
    } catch (err) {
      console.error(err);
      setChats((prev) =>
        prev.map((c) =>
          c.id === currentChatId
            ? { ...c, messages: [...c.messages, { role: 'assistant', content: '⚠️ Server connect hone mein error aaya.' }] }
            : c
        )
      );
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="flex h-screen bg-slate-950 text-slate-100 font-sans">
      <Sidebar
        chats={chats}
        currentChatId={currentChatId}
        onSelectChat={setCurrentChatId}
        onNewChat={handleNewChat}
        onDeleteChat={handleDeleteChat}
      />

      <main className="flex-1 flex flex-col h-full relative">
        <div className="flex-1 overflow-y-auto p-6 space-y-6 max-w-4xl w-full mx-auto">
          {currentChat.messages.length === 0 ? (
            <div className="flex flex-col items-center justify-center h-full text-slate-500">
              <h2 className="text-2xl font-bold mb-2 text-slate-200">Welcome to OmniMind AI</h2>
              <p className="text-sm">Type a message below to start chatting.</p>
            </div>
          ) : (
            currentChat.messages.map((msg, idx) => (
              <div
                key={idx}
                className={`flex gap-4 ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}
              >
                <div
                  className={`max-w-[80%] rounded-2xl p-4 text-sm leading-relaxed ${
                    msg.role === 'user'
                      ? 'bg-blue-600 text-white rounded-br-none'
                      : 'bg-slate-900 border border-slate-800 text-slate-200 rounded-bl-none'
                  }`}
                >
                  <ReactMarkdown
                    remarkPlugins={[remarkGfm]}
                    components={{
                      code({ node, inline, className, children, ...props }) {
                        const match = /language-(\w+)/.exec(className || '');
                        const codeString = String(children).replace(/\n$/, '');
                        return !inline && match ? (
                          <div className="relative my-2 rounded-lg overflow-hidden border border-slate-700">
                            <div className="flex justify-between items-center bg-slate-800 px-3 py-1 text-xs text-slate-400">
                              <span>{match[1]}</span>
                              <button
                                onClick={() => copyToClipboard(codeString, `${idx}-${match[1]}`)}
                                className="hover:text-white transition"
                              >
                                {copiedIndex === `${idx}-${match[1]}` ? 'Copied!' : 'Copy Code'}
                              </button>
                            </div>
                            <SyntaxHighlighter
                              style={atomDark}
                              language={match[1]}
                              PreTag="div"
                              {...props}
                            >
                              {codeString}
                            </SyntaxHighlighter>
                          </div>
                        ) : (
                          <code className="bg-slate-800 px-1 py-0.5 rounded font-mono text-xs" {...props}>
                            {children}
                          </code>
                        );
                      },
                    }}
                  >
                    {msg.content}
                  </ReactMarkdown>
                </div>
              </div>
            ))
          )}
          {isLoading && (
            <div className="text-slate-500 text-sm italic animate-pulse">OmniMind AI is thinking...</div>
          )}
          <div ref={messagesEndRef} />
        </div>

        <div className="p-4 border-t border-slate-800 bg-slate-950">
          <form onSubmit={handleSubmit} className="max-w-4xl mx-auto flex gap-3">
            <input
              type="text"
              value={input}
              onChange={(e) => setInput(e.target.value)}
              placeholder="Message OmniMind AI..."
              className="flex-1 bg-slate-900 border border-slate-800 rounded-xl px-4 py-3 text-sm focus:outline-none focus:border-blue-500 transition text-slate-100 placeholder-slate-500"
            />
            <button
              type="submit"
              disabled={isLoading}
              className="bg-blue-600 hover:bg-blue-500 disabled:opacity-50 text-white px-5 py-3 rounded-xl font-medium text-sm transition"
            >
              Send
            </button>
          </form>
        </div>
      </main>
    </div>
  );
  }
