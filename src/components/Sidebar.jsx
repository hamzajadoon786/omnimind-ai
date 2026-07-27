import React from 'react';

const Sidebar = () => {
  return (
    <div style={{ width: '250px', padding: '20px', background: '#f4f4f4', height: '100vh' }}>
      <h2>Omnimind AI</h2>
      <nav>
        <ul style={{ listStyle: 'none', padding: 0 }}>
          <li style={{ margin: '10px 0' }}><a href="#home">Home</a></li>
          <li style={{ margin: '10px 0' }}><a href="#chat">Chat</a></li>
          <li style={{ margin: '10px 0' }}><a href="#settings">Settings</a></li>
        </ul>
      </nav>
    </div>
  );
};

export default Sidebar;
