import { ArrowLeft, MessageCircle, Send } from 'lucide-react';
import { useEffect, useRef, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import HirerLayout from '../../components/hirer/HirerLayout';
import { useSocket } from '../../context/SocketContext';
import api from '../../utils/api';

const ChatWithWorker = () => {
    const { workerId } = useParams();
    const navigate = useNavigate();
    const { socket, isConnected } = useSocket();
    const [worker, setWorker] = useState(null);
    const [messages, setMessages] = useState([]);
    const [newMessage, setNewMessage] = useState('');
    const [loading, setLoading] = useState(true);
    const [sending, setSending] = useState(false);
    const messagesEndRef = useRef(null);

    // Get current user info
    const getCurrentUser = () => {
        const userStr = localStorage.getItem('user');
        return userStr ? JSON.parse(userStr) : null;
    };

    // Create consistent chat ID
    const getChatId = () => {
        const currentUser = getCurrentUser();
        const currentUserId = currentUser?._id || currentUser?.id;
        const ids = [currentUserId, workerId].sort();
        return ids.join('_');
    };

    useEffect(() => {
        fetchWorkerInfo();
        loadChatHistory();
    }, [workerId]);

    // Socket.IO event listeners
    useEffect(() => {
        if (!socket) return;

        const chatId = getChatId();

        // Join the chat room
        socket.emit('join-chat', { chatId });

        // Listen for incoming messages
        socket.on('receive-message', (data) => {
            if (data.chatId === chatId) {
                setMessages((prev) => {
                    // Avoid duplicates
                    if (prev.some(m => m._id === data.message._id)) return prev;
                    return [...prev, data.message];
                });
                scrollToBottom();
            }
        });

        // Listen for message notifications (when not in chat room)
        socket.on('new-message-notification', (data) => {
            if (data.chatId === chatId) {
                setMessages((prev) => {
                    if (prev.some(m => m._id === data.message._id)) return prev;
                    return [...prev, data.message];
                });
                scrollToBottom();
            }
        });

        return () => {
            socket.off('receive-message');
            socket.off('new-message-notification');
        };
    }, [socket, workerId]);

    const fetchWorkerInfo = async () => {
        try {
            const response = await api.get(`/users/${workerId}`);
            if (response.data.success) {
                setWorker(response.data.data);
            }
        } catch (error) {
            console.error('Error fetching worker info:', error);
            // Don't block chat - just use default placeholder  
            setWorker({ fullName: 'Worker', _id: workerId });
        } finally {
            setLoading(false);
        }
    };

    const loadChatHistory = async () => {
        try {
            const currentUser = getCurrentUser();
            const currentUserId = currentUser?._id || currentUser?.id;
            
            const response = await api.get(`/messages/chat/${currentUserId}/${workerId}`);
            if (response.data.success) {
                setMessages(response.data.messages);
                scrollToBottom();
            }
        } catch (error) {
            console.error('Error loading chat history:', error);
        }
    };

    const scrollToBottom = () => {
        setTimeout(() => {
            messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
        }, 100);
    };

    const handleSendMessage = async (e) => {
        e.preventDefault();
        if (!newMessage.trim() || !socket) return;

        setSending(true);

        try {
            // Emit message via Socket.IO
            socket.emit('send-message', {
                receiverId: workerId,
                message: newMessage,
                senderType: 'hirer',
            });

            setNewMessage('');
            scrollToBottom();
        } catch (error) {
            console.error('Error sending message:', error);
        } finally {
            setSending(false);
        }
    };

    useEffect(() => {
        scrollToBottom();
    }, [messages]);

    if (loading) {
        return (
            <HirerLayout>
                <div className="min-h-screen bg-[#E0F0F3] flex items-center justify-center">
                    <div className="text-center">
                        <div className="animate-spin rounded-full h-16 w-16 border-b-2 border-[#0B4B54] mx-auto"></div>
                        <p className="mt-4 text-[#032A33]">Loading chat...</p>
                    </div>
                </div>
            </HirerLayout>
        );
    }

    return (
        <HirerLayout>
            <div className="min-h-screen bg-[#E0F0F3]">
                <div className="max-w-5xl mx-auto p-6">
                    {/* Header */}
                    <button
                        onClick={() => navigate(-1)}
                        className="flex items-center gap-2 text-[#0B4B54] hover:text-[#0D5A65] mb-6 transition-colors"
                    >
                        <ArrowLeft size={20} />
                        <span className="font-medium">Back</span>
                    </button>

                    {/* Chat Container */}
                    <div className="bg-white rounded-2xl shadow-sm border border-gray-200 overflow-hidden">
                        {/* Chat Header */}
                        <div className="bg-gradient-to-r from-[#0B4B54] to-[#0D5A65] p-6 text-white">
                            <div className="flex items-center gap-4">
                                <div className="w-14 h-14 rounded-full bg-white/20 flex items-center justify-center text-white font-bold text-xl backdrop-blur-sm">
                                    {worker?.fullName?.charAt(0).toUpperCase() || 'W'}
                                </div>
                                <div>
                                    <h2 className="text-2xl font-bold">{worker?.fullName || 'Worker'}</h2>
                                    <p className="text-white/80 text-sm flex items-center gap-2 mt-1">
                                        <span className={`w-2 h-2 ${isConnected ? 'bg-green-400' : 'bg-gray-400'} rounded-full ${isConnected ? 'animate-pulse' : ''}`}></span>
                                        {isConnected ? 'Connected' : 'Connecting...'}
                                    </p>
                                </div>
                            </div>
                        </div>

                        {/* Messages Area */}
                        <div className="h-[500px] overflow-y-auto p-6 bg-[#F4FBFA]">
                            {messages.length === 0 ? (
                                <div className="flex flex-col items-center justify-center h-full text-center">
                                    <MessageCircle size={64} className="text-[#82ACAB] mb-4" />
                                    <h3 className="text-xl font-semibold text-[#032A33] mb-2">
                                        Start a Conversation
                                    </h3>
                                    <p className="text-gray-600 max-w-md">
                                        Send a message to {worker?.fullName} to discuss the job details,
                                        confirm availability, or ask any questions.
                                    </p>
                                    <p className="text-xs text-gray-500 mt-3">
                                        💬 Real-time messaging powered by Socket.IO
                                    </p>
                                </div>
                            ) : (
                                <div className="space-y-4">
                                    {messages.map((message) => {
                                        const currentUser = getCurrentUser();
                                        const isOwnMessage = message.sender._id === currentUser?._id || message.sender._id === currentUser?.id;
                                        
                                        return (
                                            <div
                                                key={message._id}
                                                className={`flex ${isOwnMessage ? 'justify-end' : 'justify-start'}`}
                                            >
                                                <div
                                                    className={`max-w-[70%] rounded-2xl px-4 py-3 ${
                                                        isOwnMessage
                                                            ? 'bg-[#0B4B54] text-white rounded-br-sm'
                                                            : 'bg-white text-gray-800 rounded-bl-sm shadow-sm'
                                                    }`}
                                                >
                                                    <p className="text-sm leading-relaxed">{message.message}</p>
                                                    <p
                                                        className={`text-xs mt-2 ${
                                                            isOwnMessage ? 'text-white/70' : 'text-gray-500'
                                                        }`}
                                                    >
                                                        {new Date(message.createdAt).toLocaleTimeString([], {
                                                            hour: '2-digit',
                                                            minute: '2-digit',
                                                        })}
                                                    </p>
                                                </div>
                                            </div>
                                        );
                                    })}
                                    <div ref={messagesEndRef} />
                                </div>
                            )}
                        </div>

                        {/* Message Input */}
                        <div className="border-t border-gray-200 p-4 bg-white">
                            <form onSubmit={handleSendMessage} className="flex gap-3">
                                <input
                                    type="text"
                                    value={newMessage}
                                    onChange={(e) => setNewMessage(e.target.value)}
                                    placeholder="Type your message..."
                                    className="flex-1 px-4 py-3 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-[#0B4B54] focus:border-transparent"
                                    disabled={sending}
                                />
                                <button
                                    type="submit"
                                    disabled={sending || !newMessage.trim()}
                                    className="px-6 py-3 bg-[#0B4B54] text-white rounded-xl hover:bg-[#0D5A65] transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2 font-semibold"
                                >
                                    <Send size={18} />
                                    Send
                                </button>
                            </form>
                            <p className="text-xs text-gray-500 mt-3 text-center">
                                💡 Tip: Be professional and clear in your communication
                            </p>
                        </div>
                    </div>

                    {/* Quick Actions */}
                    <div className="mt-6 bg-white rounded-xl shadow-sm border border-gray-200 p-6">
                        <h3 className="text-lg font-semibold text-[#032A33] mb-4">Quick Actions</h3>
                        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                            <button className="px-4 py-3 bg-[#F4FBFA] text-[#0B4B54] rounded-lg hover:bg-[#D3E4E7] transition-colors text-left">
                                <p className="font-semibold">Share Job Location</p>
                                <p className="text-xs text-gray-600 mt-1">Send location details</p>
                            </button>
                            <button className="px-4 py-3 bg-[#F4FBFA] text-[#0B4B54] rounded-lg hover:bg-[#D3E4E7] transition-colors text-left">
                                <p className="font-semibold">Confirm Schedule</p>
                                <p className="text-xs text-gray-600 mt-1">Verify date & time</p>
                            </button>
                            <button className="px-4 py-3 bg-[#F4FBFA] text-[#0B4B54] rounded-lg hover:bg-[#D3E4E7] transition-colors text-left">
                                <p className="font-semibold">View Profile</p>
                                <p className="text-xs text-gray-600 mt-1">Check worker details</p>
                            </button>
                        </div>
                    </div>
                </div>
            </div>
        </HirerLayout>
    );
};

export default ChatWithWorker;
