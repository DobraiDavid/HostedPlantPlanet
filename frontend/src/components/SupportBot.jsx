import React, { useState, useEffect, useRef } from 'react';
import { sendMessageToBot } from '../api/api';
import { useUser } from '../context/UserContext'; 
import { styled } from '@mui/material/styles';
import {
  Box,
  Fab,
  Paper,
  Typography,
  TextField,
  IconButton,
  Avatar,
  Zoom,
  useMediaQuery,
  useTheme
} from '@mui/material';
import ChatIcon from '@mui/icons-material/Chat';
import CloseIcon from '@mui/icons-material/Close';
import SendIcon from '@mui/icons-material/Send';
import SpaIcon from '@mui/icons-material/Spa';

const ChatWindow = styled(Paper, {
  shouldForwardProp: (prop) => prop !== 'isMobile',
})(({ theme, isMobile }) => ({
  width: 380, 
  height: 550, 
  display: 'flex',
  flexDirection: 'column',
  position: 'absolute',
  bottom: 24, 
  right: 24, 
  overflow: 'hidden',
  borderRadius: isMobile ? 0 : 16,
  boxShadow: theme.shadows[10],
  ...(isMobile && {
    width: '100%',
    height: '95%',
    position: 'fixed',
    left: 0,
    right: 0,
    bottom: 0,
    zIndex: 1200,
  })
}));

const ChatHeader = styled(Box)(({ theme }) => ({
  backgroundColor: theme.palette.success.main,
  color: theme.palette.common.white,
  padding: theme.spacing(2), 
  display: 'flex',
  justifyContent: 'space-between',
  alignItems: 'center'
}));

const ChatBody = styled(Box)(({ theme }) => ({
  flexGrow: 1,
  padding: theme.spacing(2.5), 
  overflowY: 'auto',
  backgroundColor: theme.palette.grey[50]
}));

const ChatFooter = styled(Box)(({ theme }) => ({
  padding: theme.spacing(2), 
  borderTop: `1px solid ${theme.palette.divider}`,
  display: 'flex',
  backgroundColor: theme.palette.background.paper
}));

const MessageBubble = styled(Box, {
  shouldForwardProp: prop => prop !== 'isUser'
})(({ theme, isUser }) => ({
  maxWidth: '80%', 
  padding: theme.spacing(1.5, 2),
  borderRadius: 16,
  marginBottom: theme.spacing(2), 
  wordBreak: 'break-word',
  backgroundColor: isUser ? theme.palette.success.main : theme.palette.grey[200],
  color: isUser ? theme.palette.common.white : theme.palette.text.primary,
  alignSelf: isUser ? 'flex-end' : 'flex-start'
}));

const EmptyStateContainer = styled(Box)(({ theme }) => ({
  display: 'flex',
  flexDirection: 'column',
  alignItems: 'center',
  justifyContent: 'center',
  height: '100%',
  padding: theme.spacing(4),
  textAlign: 'center'
}));

const GreenAvatar = styled(Avatar)(({ theme }) => ({
  backgroundColor: theme.palette.success.light,
  color: theme.palette.success.contrastText,
  marginBottom: theme.spacing(2),
  width: theme.spacing(7), 
  height: theme.spacing(7) 
}));

const TypingIndicator = styled(Box)(({ theme }) => ({
  display: 'inline-flex',
  alignItems: 'center',
  padding: theme.spacing(1, 2),
  borderRadius: 16,
  backgroundColor: theme.palette.grey[200],
  alignSelf: 'flex-start'
}));

// Styled component for the typing animation
const TypingDots = styled('span')(({ theme }) => ({
  display: 'inline-block',
  width: '24px',
  '&::after': {
    content: '"..."',
    animation: 'typingDots 1.5s infinite',
    display: 'inline-block',
    overflow: 'hidden',
    verticalAlign: 'bottom',
    whiteSpace: 'nowrap',
  },
  '@keyframes typingDots': {
    '0%': { width: '0px' },
    '33%': { width: '6px' },
    '66%': { width: '12px' },
    '100%': { width: '18px' }
  }
}));

