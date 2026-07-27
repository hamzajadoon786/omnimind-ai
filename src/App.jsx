import React, { useState, useRef, useEffect } from 'react';
import Sidebar from './components/Sidebar';
import { askMistral } from './services/mistral';

function App() {
  const [input, setInput] = useState('');
  const [messages, setMessages] = useState([]);
  const [loading, setLoading] = useState(false);
  const chatEndRef = useRef(null);

  // چیٹ اٹومیٹک نیچے اسکرول کرنے کے لیے
  useEffect(() => {
    chatEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages, loading]);

  const handleSend = async () => {
    if (!input.trim() || loading) return;

    const userText = input.trim();
    setInput('');
    
    // صارف کا میسج شامل کریں
    const updatedMessages = [...messages, { role: 'user', text: userText }];
    setMessages(updatedMessages);
    setLoading(true);

    try {
      const reply = await askMistral(userText);
      setMessages([...updatedMessages, { role: 'assistant', text: reply }]);
    } catch (err) {
      setMessages([
        ...updatedMessages, 
        { role: 'assistant', text: "❌ معذرت! AI سے جواب حاصل نہیں ہو سکا۔ کی (API Key) یا کنیکشن چیک کریں۔" }
      ]);
    } finally {
      setLoading(false);
    }
  };

  const clearChat = () => {
    setMessages([]);
  };

  return (
    <div style={{ display: 'flex', height: '100vh', backgroundColor: '#0f172a', color: '#f8fafc', fontFamily: 'system-ui, -apple-system, sans-serif' }}>
      {/* سائیڈ بار Component */}
      <Sidebar />

      {/* مین چیٹ باڈی */}
      <main style={{ flex: 1, display: 'flex', flexDirection: 'column', height: '100vh' }}>
        
        {/* ہیڈر (Header) */}
        <header style={{ padding: '16px 24px', borderBottom: '1px solid #1e293b', display: 'flex', justifyContent: 'space-between', alignItems: 'center', backgroundColor: '#1e293b' }}>
          <div>
            <h1 style={{ margin: 0, fontSize: '20px', fontWeight: 'bold', color: '#38bdf8' }}>Omnimind AI</h1>
            <p style={{ margin: '2px 0 0 0', fontSize: '12px', color: '#94a3b8' }}>Advanced AI Assistant Engine</p>
          </div>
          {messages.length > 0 && (
            <button 
              onClick={clearChat}
              style={{ backgroundColor: '#ef4444', color: '#fff', border: 'none', padding: '8px 14px', borderRadius: '6px', fontSize: '12px', cursor: 'pointer', fontWeight: '500' }}>
              Clear Chat
            </button>
          )}
        </header>

        {/* چیٹ ہسٹری (Chat Messages Area) */}
        <div style={{ flex: 1, overflowY: 'auto', padding: '24px', display: 'flex', flexDirection: 'column', gap: '16px' }}>
          {messages.length === 0 ? (
            <div style={{ margin: 'auto', textAlign: 'center', color: '#64748b' }}>
              <div style={{ fontSize: '48px', marginBottom: '12px' }}>🤖</div>
              <h2 style={{ color: '#e2e8f0', margin: '0 0 8px 0' }}>Welcome to Omnimind AI</h2>
              <p style={{ margin: 0, fontSize: '14px' }}>How can I help you today? Type a message below to get started.</p>
            </div>
          ) : (
            messages.map((msg, index) => (
              <div 
                key={index}
                style={{
                  display: 'flex',
                  justifyContent: msg.role === 'user' ? 'flex-end' : 'flex-start',
                }}>
                <div style={{
                  maxWidth: '75%',
                  padding: '12px 18px',
                  borderRadius: msg.role === 'user' ? '18px 18px 4px 18px' : '18px 18px 18px 4px',
                  backgroundColor: msg.role === 'user' ? '#0284c7' : '#334155',
                  color: '#ffffff',
                  fontSize: '15px',
                  lineHeight: '1.5',
                  whiteSpace: 'pre-wrap',
                  wordBreak: 'break-word',
                  boxShadow: '0 2px 4px rgba(0,0,0,0.1)'
                }}>
                  <strong style={{ display: 'block', fontSize: '11px', color: msg.role === 'user' ? '#bae6fd' : '#94a3b8', marginBottom: '4px' }}>
                    {msg.role === 'user' ? 'You' : 'Omnimind AI'}
                  </strong>
                  {msg.text}
                </div>
              </div>
            ))
          )}

          {/* لوڈنگ انڈیکیٹر */}
          {loading && (
            <div style={{ display: 'flex', justifyContent: 'flex-start' }}>
              <div style={{ backgroundColor: '#334155', padding: '12px 18px', borderRadius: '18px 18px 18px 4px', color: '#94a3b8', fontSize: '14px' }}>
                Omnimind AI is thinking...
              </div>
            </div>
          )}
          <div ref={chatEndRef} />
        </div>

        {/* ان پٹ باکس (Input Box Section) */}
        <div style={{ padding: '16px 24px', backgroundColor: '#1e293b', borderTop: '1px solid #334155' }}>
          <div style={{ display: 'flex', gap: '12px', maxWidth: '1000px', margin: '0 auto' }}>
            <input 
              type="text"
              value={input}
              onChange={(e) => setInput(e.target.value)}
              onKeyDown={(e) => e.key === 'Enter' && handleSend()}
              placeholder="Ask Omnimind AI anything..."
              style={{
                flex: 1,
                padding: '14px 18px',
                fontSize: '15px',
                backgroundColor: '#0f172a',
                color: '#ffffff',
                border: '1px solid #475569',
                borderRadius: '8px',
                outline: 'none'
              }}
            />
            <button 
              onClick={handleSend}
              disabled={loading || !input.trim()}
              style={{
                padding: '14px 24px',
                fontSize: '15px',
                fontWeight: 'bold',
                backgroundColor: loading || !input.trim() ? '#475569' : '#0284c7',
                color: '#ffffff',
                border: 'none',
                borderRadius: '8px',
                cursor: loading || !input.trim() ? 'not-allowed' : 'pointer',
                transition: 'background-color 0.2s'
              }}>
              Send
            </button>
          </div>
        </div>

      </main>
    </div>
  );
}

export default App;
