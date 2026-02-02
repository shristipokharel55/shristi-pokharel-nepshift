import {
    ArrowDownRight,
    ArrowUpRight,
    Calendar,
    Clock,
    CreditCard,
    DollarSign,
    Download,
    Eye,
    FileText,
    Filter,
    Lock,
    Plus,
    Search,
    Unlock,
    Wallet
} from 'lucide-react';
import { useState } from 'react';
import HirerLayout from '../../components/hirer/HirerLayout';

const HirerPayments = () => {
    const [activeTab, setActiveTab] = useState('overview');
    const [selectedPeriod, setSelectedPeriod] = useState('month');

    const tabs = [
        { id: 'overview', label: 'Overview', icon: Wallet },
        { id: 'escrow', label: 'Escrow', icon: Lock },
        { id: 'transactions', label: 'Transactions', icon: FileText },
    ];

    const stats = [
        {
            label: 'Wallet Balance',
            value: 'Rs 25,000',
            change: '+Rs 5,000',
            changeType: 'positive',
            icon: Wallet,
            color: 'emerald'
        },
        {
            label: 'In Escrow',
            value: 'Rs 8,500',
            subtext: '3 pending releases',
            icon: Lock,
            color: 'amber'
        },
        {
            label: 'Total Spent',
            value: 'Rs 45,200',
            change: '+12%',
            changeType: 'neutral',
            icon: DollarSign,
            color: 'blue'
        },
        {
            label: 'This Month',
            value: 'Rs 12,600',
            change: '+8%',
            changeType: 'positive',
            icon: Calendar,
            color: 'purple'
        },
    ];

    const escrowItems = [
        {
            id: 1,
            jobTitle: 'Kitchen Helper',
            worker: 'Hari Bahadur',
            workerAvatar: 'HB',
            amount: 3600,
            date: 'Jan 31, 2026',
            status: 'pending',
            dueIn: '2 days'
        },
        {
            id: 2,
            jobTitle: 'Event Staff',
            worker: 'Maya Tamang',
            workerAvatar: 'MT',
            amount: 3000,
            date: 'Feb 1, 2026',
            status: 'pending',
            dueIn: '3 days'
        },
        {
            id: 3,
            jobTitle: 'Warehouse Helper',
            worker: 'Ramesh Karki',
            workerAvatar: 'RK',
            amount: 1900,
            date: 'Feb 2, 2026',
            status: 'pending',
            dueIn: '4 days'
        },
    ];

    const transactions = [
        {
            id: 1,
            type: 'payment',
            description: 'Payment to Hari Bahadur',
            jobTitle: 'Kitchen Helper',
            amount: -3600,
            date: 'Jan 28, 2026',
            status: 'completed'
        },
        {
            id: 2,
            type: 'deposit',
            description: 'Wallet Top-up',
            amount: 10000,
            date: 'Jan 27, 2026',
            status: 'completed'
        },
        {
            id: 3,
            type: 'escrow',
            description: 'Escrow for Kitchen Helper',
            jobTitle: 'Kitchen Helper',
            amount: -3600,
            date: 'Jan 25, 2026',
            status: 'locked'
        },
        {
            id: 4,
            type: 'payment',
            description: 'Payment to Gita Gurung',
            jobTitle: 'Event Staff',
            amount: -1500,
            date: 'Jan 24, 2026',
            status: 'completed'
        },
        {
            id: 5,
            type: 'refund',
            description: 'Refund - Worker cancelled',
            jobTitle: 'Warehouse Helper',
            amount: 1000,
            date: 'Jan 22, 2026',
            status: 'completed'
        },
    ];

    const getTransactionIcon = (type) => {
        switch (type) {
            case 'payment': return ArrowUpRight;
            case 'deposit': return ArrowDownRight;
            case 'escrow': return Lock;
            case 'refund': return ArrowDownRight;
            default: return DollarSign;
        }
    };

    const getTransactionColor = (type, amount) => {
        if (type === 'escrow') return 'text-amber-500 bg-amber-50';
        if (amount > 0) return 'text-emerald-500 bg-emerald-50';
        return 'text-red-500 bg-red-50';
    };

    const getStatusBadge = (status) => {
        switch (status) {
            case 'completed': return 'bg-emerald-100 text-emerald-700';
            case 'pending': return 'bg-amber-100 text-amber-700';
            case 'locked': return 'bg-blue-100 text-blue-700';
            default: return 'bg-gray-100 text-gray-700';
        }
    };

    const renderOverview = () => (
        <div className="space-y-6">
            {/* Stats Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                {stats.map((stat, idx) => {
                    const Icon = stat.icon;
                    const colorClasses = {
                        emerald: 'bg-emerald-100 text-emerald-600',
                        amber: 'bg-amber-100 text-amber-600',
                        blue: 'bg-blue-100 text-blue-600',
                        purple: 'bg-purple-100 text-purple-600',
                    };
                    
                    return (
                        <div key={idx} className="bg-white rounded-xl border border-gray-100 p-6">
                            <div className="flex items-start justify-between mb-4">
                                <div className={`w-12 h-12 rounded-xl flex items-center justify-center ${colorClasses[stat.color]}`}>
                                    <Icon size={24} />
                                </div>
                                {stat.change && (
                                    <span className={`text-sm font-medium ${
                                        stat.changeType === 'positive' ? 'text-emerald-600' : 'text-gray-500'
                                    }`}>
                                        {stat.change}
                                    </span>
                                )}
                            </div>
                            <p className="text-2xl font-bold text-gray-800">{stat.value}</p>
                            <p className="text-sm text-gray-500">{stat.subtext || stat.label}</p>
                        </div>
                    );
                })}
            </div>

            {/* Quick Actions */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <button className="p-6 bg-gradient-to-r from-[#1F4E5F] to-[#2D6A7A] rounded-xl text-white text-left hover:shadow-lg transition-shadow">
                    <Plus size={24} className="mb-3" />
                    <h3 className="font-semibold text-lg">Add Funds</h3>
                    <p className="text-white/70 text-sm">Top up your wallet balance</p>
                </button>
                <button className="p-6 bg-white border border-gray-200 rounded-xl text-left hover:border-[#1F4E5F] hover:shadow-md transition-all">
                    <CreditCard size={24} className="mb-3 text-[#1F4E5F]" />
                    <h3 className="font-semibold text-lg text-gray-800">Payment Methods</h3>
                    <p className="text-gray-500 text-sm">Manage your cards & banks</p>
                </button>
                <button className="p-6 bg-white border border-gray-200 rounded-xl text-left hover:border-[#1F4E5F] hover:shadow-md transition-all">
                    <Download size={24} className="mb-3 text-[#1F4E5F]" />
                    <h3 className="font-semibold text-lg text-gray-800">Download Statement</h3>
                    <p className="text-gray-500 text-sm">Export transaction history</p>
                </button>
            </div>

            {/* Recent Transactions */}
            <div className="bg-white rounded-xl border border-gray-100">
                <div className="p-6 border-b border-gray-100 flex items-center justify-between">
                    <h3 className="font-semibold text-gray-800">Recent Transactions</h3>
                    <button 
                        onClick={() => setActiveTab('transactions')}
                        className="text-sm text-[#1F4E5F] font-medium hover:underline"
                    >
                        View All
                    </button>
                </div>
                <div className="divide-y divide-gray-50">
                    {transactions.slice(0, 4).map((tx) => {
                        const Icon = getTransactionIcon(tx.type);
                        const colorClass = getTransactionColor(tx.type, tx.amount);
                        
                        return (
                            <div key={tx.id} className="p-4 flex items-center justify-between hover:bg-gray-50">
                                <div className="flex items-center gap-4">
                                    <div className={`w-10 h-10 rounded-lg flex items-center justify-center ${colorClass}`}>
                                        <Icon size={18} />
                                    </div>
                                    <div>
                                        <p className="font-medium text-gray-800">{tx.description}</p>
                                        <p className="text-sm text-gray-500">{tx.date}</p>
                                    </div>
                                </div>
                                <div className="text-right">
                                    <p className={`font-semibold ${tx.amount > 0 ? 'text-emerald-600' : 'text-gray-800'}`}>
                                        {tx.amount > 0 ? '+' : ''}Rs {Math.abs(tx.amount).toLocaleString()}
                                    </p>
                                    <span className={`text-xs px-2 py-0.5 rounded-lg ${getStatusBadge(tx.status)}`}>
                                        {tx.status}
                                    </span>
                                </div>
                            </div>
                        );
                    })}
                </div>
            </div>
        </div>
    );

    const renderEscrow = () => (
        <div className="space-y-6">
            {/* Escrow Summary */}
            <div className="bg-gradient-to-r from-amber-50 to-orange-50 rounded-xl p-6 border border-amber-200">
                <div className="flex items-start justify-between">
                    <div>
                        <div className="flex items-center gap-2 mb-2">
                            <Lock size={20} className="text-amber-600" />
                            <h3 className="font-semibold text-gray-800">Escrow Balance</h3>
                        </div>
                        <p className="text-3xl font-bold text-gray-800">Rs 8,500</p>
                        <p className="text-sm text-gray-600 mt-1">Funds held for 3 active jobs</p>
                    </div>
                    <div className="text-right">
                        <p className="text-sm text-gray-500 mb-1">Auto-release in</p>
                        <p className="text-lg font-semibold text-amber-600">48 hours</p>
                    </div>
                </div>
            </div>

            {/* Info Box */}
            <div className="bg-blue-50 border border-blue-200 rounded-xl p-4 flex items-start gap-3">
                <div className="w-8 h-8 rounded-lg bg-blue-100 flex items-center justify-center shrink-0">
                    <Clock size={16} className="text-blue-600" />
                </div>
                <div>
                    <h4 className="font-semibold text-blue-800">How Escrow Works</h4>
                    <p className="text-sm text-blue-700 mt-1">
                        When you hire a worker, the payment is held in escrow. Once the job is completed and you confirm satisfaction, funds are released to the worker. This protects both parties.
                    </p>
                </div>
            </div>

            {/* Escrow Items */}
            <div className="bg-white rounded-xl border border-gray-100">
                <div className="p-6 border-b border-gray-100">
                    <h3 className="font-semibold text-gray-800">Pending Releases</h3>
                </div>
                <div className="divide-y divide-gray-50">
                    {escrowItems.map((item) => (
                        <div key={item.id} className="p-6 flex flex-col md:flex-row md:items-center justify-between gap-4">
                            <div className="flex items-center gap-4">
                                <div className="w-12 h-12 rounded-xl bg-[#1F4E5F] text-white flex items-center justify-center font-medium">
                                    {item.workerAvatar}
                                </div>
                                <div>
                                    <h4 className="font-semibold text-gray-800">{item.jobTitle}</h4>
                                    <p className="text-sm text-gray-500">{item.worker}</p>
                                    <p className="text-xs text-gray-400 mt-1">Scheduled: {item.date}</p>
                                </div>
                            </div>
                            <div className="flex items-center gap-4">
                                <div className="text-right">
                                    <p className="font-bold text-gray-800">Rs {item.amount.toLocaleString()}</p>
                                    <p className="text-xs text-amber-600">Auto-release in {item.dueIn}</p>
                                </div>
                                <div className="flex gap-2">
                                    <button className="px-4 py-2 bg-emerald-500 text-white text-sm font-medium rounded-lg hover:bg-emerald-600 transition-colors flex items-center gap-2">
                                        <Unlock size={16} />
                                        Release Now
                                    </button>
                                    <button className="px-4 py-2 border border-gray-200 text-gray-600 text-sm font-medium rounded-lg hover:bg-gray-50 transition-colors">
                                        Dispute
                                    </button>
                                </div>
                            </div>
                        </div>
                    ))}
                </div>
            </div>
        </div>
    );

    const renderTransactions = () => (
        <div className="space-y-6">
            {/* Filters */}
            <div className="flex flex-wrap gap-4 items-center justify-between">
                <div className="flex gap-2">
                    {['All', 'Payments', 'Deposits', 'Refunds'].map((filter) => (
                        <button
                            key={filter}
                            className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
                                filter === 'All' 
                                    ? 'bg-[#1F4E5F] text-white' 
                                    : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                            }`}
                        >
                            {filter}
                        </button>
                    ))}
                </div>
                <div className="flex items-center gap-3">
                    <div className="relative">
                        <Search size={18} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
                        <input
                            type="text"
                            placeholder="Search transactions..."
                            className="pl-10 pr-4 py-2 rounded-lg border border-gray-200 text-sm focus:outline-none focus:border-[#1F4E5F] focus:ring-2 focus:ring-[#1F4E5F]/10"
                        />
                    </div>
                    <button className="p-2 border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors">
                        <Filter size={18} className="text-gray-500" />
                    </button>
                    <button className="p-2 border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors">
                        <Download size={18} className="text-gray-500" />
                    </button>
                </div>
            </div>

            {/* Transactions List */}
            <div className="bg-white rounded-xl border border-gray-100">
                <table className="w-full">
                    <thead>
                        <tr className="border-b border-gray-100">
                            <th className="text-left p-4 font-medium text-gray-500 text-sm">Transaction</th>
                            <th className="text-left p-4 font-medium text-gray-500 text-sm">Date</th>
                            <th className="text-left p-4 font-medium text-gray-500 text-sm">Status</th>
                            <th className="text-right p-4 font-medium text-gray-500 text-sm">Amount</th>
                            <th className="text-right p-4 font-medium text-gray-500 text-sm">Actions</th>
                        </tr>
                    </thead>
                    <tbody>
                        {transactions.map((tx) => {
                            const Icon = getTransactionIcon(tx.type);
                            const colorClass = getTransactionColor(tx.type, tx.amount);
                            
                            return (
                                <tr key={tx.id} className="border-b border-gray-50 hover:bg-gray-50">
                                    <td className="p-4">
                                        <div className="flex items-center gap-3">
                                            <div className={`w-10 h-10 rounded-lg flex items-center justify-center ${colorClass}`}>
                                                <Icon size={18} />
                                            </div>
                                            <div>
                                                <p className="font-medium text-gray-800">{tx.description}</p>
                                                {tx.jobTitle && (
                                                    <p className="text-sm text-gray-500">{tx.jobTitle}</p>
                                                )}
                                            </div>
                                        </div>
                                    </td>
                                    <td className="p-4 text-sm text-gray-600">{tx.date}</td>
                                    <td className="p-4">
                                        <span className={`px-2.5 py-1 rounded-lg text-xs font-semibold capitalize ${getStatusBadge(tx.status)}`}>
                                            {tx.status}
                                        </span>
                                    </td>
                                    <td className="p-4 text-right">
                                        <span className={`font-semibold ${tx.amount > 0 ? 'text-emerald-600' : 'text-gray-800'}`}>
                                            {tx.amount > 0 ? '+' : ''}Rs {Math.abs(tx.amount).toLocaleString()}
                                        </span>
                                    </td>
                                    <td className="p-4 text-right">
                                        <button className="p-2 hover:bg-gray-100 rounded-lg transition-colors">
                                            <Eye size={16} className="text-gray-400" />
                                        </button>
                                    </td>
                                </tr>
                            );
                        })}
                    </tbody>
                </table>
            </div>
        </div>
    );

    return (
        <HirerLayout>
            <div className="max-w-6xl mx-auto">
                {/* Header */}
                <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-8">
                    <div>
                        <h1 className="text-2xl font-bold text-gray-800">Payments</h1>
                        <p className="text-gray-500">Manage your wallet, escrow, and transactions</p>
                    </div>
                    <button className="px-5 py-2.5 bg-gradient-to-r from-[#1F4E5F] to-[#2D6A7A] text-white font-semibold rounded-xl hover:shadow-lg transition-shadow flex items-center gap-2">
                        <Plus size={18} />
                        Add Funds
                    </button>
                </div>

                {/* Tabs */}
                <div className="flex gap-2 p-1 bg-gray-100 rounded-xl w-fit mb-6">
                    {tabs.map((tab) => {
                        const Icon = tab.icon;
                        return (
                            <button
                                key={tab.id}
                                onClick={() => setActiveTab(tab.id)}
                                className={`
                                    flex items-center gap-2 px-4 py-2 rounded-lg font-medium text-sm transition-all
                                    ${activeTab === tab.id
                                        ? 'bg-white text-[#1F4E5F] shadow-sm'
                                        : 'text-gray-600 hover:text-gray-800'
                                    }
                                `}
                            >
                                <Icon size={16} />
                                {tab.label}
                            </button>
                        );
                    })}
                </div>

                {/* Content */}
                {activeTab === 'overview' && renderOverview()}
                {activeTab === 'escrow' && renderEscrow()}
                {activeTab === 'transactions' && renderTransactions()}
            </div>
        </HirerLayout>
    );
};

export default HirerPayments;
