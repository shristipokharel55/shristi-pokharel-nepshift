import Message from '../models/Message.js';
import { asyncHandler } from '../utils/asyncHandler.js';

// Get chat history between two users
export const getChatMessages = asyncHandler(async (req, res) => {
  const { userId1, userId2 } = req.params;
  
  // Create consistent chatId by sorting user IDs
  const chatId = [userId1, userId2].sort().join('_');
  
  const messages = await Message.find({ chatId })
    .sort({ createdAt: 1 })
    .populate('sender', 'fullName email')
    .populate('receiver', 'fullName email')
    .lean();
  
  res.status(200).json({
    success: true,
    messages,
  });
});

// Send a message (also used by Socket.IO)
export const sendMessage = asyncHandler(async (req, res) => {
  const { receiverId, message, senderType } = req.body;
  const senderId = req.user._id;
  
  // Create consistent chatId
  const chatId = [senderId.toString(), receiverId].sort().join('_');
  
  const newMessage = await Message.create({
    chatId,
    sender: senderId,
    receiver: receiverId,
    senderType,
    message,
  });
  
  const populatedMessage = await Message.findById(newMessage._id)
    .populate('sender', 'fullName email')
    .populate('receiver', 'fullName email');
  
  res.status(201).json({
    success: true,
    message: populatedMessage,
  });
});

// Mark messages as read
export const markMessagesAsRead = asyncHandler(async (req, res) => {
  const { chatId } = req.params;
  const userId = req.user._id;
  
  await Message.updateMany(
    { chatId, receiver: userId, isRead: false },
    { isRead: true }
  );
  
  res.status(200).json({
    success: true,
    message: 'Messages marked as read',
  });
});

// Get unread message count
export const getUnreadCount = asyncHandler(async (req, res) => {
  const userId = req.user._id;
  
  const unreadCount = await Message.countDocuments({
    receiver: userId,
    isRead: false,
  });
  
  res.status(200).json({
    success: true,
    unreadCount,
  });
});
