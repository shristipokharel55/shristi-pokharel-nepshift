import React from 'react';
import {
    DollarSign,
    TrendingUp,
    Calendar,
    Download,
    ArrowUpRight,
    ArrowDownRight,
    CreditCard,
    Wallet
} from 'lucide-react';
import WorkerLayout from '../../components/worker/WorkerLayout';

const WorkerEarnings = () => {
    const transactions = [
        { id: 1, title: 'Kitchen Helper - Hotel Himalaya', amount: 1200, type: 'credit', date: 'Jan 26, 2026', status: 'completed' },
        { id: 2, title: 'Event Staff - Marriott Hotel', amount: 1500, type: 'credit', date: 'Jan 24, 2026', status: 'completed' },
        { id: 3, title: 'Withdrawal to Bank', amount: 5000, type: 'debit', date: 'Jan 23, 2026', status: 'completed' },
        { id: 4, title: 'Warehouse Helper - Daraz Nepal', amount: 1000, type: 'credit', date: 'Jan 22, 2026', status: 'completed' },
        { id: 5, title: 'Restaurant Server - Cafe Mitra', amount: 1100, type: 'credit', date: 'Jan 20, 2026', status: 'pending' },
    ];

    return (
        <WorkerLayout>
            <div className="max-w-5xl mx-auto">
                <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-8">
                    <div>
                        <h1 className="text-3xl font-bold text-[#032A33] mb-2">Earnings & Payments</h1>
                        <p className="text-[#888888]">Track your earnings and payment history</p>
                    </div>
                    <button className="px-6 py-3 rounded-xl bg-[#0B4B54] text-white font-semibold hover:bg-[#0D5A65] transition-colors flex items-center gap-2 shadow-lg shadow-[#0B4B54]/20">
                        <Download size={18} />
                        Download Report
                    </button>
                </div>

                {/* Stats Cards */}
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
                    <div className="glass-card rounded-2xl p-6 animate-fade-in-up">
                        <div className="flex items-center justify-between mb-4">
                            <div className="w-12 h-12 rounded-xl bg-emerald-100 flex items-center justify-center">
                                <Wallet size={24} className="text-emerald-600" />
                            </div>
                            <span className="flex items-center gap-1 text-emerald-600 text-sm font-semibold">
                                <TrendingUp size={16} />
                                +12%
                            </span>
                        </div>
                        <p className="text-3xl font-bold text-[#032A33] mb-1">Rs 45,600</p>
                        <p className="text-[#888888]">Total Earnings</p>
                    </div>

                    <div className="glass-card rounded-2xl p-6 animate-fade-in-up" style={{ animationDelay: '100ms' }}>
                        <div className="flex items-center justify-between mb-4">
                            <div className="w-12 h-12 rounded-xl bg-blue-100 flex items-center justify-center">
                                <DollarSign size={24} className="text-blue-600" />
                            </div>
                        </div>
                        <p className="text-3xl font-bold text-[#032A33] mb-1">Rs 8,400</p>
                        <p className="text-[#888888]">This Month</p>
                    </div>

                    <div className="glass-card rounded-2xl p-6 animate-fade-in-up" style={{ animationDelay: '200ms' }}>
                        <div className="flex items-center justify-between mb-4">
                            <div className="w-12 h-12 rounded-xl bg-[#0B4B54]/10 flex items-center justify-center">
                                <CreditCard size={24} className="text-[#0B4B54]" />
                            </div>
                        </div>
                        <p className="text-3xl font-bold text-[#032A33] mb-1">Rs 3,800</p>
                        <p className="text-[#888888]">Pending Payout</p>
                    </div>
                </div>

                {/* Transactions */}
                <div className="glass-card rounded-2xl p-6 animate-fade-in-up" style={{ animationDelay: '300ms' }}>
                    <div className="flex items-center justify-between mb-6">
                        <h3 className="font-semibold text-[#032A33] text-lg">Recent Transactions</h3>
                        <select className="px-4 py-2 rounded-xl bg-[#D3E4E7]/50 text-[#032A33] text-sm border-0 focus:ring-2 focus:ring-[#0B4B54]/20">
                            <option>This Month</option>
                            <option>Last Month</option>
                            <option>Last 3 Months</option>
                        </select>
                    </div>

                    <div className="space-y-4">
                        {transactions.map((tx, index) => (
                            <div
                                key={tx.id}
                                className="flex items-center justify-between p-4 rounded-xl hover:bg-[#D3E4E7]/30 transition-colors"
                            >
                                <div className="flex items-center gap-4">
                                    <div className={`w-10 h-10 rounded-xl flex items-center justify-center ${tx.type === 'credit' ? 'bg-emerald-100' : 'bg-red-100'
                                        }`}>
                                        {tx.type === 'credit' ? (
                                            <ArrowDownRight size={20} className="text-emerald-600" />
                                        ) : (
                                            <ArrowUpRight size={20} className="text-red-500" />
                                        )}
                                    </div>
                                    <div>
                                        <p className="font-medium text-[#032A33]">{tx.title}</p>
                                        <p className="text-sm text-[#888888]">{tx.date}</p>
                                    </div>
                                </div>
                                <div className="text-right">
                                    <p className={`font-bold ${tx.type === 'credit' ? 'text-emerald-600' : 'text-red-500'}`}>
                                        {tx.type === 'credit' ? '+' : '-'} Rs {tx.amount.toLocaleString()}
                                    </p>
                                    <span className={`text-xs px-2 py-0.5 rounded-full ${tx.status === 'completed' ? 'bg-emerald-100 text-emerald-700' : 'bg-yellow-100 text-yellow-700'
                                        }`}>
                                        {tx.status}
                                    </span>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            </div>
        </WorkerLayout>
    );
};

export default WorkerEarnings;
