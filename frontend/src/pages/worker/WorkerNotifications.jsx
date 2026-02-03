import {
    AlertCircle,
    Bell,
    Check,
    CheckCircle,
    Clock,
    Info,
    Loader2,
    Trash2,
    XCircle
} from 'lucide-react';
import { useEffect, useState } from 'react';
import { toast } from 'react-hot-toast';
import WorkerLayout from '../../components/worker/WorkerLayout';
import api from '../../utils/api';

const WorkerNotifications = () => {
    const [notifications, setNotifications] = useState([]);
    const [loading, setLoading] = useState(true);
    const [filter, setFilter] = useState('All');

    useEffect(() => {
        fetchNotifications();
    }, []);

    const fetchNotifications = async () => {
        try {
            setLoading(true);
            const res = await api.get('/notifications');
            if (res.data.success) {
                setNotifications(res.data.data || []);
            }
        } catch (error) {
            console.error('Error fetching notifications:', error);
            toast.error('Failed to load notifications');
        } finally {
            setLoading(false);
        }
    };

    const markAllAsRead = async () => {
        try {
            await api.put('/notifications/read-all');
            setNotifications(notifications.map(n => ({ ...n, read: true })));
            toast.success('All notifications marked as read');
        } catch (error) {
            toast.error('Failed to mark as read');
        }
    };

    const markAsRead = async (id) => {
        try {
            await api.put(`/notifications/${id}/read`);
            setNotifications(notifications.map(n =>
                n._id === id ? { ...n, read: true } : n
            ));
        } catch (error) {
            console.error('Error marking notification as read:', error);
        }
    };

    const deleteNotification = async (id) => {
        try {
            await api.delete(`/notifications/${id}`);
            setNotifications(notifications.filter(n => n._id !== id));
            toast.success('Notification deleted');
        } catch (error) {
            toast.error('Failed to delete notification');
        }
    };

    const getIcon = (type) => {
        switch (type) {
            case 'success': return CheckCircle;
            case 'error': return XCircle;
            case 'warning': return AlertCircle;
            case 'info':
            default: return Info;
        }
    };

    const getIconColor = (type) => {
        switch (type) {
            case 'success': return 'bg-emerald-100 text-emerald-600';
            case 'error': return 'bg-red-100 text-red-600';
            case 'warning': return 'bg-amber-100 text-amber-600';
            case 'info':
            default: return 'bg-blue-100 text-blue-600';
        }
    };

    const getTimeAgo = (dateString) => {
        const now = new Date();
        const date = new Date(dateString);
        const seconds = Math.floor((now - date) / 1000);

        if (seconds < 60) return 'Just now';
        if (seconds < 3600) return `${Math.floor(seconds / 60)}m ago`;
        if (seconds < 86400) return `${Math.floor(seconds / 3600)}h ago`;
        return `${Math.floor(seconds / 86400)}d ago`;
    };

    const filteredNotifications = notifications.filter(n => {
        if (filter === 'All') return true;
        return n.type === filter.toLowerCase();
    });

    if (loading) {
        return (
            <WorkerLayout>
                <div className="flex items-center justify-center h-64">
                    <Loader2 className="w-8 h-8 animate-spin text-[#0B4B54]" />
                </div>
            </WorkerLayout>
        );
    }

    return (
        <WorkerLayout>
            <div className="max-w-3xl mx-auto">
                <div className="flex items-center justify-between mb-8">
                    <div>
                        <h1 className="text-3xl font-bold text-[#032A33] mb-2">Notifications</h1>
                        <p className="text-[#888888]">Stay updated with your latest activities</p>
                    </div>
                    {notifications.some(n => !n.read) && (
                        <button
                            onClick={markAllAsRead}
                            className="text-[#0B4B54] hover:text-[#0D5A65] font-semibold text-sm flex items-center gap-2"
                        >
                            <Check size={18} />
                            Mark all as read
                        </button>
                    )}
                </div>

                {/* Notification Filters */}
                <div className="flex gap-2 mb-6 overflow-x-auto">
                    {['All', 'Info', 'Success', 'Warning', 'Error'].map((filterOption) => (
                        <button
                            key={filterOption}
                            onClick={() => setFilter(filterOption)}
                            className={`px-4 py-2 rounded-xl text-sm font-medium transition-all whitespace-nowrap ${filter === filterOption
                                    ? 'bg-[#0B4B54] text-white'
                                    : 'bg-[#D3E4E7]/50 text-[#032A33] hover:bg-[#82ACAB]/30'
                                }`}
                        >
                            {filterOption}
                        </button>
                    ))}
                </div>

                {/* Notifications List */}
                {filteredNotifications.length === 0 ? (
                    <div className="glass-card rounded-2xl p-12 text-center">
                        <Bell size={48} className="mx-auto text-[#82ACAB] mb-4" />
                        <h3 className="text-xl font-semibold text-[#032A33] mb-2">No notifications</h3>
                        <p className="text-[#888888]">
                            {filter === 'All'
                                ? "You're all caught up!"
                                : `No ${filter.toLowerCase()} notifications`}
                        </p>
                    </div>
                ) : (
                    <div className="space-y-3">
                        {filteredNotifications.map((notification, index) => {
                            const Icon = getIcon(notification.type);
                            return (
                                <div
                                    key={notification._id}
                                    onClick={() => !notification.read && markAsRead(notification._id)}
                                    className={`
                                        glass-card rounded-2xl p-5 animate-fade-in-up cursor-pointer
                                        hover:shadow-lg transition-all
                                        ${!notification.read ? 'border-l-4 border-[#0B4B54]' : ''}
                                    `}
                                    style={{ animationDelay: `${index * 50}ms` }}
                                >
                                    <div className="flex items-start gap-4">
                                        <div className={`w-12 h-12 rounded-xl flex items-center justify-center ${getIconColor(notification.type)}`}>
                                            <Icon size={22} />
                                        </div>
                                        <div className="flex-1">
                                            <div className="flex items-start justify-between">
                                                <div className="flex-1">
                                                    <div className="flex items-center gap-2">
                                                        <h4 className={`font-semibold ${notification.read ? 'text-[#032A33]' : 'text-[#0B4B54]'}`}>
                                                            {notification.title}
                                                        </h4>
                                                        {!notification.read && (
                                                            <span className="w-2 h-2 rounded-full bg-[#0B4B54]" />
                                                        )}
                                                    </div>
                                                    <p className="text-[#888888] text-sm mt-1">{notification.message}</p>
                                                </div>
                                                <button
                                                    onClick={(e) => {
                                                        e.stopPropagation();
                                                        deleteNotification(notification._id);
                                                    }}
                                                    className="p-2 rounded-lg hover:bg-red-50 text-[#888888] hover:text-red-500 transition-colors"
                                                >
                                                    <Trash2 size={16} />
                                                </button>
                                            </div>
                                            <div className="flex items-center gap-2 mt-3 text-xs text-[#888888]">
                                                <Clock size={12} />
                                                {getTimeAgo(notification.createdAt)}
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            );
                        })}
                    </div>
                )}
            </div>
        </WorkerLayout>
    );
};

export default WorkerNotifications;