const SupportBot = () => {
  const { user } = useUser(); 
  const [messages, setMessages] = useState([]);
  const [input, setInput] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [isOpen, setIsOpen] = useState(false);
  const messagesEndRef = useRef(null);
  const inputRef = useRef(null);
  const chatWindowRef = useRef(null);
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('sm'));

  // Clear messages when user logs out
  useEffect(() => {
    if (!user) {
      setMessages([]);
    }
  }, [user]);

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  useEffect(() => {
    if (isOpen && inputRef.current) {
      setTimeout(() => {
        inputRef.current.focus();
      }, 100);
    }
  }, [isOpen]);

  // Add click outside listener (only on desktop)
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (isOpen && chatWindowRef.current && !chatWindowRef.current.contains(event.target) && !isMobile) {
        setIsOpen(false);
      }
    };

    if (isOpen) {
      document.addEventListener('mousedown', handleClickOutside);
    }
    
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [isOpen, isMobile]);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  const handleSendMessage = async (e) => {
    e.preventDefault();
    if (!input.trim()) return;

    // Add user message to chat
    const userMessage = { text: input, sender: 'user' };
    setMessages((prev) => [...prev, userMessage]);
    setInput('');
    setIsLoading(true);

    try {
      const botResponse = await sendMessageToBot(input);
      
      // Add bot response to chat
      setTimeout(() => {
        setMessages((prev) => [
          ...prev,
          { text: botResponse, sender: 'bot' }
        ]);
        setIsLoading(false);
      }, 500);
    } catch (error) {
      console.error('Error sending message:', error);
      setMessages((prev) => [
        ...prev,
        { 
          text: "Sorry, I'm having trouble connecting right now. Please try again in a moment.", 
          sender: 'bot' 
        }
      ]);
      setIsLoading(false);
    }
  };

  const renderEmptyState = () => (
    <EmptyStateContainer>
      <GreenAvatar>
        <SpaIcon fontSize="large" />
      </GreenAvatar>
      <Typography variant="h5" gutterBottom color="textPrimary">
        Plant Planet Support
      </Typography>
      <Typography variant="body1" color="textSecondary">
        How can we help with your plants today? Ask us anything about plant care, orders, or subscriptions.
      </Typography>
    </EmptyStateContainer>
  );

  return (
    <Box sx={{ position: 'fixed', bottom: 24, right: 24, zIndex: 1050 }}>
      <Zoom in={isOpen}>
        <ChatWindow 
          elevation={6}
          ref={chatWindowRef}
          isMobile={isMobile}
        >
          <ChatHeader>
            <Box sx={{ display: 'flex', alignItems: 'center' }}>
              <SpaIcon sx={{ mr: 1.5, fontSize: 28 }} />
              <Typography variant="h6" fontWeight="medium">
                Plant Planet Support
              </Typography>
            </Box>
            <IconButton 
              size="medium"
              onClick={() => setIsOpen(false)}
              sx={{ color: 'inherit' }}
              aria-label="Close chat"
            >
              <CloseIcon fontSize="medium" />
            </IconButton>
          </ChatHeader>
          
          <ChatBody>
            {messages.length === 0 ? (
              renderEmptyState()
            ) : (
              <Box sx={{ display: 'flex', flexDirection: 'column' }}>
                {messages.map((msg, index) => (
                  <MessageBubble 
                    key={index} 
                    isUser={msg.sender === 'user'}
                    sx={{ 
                      alignSelf: msg.sender === 'user' ? 'flex-end' : 'flex-start'
                    }}
                  >
                    <Typography variant="body1">{msg.text}</Typography>
                  </MessageBubble>
                ))}
                
                {isLoading && (
                  <TypingIndicator>
                    <Box sx={{ display: 'flex', alignItems: 'center' }}>
                      <Typography variant="body1">
                        Typing<TypingDots />
                      </Typography>
                    </Box>
                  </TypingIndicator>
                )}
              </Box>
            )}
            <div ref={messagesEndRef} />
          </ChatBody>
          
          <ChatFooter component="form" onSubmit={handleSendMessage} autoComplete="off">
            <TextField
              inputRef={inputRef}
              fullWidth
              size="medium"
              placeholder="Type your message..."
              value={input}
              onChange={(e) => setInput(e.target.value)}
              variant="outlined"
              autoComplete="off"
              InputProps={{
                sx: { borderRadius: 5 }
              }}
            />
            <IconButton 
              type="submit"
              color="success"
              size="large"
              disabled={isLoading || !input.trim()}
              sx={{ ml: 1.5 }}
              aria-label="Send message"
            >
              <SendIcon fontSize="medium" />
            </IconButton>
          </ChatFooter>
        </ChatWindow>
      </Zoom>

      {/* Only show the Fab button when chat is closed */}
      {!isOpen && (
        <Fab
          color="success"
          size="large" 
          aria-label="Open support chat"
          onClick={() => setIsOpen(true)}
          sx={{
            width: 64,
            height: 64, 
            boxShadow: 3,
            '&:hover': { transform: 'scale(1.05)' },
            transition: 'transform 0.2s'
          }}
        >
          <ChatIcon sx={{ fontSize: 30 }} /> 
        </Fab>
      )}
    </Box>
  );
};

export default SupportBot;