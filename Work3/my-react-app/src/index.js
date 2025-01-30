import React from 'react';
import ReactDOM from 'react-dom';
import './index.css'; // CSS เพิ่มเติมถ้ามี
import App from './App'; // Import ไฟล์ app.js ที่มีเนื้อหาหลัก

ReactDOM.render(
  <React.StrictMode>
    <App />
  </React.StrictMode>,
  document.getElementById('root') // Render ใน <div id="root"></div>
);
