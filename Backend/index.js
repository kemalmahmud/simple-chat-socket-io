const express = require('express');
const http = require('http');
const socketIo = require('socket.io');
const cors = require('cors');

const app = express();
const server = http.createServer(app);
const io = socketIo(server, {
  cors: {
    origin: '*',
  }
});

app.use(cors());

let onlineUsers = [];
let offlineMessages = {};

io.on('connection', (socket) => {
  console.log('User connected:', socket.id);

  socket.on('connect user', (userdata) => {
    const { id, name } = userdata;
    let user = onlineUsers.find(user => user.userId === id);
    if (user) {
      user.id = socket.id; // Update socket id if user existing
      user.online = true;
    } else {
      user = { id: socket.id, userId: id, username: name, online: true };
      onlineUsers.push(user);
    }
    io.emit('online users', onlineUsers);
    console.log(`${name} connected with ID ${id}`);

    // Send offline message if user exist but offline
    if (offlineMessages[id]) {
      offlineMessages[id].forEach((message) => {
        io.to(socket.id).emit('chat message', message);
      });
      delete offlineMessages[id];
    }
  });

  socket.on('disconnect', () => {
    const disconnectedUserIndex = onlineUsers.findIndex(user => user.id === socket.id);
    if (disconnectedUserIndex !== -1) {
      const disconnectedUser = onlineUsers[disconnectedUserIndex];
      disconnectedUser.online = false;
      io.emit('online users', onlineUsers);
      console.log('User disconnected:', disconnectedUser.username);
      // Remove disconnected user from onlineUsers
      onlineUsers.splice(disconnectedUserIndex, 1);
    }
  });

  socket.on('chat message', (msg) => {
    const recipientUser = onlineUsers.find(user => user.userId === msg.recipient);
    const timestamp = new Date().toISOString();
    const messageWithTimestamp = { ...msg, timestamp };

    console.log(recipientUser);

    if (recipientUser && recipientUser.online) {
        io.to(recipientUser.id).emit('chat message', messageWithTimestamp);
    } else {
        if (!offlineMessages[msg.recipient]) {
            offlineMessages[msg.recipient] = [];
        }
        offlineMessages[msg.recipient].push(messageWithTimestamp);
        console.log('Sending message to offline user');
        console.log(msg);

        msg.sender = 'System';

        // Swap recipient and senderId
        const tempRecipient = msg.recipient;
        msg.recipient = msg.senderId;
        msg.senderId = tempRecipient;

        msg.text = `User '${msg.recipient}' offline. Message will be sent whenever they online`;

        // Emit the modified message back to the sender directly
        io.to(socket.id).emit('chat message', msg);
    }
});


});

const PORT = process.env.PORT || 4000;

server.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});