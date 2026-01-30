import React from 'react';
import {
    Bell,
    Briefcase,
    DollarSign,
    MessageCircle,
    Star,
    Check,
    Trash2,
    Clock
} from 'lucide-react';
import WorkerLayout from '../../components/worker/WorkerLayout';

const WorkerNotifications = () => {
    const notifications = [
        {
            id: 1,
            type: 'job',
            title: 'New Job Match!',
            message: 'A new Kitchen Helper position at Hotel Himalaya matches your profile.',
            time: '5 minutes ago',
            read: false
        },
        {
            id: 2,
            type: 'payment',
            title: 'Payment Received',
            message: 'You received Rs 1,200 for Event Staff shift at Marriott Hotel.',
            time: '2 hours ago',
            read: false
        },
        {
            id: 3,
            type: 'review',
            title: 'New Review',
            message: 'Hotel Himalaya left you a 5-star review. Check it out!',
            time: '1 day ago',
            read: true
        },
        {
            id: 4,
            type: 'message',
            title: 'Message from Employer',
            message: 'Hyatt Regency sent you a message about upcoming shift.',
            time: '2 days ago',
            read: true
        },
        {
            id: 5,
            type: 'job',
            title: 'Application Accepted',
            message: 'Your application for Warehouse Helper at Daraz Nepal has been accepted.',
            time: '3 days ago',
            read: true
        },
    ];

    const getIcon = (type) => {
        switch (type) {
            case 'job': return Briefcase;
            case 'payment': return DollarSign;
            case 'review': return Star;
            case 'message': return MessageCircle;
            default: return Bell;
        }
    };

    const getIconColor = (type) => {
        switch (type) {
            case 'job': return 'bg-blue-100 text-blue-600';
            case 'payment': return 'bg-emerald-100 text-emerald-600';
            case 'review': return 'bg-yellow-100 text-yellow-600';
            case 'message': return 'bg-purple-100 text-purple-600';
            default: return 'bg-gray-100 text-gray-600';
        }
    };

    return (
        <WorkerLayout>
            <div className="max-w-3xl mx-auto">
                <div className="flex items-center justify-between mb-8">
                    <div>
                        <h1 className="text-3xl font-bold text-[#032A33] mb-2">Notifications</h1>
                        <p className="text-[#888888]">Stay updated with your latest activities</p>
                    </div>
                    <button className="text-[#0B4B54] hover:text-[#0D5A65] font-semibold text-sm flex items-center gap-2">
                        <Check size={18} />
                        Mark all as read
                    </button>
                </div>

                {/* Notification Filters */}
                <div className="flex gap-2 mb-6">
                    {['All', 'Jobs', 'Payments', 'Reviews', 'Messages'].map((filter) => (
                        <button
                            key={filter}
                            className={`px-4 py-2 rounded-xl text-sm font-medium transition-all ${filter === 'All'
                                    ? 'bg-[#0B4B54] text-white'
                                    : 'bg-[#D3E4E7]/50 text-[#032A33] hover:bg-[#82ACAB]/30'
                                }`}
                        >
                            {filter}
                        </button>
                    ))}
                </div>

                {/* Notifications List */}
                <div className="space-y-3">
                    {notifications.map((notification, index) => {
                        const Icon = getIcon(notification.type);
                        return (
                            <div
                                key={notification.id}
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
                                            <div>
                                                <h4 className={`font-semibold ${notification.read ? 'text-[#032A33]' : 'text-[#0B4B54]'}`}>
                                                    {notification.title}
                                                </h4>
                                                <p className="text-[#888888] text-sm mt-1">{notification.message}</p>
                                            </div>
                                            <button className="p-2 rounded-lg hover:bg-red-50 text-[#888888] hover:text-red-500 transition-colors">
                                                <Trash2 size={16} />
                                            </button>
                                        </div>
                                        <div className="flex items-center gap-2 mt-3 text-xs text-[#888888]">
                                            <Clock size={12} />
                                            {notification.time}
                                        </div>
                                    </div>
                                </div>
                            </div>
                        );
                    })}
                </div>
            </div>
        </WorkerLayout>
    );
};

export default WorkerNotifications;
