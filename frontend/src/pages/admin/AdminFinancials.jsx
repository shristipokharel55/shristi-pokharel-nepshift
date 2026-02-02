import {
    ArrowDownLeft,
    ArrowUpRight as ArrowUp,
    ArrowUpRight,
    CreditCard,
    DollarSign,
    Download,
    TrendingDown,
    TrendingUp,
    Wallet
} from 'lucide-react';
import { useState } from 'react';
import Chart from 'react-apexcharts';

// Transaction Row Component
const TransactionRow = ({ transaction }) => {
    const isCredit = transaction.type === 'credit';

    return (
        <tr className="hover:bg-slate-50 transition-colors">
            <td className="px-6 py-4">
                <div className="flex items-center gap-3">
                    <div className={`w-10 h-10 rounded-xl flex items-center justify-center ${
                        isCredit ? 'bg-emerald-50' : 'bg-red-50'
                    }`}>
                        {isCredit ? (
                            <ArrowDownLeft size={18} className="text-emerald-500" />
                        ) : (
                            <ArrowUp size={18} className="text-red-500" />
                        )}
                    </div>
                    <div>
                        <p className="font-medium text-slate-800">{transaction.description}</p>
                        <p className="text-sm text-slate-500">{transaction.id}</p>
                    </div>
                </div>
            </td>
            <td className="px-6 py-4">
                <span className="text-sm text-slate-600">{transaction.user}</span>
            </td>
            <td className="px-6 py-4">
                <span className="text-sm text-slate-500">{transaction.date}</span>
            </td>
            <td className="px-6 py-4">
                <span className={`font-semibold ${isCredit ? 'text-emerald-600' : 'text-red-600'}`}>
                    {isCredit ? '+' : '-'}Rs {transaction.amount.toLocaleString()}
                </span>
            </td>
            <td className="px-6 py-4">
                <span className={`px-3 py-1 text-xs font-medium rounded-full ${
                    transaction.status === 'completed' 
                        ? 'bg-emerald-50 text-emerald-600' 
                        : transaction.status === 'pending'
                        ? 'bg-amber-50 text-amber-600'
                        : 'bg-red-50 text-red-600'
                }`}>
                    {transaction.status.charAt(0).toUpperCase() + transaction.status.slice(1)}
                </span>
            </td>
        </tr>
    );
};

