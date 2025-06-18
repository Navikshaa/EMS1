const mongoose = require('mongoose');
const Message = require('../models/GroupMessage'); // This is GroupMessage.js
const connectedUsers = new Map(); // userId -> socketId

function broadcastOnlineUsers(io) {
  const onlineUserIds = Array.from(connectedUsers.keys());
  io.emit('online_users', onlineUserIds);
}

function setupSocket(io) {
  io.on('connection', (socket) => {
    console.log('New socket connected:', socket.id);

    // Register user and map socket
    socket.on('register', ({ userId, groupIds }) => {
      connectedUsers.set(userId, socket.id);
      console.log('User registered:', userId);

      // Join all group rooms the user belongs to
      if (Array.isArray(groupIds)) {
        groupIds.forEach((groupId) => {
          socket.join(groupId.toString());
        });
      }

      broadcastOnlineUsers(io);
    });

    // Send group message
    socket.on('send_message', async ({ senderId, groupId, text, tempId }) => {
      try {
        const newMessage = new Message({
          sender: senderId,
          groupId,
          message: text,
        });

        const savedMessage = await newMessage.save();
        const messageToSend = savedMessage.toObject();
        if (tempId) messageToSend.tempId = tempId;

        io.to(groupId.toString()).emit('receive_message', messageToSend);
      } catch (err) {
        console.error('Error saving group message:', err);
      }
    });

    // React to a message
    socket.on('react_message', async ({ messageId, userId, emoji }) => {
      try {
        if (!mongoose.Types.ObjectId.isValid(messageId)) {
          console.error('Invalid messageId for reaction:', messageId);
          return;
        }

        const message = await Message.findById(messageId);
        if (!message) return;

        // Remove previous reaction from the same user
        message.reactions = message.reactions.filter(
          (r) => r.userId.toString() !== userId.toString()
        );

        message.reactions.push({ userId, emoji });
        await message.save();
        await message.populate("reactions.userId", "name");

        // Broadcast updated message to the group
        io.to(message.groupId.toString()).emit('message_reacted', message);
      } catch (err) {
        console.error('Error reacting to message:', err);
      }
    });

    // Typing indicator
    socket.on('typing', ({ senderId, groupId }) => {
      io.to(groupId.toString()).emit('typing', { senderId });
    });

    // Handle disconnect
    socket.on('disconnect', () => {
      for (const [userId, socketId] of connectedUsers.entries()) {
        if (socketId === socket.id) {
          connectedUsers.delete(userId);
          console.log('User disconnected:', userId);
          broadcastOnlineUsers(io);
          break;
        }
      }
    });
  });
}

module.exports = setupSocket;
