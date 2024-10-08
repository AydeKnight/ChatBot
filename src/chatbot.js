import React, { useState, useEffect, useRef } from 'react';
import './chatbot.css';
import Bot from './assets/bot.png';
import User from './assets/user.png';
import ChatLoading from './chatLoading';
import { IconButton, getTheme } from "@fluentui/react";

const Chatbot = () => {
  const [messages, setMessages] = useState([]);
  const [input, setInput] = useState('');
  const [isOpen, setIsOpen] = useState(false);
  const [loading, setLoading] = useState(true);
  const theme = getTheme();
  const chatbotRef = useRef(null); // Ref for the chatbot container
  const buttonRef = useRef(null); // Ref for the button
  const messagesEndRef = useRef(null); // Ref for scrolling to the bottom

  const iconButtonStyles = {
    root: {
      color: theme.palette.neutralPrimary,
      marginLeft: "auto",
      marginTop: "4px",
      marginRight: "2px",
    },
    rootHovered: {
      color: theme.palette.neutralDark,
    },
  };

  const cancelIcon = { iconName: "Cancel" };
  const minimiseIcon = { iconName: "ChromeMinimize" };

  useEffect(() => {
    setMessages([{ text: "Hello! How can I help you", sender: 'bot' }]);
  }, []);

  useEffect(() => {
    if (isOpen) {
      setTimeout(() => {
        setLoading(false);
      }, 5000);
    }
  }, [isOpen]);

  // Auto-scroll to the bottom whenever messages change
  useEffect(() => {
    if (messagesEndRef.current) {
      messagesEndRef.current.scrollIntoView({ behavior: "smooth" });
    }
  }, [messages]);

  // Close the chatbot when clicking outside
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (
        chatbotRef.current && !chatbotRef.current.contains(event.target) &&
        buttonRef.current && !buttonRef.current.contains(event.target)
      ) {
        setIsOpen(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, []);

  const handleSend = () => {
    if (input.trim()) {
      setMessages(prevMessages => [
        ...prevMessages,
        { text: input, sender: 'user' }
      ]);
      setInput('');

      setTimeout(() => {
        setMessages(prevMessages => [
          ...prevMessages,
          { text: "I'm just a bot! You said: " + input, sender: 'bot' }
        ]);
      }, 1000);
    }
  };

  const toggleChatbox = () => {
    setIsOpen(prev => !prev); // Toggle isOpen state
  };

  const minimiseBot = () => {
    setIsOpen(false);
  };

  const closeBot = () => {
    setLoading(true);
    setIsOpen(false);
    setLoading(false);
    setMessages([]);
    setMessages([{ text: "Hello! How can I help you", sender: 'bot' }]);
  };

  return (
    <>
      <div
        ref={buttonRef}
        className={`floating-btn ${isOpen ? 'active' : ''}`}
        onClick={toggleChatbox}
      >
        <img src={require('./assets/buttonBot.gif')} alt="Chatbot Animation" className='imgBtn' />
      </div>

      {isOpen && (
        <div ref={chatbotRef} className={`chatbot-container ${isOpen ? 'open' : ''}`}>
          <div className="chatbot-header">
            <span>Paron</span>
            <span style={{ float: "right" }}>
              <IconButton
                styles={iconButtonStyles}
                iconProps={minimiseIcon}
                ariaLabel="Minimise popup modal"
                onClick={minimiseBot}
              />
              <IconButton
                styles={iconButtonStyles}
                iconProps={cancelIcon}
                ariaLabel="Close popup modal"
                onClick={closeBot}
              />
            </span>
          </div>
          {
            loading ? <ChatLoading /> :
              <div className="chatbot-messages">
                {messages.map((msg, index) => (
                  <div key={index} className={`message-row ${msg.sender}`}>
                    {msg.sender === 'bot' && <img src={Bot} alt="Bot" className="avatar" />}
                    <div className={`message ${msg.sender}`}>
                      {msg.text}
                    </div>
                    {msg.sender === 'user' && <img src={User} alt="User" className="avatar" />}
                  </div>
                ))}
                {/* This empty div will be used to scroll to the bottom */}
                <div ref={messagesEndRef} />
              </div>
          }
          <div className="chatbot-input">
            <input
              disabled={loading}
              type="text"
              value={input}
              onChange={(e) => setInput(e.target.value)}
              onKeyDown={(e) => e.key === 'Enter' && handleSend()}
              placeholder="Type a message..."
            />
            <button disabled={loading} onClick={handleSend}>Send</button>
          </div>
        </div>
      )}
    </>
  );
};

export default Chatbot;