const AdminFinancials = () => {
    const [dateRange, setDateRange] = useState('30days');

    // Revenue Chart Options
    const revenueChartOptions = {
        chart: {
            type: 'bar',
            toolbar: { show: false },
            fontFamily: "'Plus Jakarta Sans', sans-serif"
        },
        colors: ['#4A9287', '#94a3b8'],
        plotOptions: {
            bar: {
                borderRadius: 8,
                columnWidth: '60%',
                dataLabels: { position: 'top' }
            }
        },
        dataLabels: { enabled: false },
        xaxis: {
            categories: ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun'],
            axisBorder: { show: false },
            axisTicks: { show: false },
            labels: { style: { colors: '#94a3b8', fontSize: '12px' } }
        },
        yaxis: {
            labels: {
                style: { colors: '#94a3b8', fontSize: '12px' },
                formatter: (val) => `Rs ${val / 1000}k`
            }
        },
        grid: {
            borderColor: '#f1f5f9',
            strokeDashArray: 4
        },
        legend: {
            position: 'top',
            horizontalAlign: 'right',
            fontSize: '13px',
            fontWeight: 500,
            markers: { radius: 4 }
        },
        tooltip: {
            theme: 'light',
            y: { formatter: (val) => `Rs ${val.toLocaleString()}` }
        }
    };

    const revenueChartSeries = [
        { name: 'Revenue', data: [65000, 78000, 72000, 89000, 95000, 102000] },
        { name: 'Expenses', data: [45000, 52000, 48000, 55000, 58000, 62000] }
    ];

    // Mock transactions data
    const transactions = [
        { id: 'TXN001', description: 'Shift Payment - Kitchen Helper', user: 'Ram Thapa', date: 'Feb 2, 2026', amount: 2500, type: 'debit', status: 'completed' },
        { id: 'TXN002', description: 'Platform Fee', user: 'Sita Sharma (Hirer)', date: 'Feb 2, 2026', amount: 500, type: 'credit', status: 'completed' },
        { id: 'TXN003', description: 'Shift Payment - Waiter', user: 'Hari Gautam', date: 'Feb 1, 2026', amount: 3000, type: 'debit', status: 'completed' },
        { id: 'TXN004', description: 'Wallet Top-up', user: 'Maya Gurung', date: 'Feb 1, 2026', amount: 5000, type: 'credit', status: 'pending' },
        { id: 'TXN005', description: 'Shift Payment - Cleaner', user: 'Bijay Rai', date: 'Jan 31, 2026', amount: 1800, type: 'debit', status: 'completed' },
        { id: 'TXN006', description: 'Refund - Cancelled Shift', user: 'Anita Tamang', date: 'Jan 31, 2026', amount: 2000, type: 'debit', status: 'failed' },
    ];

    return (
        <div className="space-y-8" style={{ fontFamily: "'Plus Jakarta Sans', sans-serif" }}>
            {/* Page Header */}
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
                <div>
                    <h1 className="text-2xl lg:text-3xl font-bold text-slate-800">
                        Financial Overview
                    </h1>
                    <p className="text-slate-500 mt-1">
                        Monitor revenue, expenses, and transactions
                    </p>
                </div>
                <div className="flex items-center gap-3">
                    <select 
                        value={dateRange}
                        onChange={(e) => setDateRange(e.target.value)}
                        className="px-4 py-2.5 bg-white border border-slate-200 rounded-xl text-sm font-medium text-slate-700 focus:outline-none focus:ring-2 focus:ring-[#4A9287]/20"
                    >
                        <option value="7days">Last 7 days</option>
                        <option value="30days">Last 30 days</option>
                        <option value="90days">Last 90 days</option>
                        <option value="year">This Year</option>
                    </select>
                    <button className="px-5 py-2.5 bg-[#4A9287] text-white rounded-xl font-medium hover:bg-[#3d7a71] transition-colors flex items-center gap-2">
                        <Download size={18} />
                        Export Report
                    </button>
                </div>
            </div>

            {/* Stats Cards */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
                <div className="bg-white rounded-2xl p-6 shadow-sm border border-slate-100">
                    <div className="flex items-start justify-between mb-4">
                        <div className="w-12 h-12 bg-emerald-50 rounded-xl flex items-center justify-center">
                            <DollarSign size={24} className="text-emerald-500" />
                        </div>
                        <div className="flex items-center gap-1 text-emerald-500">
                            <TrendingUp size={16} />
                            <span className="text-sm font-medium">+23.1%</span>
                        </div>
                    </div>
                    <h3 className="text-3xl font-bold text-slate-800">Rs 1.02M</h3>
                    <p className="text-slate-500 mt-1">Total Revenue</p>
                </div>

                <div className="bg-white rounded-2xl p-6 shadow-sm border border-slate-100">
                    <div className="flex items-start justify-between mb-4">
                        <div className="w-12 h-12 bg-blue-50 rounded-xl flex items-center justify-center">
                            <CreditCard size={24} className="text-blue-500" />
                        </div>
                        <div className="flex items-center gap-1 text-emerald-500">
                            <TrendingUp size={16} />
                            <span className="text-sm font-medium">+12.5%</span>
                        </div>
                    </div>
                    <h3 className="text-3xl font-bold text-slate-800">Rs 320K</h3>
                    <p className="text-slate-500 mt-1">Platform Fees</p>
                </div>

                <div className="bg-white rounded-2xl p-6 shadow-sm border border-slate-100">
                    <div className="flex items-start justify-between mb-4">
                        <div className="w-12 h-12 bg-amber-50 rounded-xl flex items-center justify-center">
                            <Wallet size={24} className="text-amber-500" />
                        </div>
                        <div className="flex items-center gap-1 text-red-500">
                            <TrendingDown size={16} />
                            <span className="text-sm font-medium">-5.3%</span>
                        </div>
                    </div>
                    <h3 className="text-3xl font-bold text-slate-800">Rs 85K</h3>
                    <p className="text-slate-500 mt-1">Pending Payouts</p>
                </div>

                <div className="bg-white rounded-2xl p-6 shadow-sm border border-slate-100">
                    <div className="flex items-start justify-between mb-4">
                        <div className="w-12 h-12 bg-purple-50 rounded-xl flex items-center justify-center">
                            <ArrowUpRight size={24} className="text-purple-500" />
                        </div>
                        <div className="flex items-center gap-1 text-emerald-500">
                            <TrendingUp size={16} />
                            <span className="text-sm font-medium">+18.2%</span>
                        </div>
                    </div>
                    <h3 className="text-3xl font-bold text-slate-800">2,847</h3>
                    <p className="text-slate-500 mt-1">Transactions</p>
                </div>
            </div>

            {/* Revenue Chart */}
            <div className="bg-white rounded-2xl p-6 shadow-sm border border-slate-100">
                <div className="flex items-center justify-between mb-6">
                    <div>
                        <h3 className="text-lg font-semibold text-slate-800">Revenue vs Expenses</h3>
                        <p className="text-sm text-slate-500">Monthly comparison for 2026</p>
                    </div>
                </div>
                <Chart
                    options={revenueChartOptions}
                    series={revenueChartSeries}
                    type="bar"
                    height={350}
                />
            </div>

            {/* Recent Transactions */}
            <div className="bg-white rounded-2xl shadow-sm border border-slate-100">
                <div className="p-6 border-b border-slate-100 flex items-center justify-between">
                    <div>
                        <h3 className="text-lg font-semibold text-slate-800">Recent Transactions</h3>
                        <p className="text-sm text-slate-500">Latest financial activities</p>
                    </div>
                    <button className="text-sm font-medium text-[#4A9287] hover:text-[#3d7a71] flex items-center gap-1">
                        View All
                        <ArrowUpRight size={14} />
                    </button>
                </div>
                <div className="overflow-x-auto">
                    <table className="w-full">
                        <thead className="bg-slate-50">
                            <tr>
                                <th className="px-6 py-4 text-left text-xs font-semibold text-slate-500 uppercase tracking-wider">Transaction</th>
                                <th className="px-6 py-4 text-left text-xs font-semibold text-slate-500 uppercase tracking-wider">User</th>
                                <th className="px-6 py-4 text-left text-xs font-semibold text-slate-500 uppercase tracking-wider">Date</th>
                                <th className="px-6 py-4 text-left text-xs font-semibold text-slate-500 uppercase tracking-wider">Amount</th>
                                <th className="px-6 py-4 text-left text-xs font-semibold text-slate-500 uppercase tracking-wider">Status</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-slate-100">
                            {transactions.map((transaction) => (
                                <TransactionRow key={transaction.id} transaction={transaction} />
                            ))}
                        </tbody>
                    </table>
                </div>
            </div>
        </div>
    );
};

export default AdminFinancials;
