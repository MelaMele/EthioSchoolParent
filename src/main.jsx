import React from 'react'
import ReactDOM from 'react-dom/client'
import App from './App.jsx'

// ቴሌግራም ሚኒ አፕ አካባቢን ማዘጋጀት
if (window.Telegram && window.Telegram.WebApp) {
  window.Telegram.WebApp.ready();
  window.Telegram.WebApp.expand(); // ገጹን ወደ ላይ ሙሉ በሙሉ እንዲለጠጥ ያደርገዋል
}

ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <App />
  </React.StrictMode>,
)
