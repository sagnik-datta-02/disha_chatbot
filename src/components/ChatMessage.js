import React from 'react';
import { Paper, Typography } from '@mui/material';
import './ChatMessage.css'; 

const ChatMessage = ({ message, isUser }) => {
  return (
    <Paper
      className={`chat-message ${isUser ? 'user' : 'chatbot'}`} 
    >
      <Typography variant="body1">{message}</Typography>
    </Paper>
  );
};


export default ChatMessage;
