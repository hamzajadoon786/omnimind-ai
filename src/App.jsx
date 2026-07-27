import React, { useState } from 'react';
import Sidebar from './components/Sidebar';
import ChatSection from './components/ChatSection';

export default function App() {
  const [activeTab, setActiveTab] = useState('chat');

  return (
    <div className="flex h-screen bg-slate-950 text-slate-100 font-sans overflow-hidden">
      <Sidebar activeTab={activeTab} setActiveTab={setActiveTab} />
      <main className="flex-1 flex flex-col h-full overflow-hidden">
        {activeTab === 'chat' && <ChatSection />}
        {activeTab === 'code' && (
          <div className="flex-1 flex items-center justify-center text-slate-500">
            Code Studio View (Next Module)
          </div>
        )}
        {activeTab === 'image' && (
          <div className="flex-1 flex items-center justify-center text-slate-500">
            Image Generator View (Next Module)
          </div>
        )}
      </main>
    </div>
  );
      }
