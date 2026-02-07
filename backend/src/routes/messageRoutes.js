import express from 'express';
import {
    getChatMessages,
    getUnreadCount,
    markMessagesAsRead,
    sendMessage,
} from '../controllers/messageController.js';
import { protect } from '../middlewares/authMiddleware.js';

const router = express.Router();

// All routes require authentication
router.use(protect);

// Get chat messages between two users
router.get('/chat/:userId1/:userId2', getChatMessages);

// Send a message
router.post('/send', sendMessage);

// Mark messages as read
router.put('/read/:chatId', markMessagesAsRead);

// Get unread message count
router.get('/unread-count', getUnreadCount);

export default router;
