import {
    ArrowDownLeft,
    ArrowUpRight,
    CreditCard,
    Download,
    TrendingDown,
    TrendingUp,
    Wallet,
} from 'lucide-react';
import { useEffect, useState } from 'react';
import { toast } from 'react-hot-toast';
import { Bar, BarChart, CartesianGrid, XAxis, YAxis } from 'recharts';
import RupeeIcon from '../../components/ui/RupeeIcon';

import { Badge } from '@/components/ui/badge';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import {
    ChartContainer,
    ChartLegend,
    ChartLegendContent,
    ChartTooltip,
    ChartTooltipContent,
} from '@/components/ui/chart';
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from '@/components/ui/select';
import { Skeleton } from '@/components/ui/skeleton';
import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from '@/components/ui/table';
import api from '../../utils/api';

const chartConfig = {
    revenue: { label: 'Revenue (रु)', color: '#4A9287' },
    transactions: { label: 'Transactions', color: '#94a3b8' },
};

const formatAmount = (val) => {
    if (val >= 1_000_000) return `रु ${(val / 1_000_000).toFixed(2)}M`;
    if (val >= 1_000) return `रु ${(val / 1_000).toFixed(0)}K`;
    return `रु ${val.toLocaleString()}`;
};

const statusVariant = (status) => {
    if (status === 'completed') return 'default';
    if (status === 'pending') return 'secondary';
    return 'destructive';
};

const StatCardSkeleton = () => (
    <Card>
        <CardHeader className="pb-2">
            <Skeleton className="h-4 w-24" />
        </CardHeader>
        <CardContent>
            <Skeleton className="h-8 w-32 mb-1" />
            <Skeleton className="h-3 w-20" />
        </CardContent>
    </Card>
);

const TableSkeleton = () => (
    <div className="space-y-3 p-6">
        {Array.from({ length: 5 }).map((_, i) => (
            <Skeleton key={i} className="h-12 w-full rounded-lg" />
        ))}
    </div>
);

