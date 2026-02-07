import jwt from 'jsonwebtoken';
import { Server } from 'socket.io';
import Message from '../models/Message.js';

// Store active socket connections
const userSockets = new Map();

export const initializeSocket = (server) => {
  const io = new Server(server, {
    cors: {
      origin: [
        'http://localhost:5173',
        'http://localhost:5174',
        'http://localhost:5175',
        'http://localhost:3000',
        process.env.FRONTEND_URL,
      ].filter(Boolean),
      credentials: true,
    },
  });

  // Socket.IO authentication middleware
  io.use((socket, next) => {
    try {
      // Get token from cookies (using cookie-parser)
      const cookies = socket.handshake.headers.cookie;
      
      if (!cookies) {
        return next(new Error('Authentication error: No token provided'));
      }

      // Parse cookies manually to get token
      const tokenMatch = cookies.match(/token=([^;]+)/);
      const token = tokenMatch ? tokenMatch[1] : null;

      if (!token) {
        return next(new Error('Authentication error: No token in cookies'));
      }

      const decoded = jwt.verify(token, process.env.JWT_SECRET);
      socket.userId = decoded.id;
      next();
    } catch (error) {
      next(new Error('Authentication error: Invalid token'));
    }
  });

  io.on('connection', (socket) => {
    console.log(`User connected: ${socket.userId}`);
    
    // Store user's socket connection
    userSockets.set(socket.userId, socket.id);

    // Join user to their personal room
    socket.join(socket.userId);

    // Send online status to all connected users
    socket.broadcast.emit('user-online', { userId: socket.userId });

    // Handle joining a chat room
    socket.on('join-chat', ({ chatId }) => {
      socket.join(chatId);
      console.log(`User ${socket.userId} joined chat: ${chatId}`);
    });

    // Handle sending messages
    socket.on('send-message', async (data) => {
      try {
        const { receiverId, message, senderType } = data;
        const senderId = socket.userId;

        // Create consistent chatId
        const chatId = [senderId, receiverId].sort().join('_');

        // Save message to database
        const newMessage = await Message.create({
          chatId,
          sender: senderId,
          receiver: receiverId,
          senderType,
          message,
        });

        // Populate sender and receiver info
        const populatedMessage = await Message.findById(newMessage._id)
          .populate('sender', 'fullName email')
          .populate('receiver', 'fullName email');

        // Emit to chat room (both users joined this room)
        io.to(chatId).emit('receive-message', {
          message: populatedMessage,
          chatId,
        });

        // Also emit to receiver's personal room (in case they haven't joined the chat room yet)
        // Use socket.to() so the sender doesn't get a duplicate
        socket.to(receiverId).emit('new-message-notification', {
          message: populatedMessage,
          chatId,
        });

        console.log(`Message sent from ${senderId} to ${receiverId}`);
      } catch (error) {
        console.error('Error sending message:', error);
        socket.emit('message-error', { error: error.message });
      }
    });

    // Handle typing indicator
    socket.on('typing', ({ receiverId, isTyping }) => {
      socket.to(receiverId).emit('user-typing', {
        userId: socket.userId,
        isTyping,
      });
    });

    // Handle marking messages as read
    socket.on('mark-read', async ({ chatId }) => {
      try {
        await Message.updateMany(
          { chatId, receiver: socket.userId, isRead: false },
          { isRead: true }
        );

        // Notify the sender that messages were read
        const [userId1, userId2] = chatId.split('_');
        const otherUserId = userId1 === socket.userId ? userId2 : userId1;
        
        io.to(otherUserId).emit('messages-read', { chatId });
      } catch (error) {
        console.error('Error marking messages as read:', error);
      }
    });

    // Handle disconnection
    socket.on('disconnect', () => {
      console.log(`User disconnected: ${socket.userId}`);
      userSockets.delete(socket.userId);
      
      // Notify others that user is offline
      socket.broadcast.emit('user-offline', { userId: socket.userId });
    });
  });

  return io;
};

export const getIO = () => io;
