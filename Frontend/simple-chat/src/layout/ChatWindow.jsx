import React, { useState, useEffect } from 'react';
import { Box, Grid, Typography, Paper, TextField, IconButton } from '@mui/material';
import SendIcon from '@mui/icons-material/Send';
import io from 'socket.io-client';
import { useLocation } from 'react-router-dom';

const ChatWindow = () => {
    const location = useLocation();
    const userId = location.pathname.split('/')[2];
    const username = location.pathname.split('/')[3].replace('%20', ' ');
    const [messageInput, setMessageInput] = useState('');
    const [messages, setMessages] = useState([]);
    const senderId = localStorage.getItem('senderId'); // Assuming senderId is set somewhere

    const [socket, setSocket] = useState(null);
    const [senderName, setSenderName] = useState(localStorage.getItem('sender'));

    useEffect(() => {
        const newSocket = io('http://localhost:4000');

        newSocket.on('connect', () => {
            newSocket.emit('connect user', { id: senderId, name: senderName });
        });

        newSocket.on('chat message', (msg) => {
            console.log('recepient id message:', msg.recipient);
            console.log('Received message from :', userId);
            console.log('sender id message from :', senderId);
            console.log(msg)

            // Filter messages to include those sent to or from the current user
            if (msg.recipient === senderId.toString() && msg.senderId === userId) {
                setMessages(prevMessages => {
                    const updatedMessages = [...prevMessages, msg];
                    return updatedMessages.sort((a, b) => new Date(a.timestamp) - new Date(b.timestamp));
                });

                // Save message to localStorage
                const storedMessages = JSON.parse(localStorage.getItem(`messages_${userId}`) || '[]');
                storedMessages.push(msg);
                localStorage.setItem(`messages_${userId}`, JSON.stringify(storedMessages));
            }
        });

        setSocket(newSocket);

        return () => {
            newSocket.disconnect();
        };
    }, [senderName, userId]);

    useEffect(() => {
        // Ambil pesan dari localStorage dan urutkan berdasarkan timestamp
        const storedMessages = JSON.parse(localStorage.getItem(`messages_${userId}`) || '[]');
        storedMessages.sort((a, b) => new Date(a.timestamp) - new Date(b.timestamp));
        setMessages(storedMessages);
    }, [userId]);

    const handleSend = () => {
        if (messageInput.trim() === '') return;

        const msg = {
            sender: senderName,
            recipient: userId,
            senderId,
            text: messageInput,
            timestamp: new Date().toISOString(),
        };

        // Update state to immediately show the sent message
        setMessages(prevMessages => {
            const updatedMessages = [...prevMessages, msg];
            return updatedMessages.sort((a, b) => new Date(a.timestamp) - new Date(b.timestamp));
        });
        setMessageInput('');

        // Emit the message to the server
        socket.emit('chat message', msg, (ack) => {
            if (!ack.success) {
                console.error('Failed to send message:', ack.error);
            }
        });

        // Simpan pesan ke localStorage
        const storedMessages = JSON.parse(localStorage.getItem(`messages_${userId}`) || '[]');
        storedMessages.push(msg);
        localStorage.setItem(`messages_${userId}`, JSON.stringify(storedMessages));
    };

    const handleInputChange = (event) => {
        setMessageInput(event.target.value);
    };

    const handleKeyDown = (event) => {
        if (event.key === 'Enter') {
            event.preventDefault();
            handleSend();
        }
    };

    return (
        <Box
            display="flex"
            flexDirection="column"
            height="auto"
            backgroundColor="#f0f0f0"
            p={5}
        >
            <Typography color="black" variant="h5" gutterBottom>Chat with {username}</Typography>
            <Grid container direction="column" marginBottom="20px" p={5}>
                {messages.map((msg, index) => (
                    <Grid
                        key={index}
                        item
                        sx={{
                            maxWidth: '70%',
                            padding: '10px',
                            borderRadius: '8px',
                            marginBottom: '10px',
                            alignSelf: msg.sender === senderName ? 'flex-end' : 'flex-start',
                            backgroundColor: msg.sender === senderName ? '#1976d2' : '#e0e0e0',
                            color: msg.sender === senderName ? 'white' : 'black',
                        }}
                        component={Paper}
                    >
                        <Typography variant="body1">{msg.text}</Typography>
                        <Typography variant="caption">{msg.sender} - {new Date(msg.timestamp).toLocaleString()}</Typography>
                    </Grid>
                ))}
            </Grid>
            <Box mt="auto" display="flex" alignItems="center">
                <TextField
                    fullWidth
                    variant="outlined"
                    placeholder="Type your message..."
                    value={messageInput}
                    onChange={handleInputChange}
                    onKeyDown={handleKeyDown}
                />
                <IconButton
                    color="primary"
                    onClick={handleSend}
                    aria-label="send message"
                >
                    <SendIcon />
                </IconButton>
            </Box>
        </Box>
    );
}

export default ChatWindow;