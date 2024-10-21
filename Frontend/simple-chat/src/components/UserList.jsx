import React, { useState, useEffect } from 'react';
import { Box, Typography, Avatar, Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Paper, Button } from '@mui/material';
import OnlineIcon from '@mui/icons-material/FiberManualRecord';
import { io } from 'socket.io-client';

const socket = io('http://localhost:4000');

const UserList = () => {
    const [users, setUsers] = useState([]);
    const username = localStorage.getItem('sender');
    const userId = localStorage.getItem('senderId');

    useEffect(() => {

        if (username && userId) {
            socket.emit('connect user', { id: userId, name: username });
        }

        socket.on('online users', (onlineUsers) => {
            setUsers(onlineUsers);
        });

        socket.on('chat message', (msg) => {
            // Simpan pesan ke localStorage
            console.log(msg)
            const storedMessages = JSON.parse(localStorage.getItem(`messages_${msg.senderId}`) || '[]');
            storedMessages.push(msg);
            localStorage.setItem(`messages_${msg.senderId}`, JSON.stringify(storedMessages));
        });

        return () => {
            socket.off('online users');
            socket.off('chat message');
        };
    }, []);

    return (
        <Box p={5} textAlign='center'>
            <Typography variant='h5' gutterBottom>Silahkan Pilih User yang sedang online</Typography>
            <TableContainer component={Paper}>
                <Table>
                    <TableHead>
                        <TableRow>
                            <TableCell>Avatar</TableCell>
                            <TableCell>Nama User</TableCell>
                            <TableCell>Status</TableCell>
                            <TableCell>Aksi</TableCell>
                        </TableRow>
                    </TableHead>
                    <TableBody>
                        {users.map(user => (
                            userId != user.userId ?
                            <TableRow key={user.id}>
                                <TableCell>
                                    <Avatar sx={{ bgcolor: user.online ? 'green' : 'gray' }}>
                                        <OnlineIcon />
                                    </Avatar>
                                </TableCell>
                                <TableCell>{user.username}</TableCell>
                                <TableCell>{user.online ? 'Online' : 'Offline'}</TableCell>
                                <TableCell>
                                    <Button
                                        variant="contained"
                                        color="primary"
                                        disabled={!user.online}
                                        onClick={() => {
                                            localStorage.setItem('recipientId', user.userId);
                                            window.location.href = `/chat/${user.userId}/${user.username}`;
                                        }}
                                    >
                                        Chat
                                    </Button>
                                </TableCell>
                            </TableRow> : null
                        ))}
                    </TableBody>
                </Table>
            </TableContainer>
        </Box>
    );
};

export default UserList;