const AdminFinancials = () => {
    const [dateRange, setDateRange] = useState('30days');
    const [loading, setLoading] = useState(true);
    const [stats, setStats] = useState({
        totalRevenue: 0,
        totalTransactions: 0,
        pendingPayouts: 0,
        pendingCount: 0,
    });
    const [chartData, setChartData] = useState([]);
    const [transactions, setTransactions] = useState([]);

    useEffect(() => {
        fetchOverview();
    }, [dateRange]);

    const fetchOverview = async () => {
        try {
            setLoading(true);
            const res = await api.get(`/payments/admin/overview?range=${dateRange}`);
            if (res.data.success) {
                const {
                    totalRevenue,
                    totalTransactions,
                    pendingPayouts,
                    pendingCount,
                    monthly,
                    monthLabels,
                    recent,
                } = res.data.data;

                setStats({ totalRevenue, totalTransactions, pendingPayouts, pendingCount });

                const merged = (monthLabels || []).map((label, i) => ({
                    month: label,
                    revenue: monthly?.[i]?.revenue ?? 0,
                    transactions: monthly?.[i]?.transactions ?? 0,
                }));
                setChartData(merged);
                setTransactions(recent || []);
            }
        } catch (err) {
            console.error(err);
            toast.error('Failed to load financial data');
        } finally {
            setLoading(false);
        }
    };

    const hasChartData = chartData.some((d) => d.revenue > 0 || d.transactions > 0);

    return (
        <div className="space-y-8" style={{ fontFamily: "'Plus Jakarta Sans', sans-serif" }}>
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
                <div>
                    <h1 className="text-2xl lg:text-3xl font-bold text-slate-800">Financial Overview</h1>
                    <p className="text-slate-500 mt-1 text-sm">Monitor revenue, expenses, and transactions</p>
                </div>
                <div className="flex items-center gap-3">
                    <Select value={dateRange} onValueChange={setDateRange}>
                        <SelectTrigger className="w-40">
                            <SelectValue placeholder="Select range" />
                        </SelectTrigger>
                        <SelectContent>
                            <SelectItem value="7days">Last 7 days</SelectItem>
                            <SelectItem value="30days">Last 30 days</SelectItem>
                            <SelectItem value="90days">Last 90 days</SelectItem>
                            <SelectItem value="year">This Year</SelectItem>
                        </SelectContent>
                    </Select>
                    <button className="px-5 py-2.5 bg-[#4A9287] text-white rounded-xl font-medium hover:bg-[#3d7a71] transition-colors flex items-center gap-2 text-sm">
                        <Download size={16} />
                        Export
                    </button>
                </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
                {loading ? (
                    Array.from({ length: 4 }).map((_, i) => <StatCardSkeleton key={i} />)
                ) : (
                    <>
                        <Card>
                            <CardHeader className="flex flex-row items-center justify-between pb-2">
                                <CardTitle className="text-sm font-medium text-slate-500">Total Revenue</CardTitle>
                                <div className="w-10 h-10 bg-emerald-50 rounded-xl flex items-center justify-center">
                                    <RupeeIcon size={20} className="text-emerald-500" />
                                </div>
                            </CardHeader>
                            <CardContent>
                                <p className="text-2xl font-bold text-slate-800">{formatAmount(stats.totalRevenue)}</p>
                                <div className="flex items-center gap-1 mt-1 text-emerald-500">
                                    <TrendingUp size={14} />
                                    <span className="text-xs font-medium">eSewa payments</span>
                                </div>
                            </CardContent>
                        </Card>

                        <Card>
                            <CardHeader className="flex flex-row items-center justify-between pb-2">
                                <CardTitle className="text-sm font-medium text-slate-500">Completed Payments</CardTitle>
                                <div className="w-10 h-10 bg-blue-50 rounded-xl flex items-center justify-center">
                                    <CreditCard size={20} className="text-blue-500" />
                                </div>
                            </CardHeader>
                            <CardContent>
                                <p className="text-2xl font-bold text-slate-800">{stats.totalTransactions}</p>
                                <div className="flex items-center gap-1 mt-1 text-emerald-500">
                                    <TrendingUp size={14} />
                                    <span className="text-xs font-medium">Verified via eSewa</span>
                                </div>
                            </CardContent>
                        </Card>

                        <Card>
                            <CardHeader className="flex flex-row items-center justify-between pb-2">
                                <CardTitle className="text-sm font-medium text-slate-500">Pending Payouts</CardTitle>
                                <div className="w-10 h-10 bg-amber-50 rounded-xl flex items-center justify-center">
                                    <Wallet size={20} className="text-amber-500" />
                                </div>
                            </CardHeader>
                            <CardContent>
                                <p className="text-2xl font-bold text-slate-800">{formatAmount(stats.pendingPayouts)}</p>
                                {stats.pendingCount > 0 ? (
                                    <div className="flex items-center gap-1 mt-1 text-red-500">
                                        <TrendingDown size={14} />
                                        <span className="text-xs font-medium">{stats.pendingCount} pending</span>
                                    </div>
                                ) : (
                                    <span className="text-xs font-medium text-emerald-500 mt-1 block">All clear</span>
                                )}
                            </CardContent>
                        </Card>

                        <Card>
                            <CardHeader className="flex flex-row items-center justify-between pb-2">
                                <CardTitle className="text-sm font-medium text-slate-500">Total Transactions</CardTitle>
                                <div className="w-10 h-10 bg-purple-50 rounded-xl flex items-center justify-center">
                                    <ArrowUpRight size={20} className="text-purple-500" />
                                </div>
                            </CardHeader>
                            <CardContent>
                                <p className="text-2xl font-bold text-slate-800">
                                    {stats.totalTransactions + stats.pendingCount}
                                </p>
                                <span className="text-xs text-slate-400 mt-1 block">All time</span>
                            </CardContent>
                        </Card>
                    </>
                )}
            </div>

            <Card>
                <CardHeader>
                    <CardTitle>Monthly Revenue</CardTitle>
                    <CardDescription>eSewa payment volume - last 6 months</CardDescription>
                </CardHeader>
                <CardContent>
                    {loading ? (
                        <Skeleton className="h-64 w-full rounded-xl" />
                    ) : !hasChartData ? (
                        <div className="flex items-center justify-center h-64 text-slate-400 text-sm">
                            No payment data for this period
                        </div>
                    ) : (
                        <ChartContainer config={chartConfig} className="h-64 w-full">
                            <BarChart data={chartData} margin={{ top: 4, right: 8, left: 8, bottom: 4 }}>
                                <CartesianGrid vertical={false} strokeDasharray="3 3" stroke="#f1f5f9" />
                                <XAxis
                                    dataKey="month"
                                    tickLine={false}
                                    axisLine={false}
                                    tick={{ fontSize: 12, fill: '#94a3b8' }}
                                />
                                <YAxis
                                    tickLine={false}
                                    axisLine={false}
                                    tick={{ fontSize: 12, fill: '#94a3b8' }}
                                    tickFormatter={(v) => (v >= 1000 ? `${(v / 1000).toFixed(0)}k` : v)}
                                />
                                <ChartTooltip
                                    cursor={{ fill: 'rgba(0,0,0,0.04)' }}
                                    content={
                                        <ChartTooltipContent
                                            formatter={(value, name) =>
                                                name === 'revenue'
                                                    ? [`रु ${value.toLocaleString()}`, 'Revenue']
                                                    : [value, 'Transactions']
                                            }
                                        />
                                    }
                                />
                                <ChartLegend content={<ChartLegendContent />} />
                                <Bar dataKey="revenue" fill="var(--color-revenue)" radius={[6, 6, 0, 0]} />
                                <Bar dataKey="transactions" fill="var(--color-transactions)" radius={[6, 6, 0, 0]} />
                            </BarChart>
                        </ChartContainer>
                    )}
                </CardContent>
            </Card>

            <Card>
                <CardHeader>
                    <CardTitle>Recent Transactions</CardTitle>
                    <CardDescription>Latest eSewa payment activities</CardDescription>
                </CardHeader>
                <CardContent className="p-0">
                    {loading ? (
                        <TableSkeleton />
                    ) : transactions.length === 0 ? (
                        <div className="flex items-center justify-center py-16 text-slate-400 text-sm">
                            No transactions found for this period
                        </div>
                    ) : (
                        <Table>
                            <TableHeader>
                                <TableRow>
                                    <TableHead>Transaction</TableHead>
                                    <TableHead>Hirer to Worker</TableHead>
                                    <TableHead>Date</TableHead>
                                    <TableHead>Amount</TableHead>
                                    <TableHead>Status</TableHead>
                                </TableRow>
                            </TableHeader>
                            <TableBody>
                                {transactions.map((tx) => (
                                    <TableRow key={tx.id}>
                                        <TableCell>
                                            <div className="flex items-center gap-3">
                                                <div className={`w-9 h-9 rounded-xl flex items-center justify-center shrink-0 ${tx.status === 'completed' ? 'bg-emerald-50' : 'bg-amber-50'}`}>
                                                    {tx.status === 'completed' ? (
                                                        <ArrowDownLeft size={16} className="text-emerald-500" />
                                                    ) : (
                                                        <ArrowUpRight size={16} className="text-amber-500" />
                                                    )}
                                                </div>
                                                <div>
                                                    <p className="font-medium text-slate-800 text-sm">{tx.description}</p>
                                                    <p className="text-xs text-slate-400 font-mono">{tx.esewaCode || tx.id}</p>
                                                </div>
                                            </div>
                                        </TableCell>
                                        <TableCell>
                                            <p className="text-sm font-medium text-slate-700">{tx.hirer}</p>
                                            <p className="text-xs text-slate-400">to {tx.worker}</p>
                                        </TableCell>
                                        <TableCell className="text-sm text-slate-500">{tx.date}</TableCell>
                                        <TableCell>
                                            <span className={`font-semibold text-sm ${tx.status === 'completed' ? 'text-emerald-600' : 'text-amber-600'}`}>
                                                रु {tx.amount?.toLocaleString()}
                                            </span>
                                        </TableCell>
                                        <TableCell>
                                            <Badge variant={statusVariant(tx.status)} className="capitalize">
                                                {tx.status}
                                            </Badge>
                                        </TableCell>
                                    </TableRow>
                                ))}
                            </TableBody>
                        </Table>
                    )}
                </CardContent>
            </Card>
        </div>
    );
};

export default AdminFinancials;
