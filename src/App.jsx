import React from 'react';
import Sidebar from './components/Sidebar';

function App() {
  return (
    <div style={{ display: 'flex' }}>
      <Sidebar />
      <main style={{ padding: '20px', flex: 1 }}>
        <h1>Welcome to Omnimind AI</h1>
        <p>Your AI assistant is ready.</p>
      </main>
    </div>
  );
}

export default App;
