
import React from 'react';

function Sidebar() {
  return (
    <aside style={{
      width: '240px',
      backgroundColor: '#1e293b',
      borderRight: '1px solid #334155',
      display: 'flex',
      flexDirection: 'column',
      padding: '20px',
      boxSizing: 'border-box'
    }}>
      {/* لوگو / نام */}
      <div style={{ marginBottom: '30px' }}>
        <h2 style={{ color: '#38bdf8', fontSize: '18px', margin: 0, fontWeight: 'bold' }}>
           Omnimind
        </h2>
      </div>

      {/* نیویگیشن لنکس */}
      <nav style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
        <button style={{
          backgroundColor: '#0284c7',
          color: '#ffffff',
          border: 'none',
          padding: '12px 16px',
          borderRadius: '8px',
          textAlign: 'left',
          fontSize: '14px',
          fontWeight: '500',
          cursor: 'pointer'
        }}>
          💬 New Chat
        </button>

        <button style={{
          backgroundColor: 'transparent',
          color: '#94a3b8',
          border: 'none',
          padding: '12px 16px',
          borderRadius: '8px',
          textAlign: 'left',
          fontSize: '14px',
          cursor: 'pointer'
        }}>
          ⚙️ Settings
        </button>
      </nav>

      {/* فوٹر */}
      <div style={{ marginTop: 'auto', paddingTop: '20px', borderTop: '1px solid #334155', color: '#64748b', fontSize: '12px' }}>
        Omnimind AI v1.0
      </div>
    </aside>
  );
}

export default Sidebar;
